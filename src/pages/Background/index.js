import debounce from 'lodash.debounce';
import {SETTINGS_KEY, initStorage, updateStorageField, isStorageEmpty, isFirefox} from '../../common/settings';


class PpdnsBackground {
  constructor() {
    // Use the Firefox API in Chrome
    if (isFirefox){
      this.storage = browser.storage.local;
    }else{
      this.storage = chrome.storage.local;
    }

    this.ppdnsL = new Map();
    this.ppdnsBatchSize = parseInt(process.env.BATCH_SIZE);
    this.submitInProgress = false;
    this.debouncedSubmitPpdnsBatch = debounce(this.submitPpdnsBatch, 500);
    this.version = null;
    this.getVersion().finally(() => {
      console.info('Extension version detected: ' + this.version);
    });

    this.initStorage();
  }

  async initStorage() {
    let storage_map = await this.storage.get(SETTINGS_KEY);
    if (isStorageEmpty(storage_map)){
      await initStorage(this.storage);
    }
  }

  async getVersion() {
    if (!this.version) {
      try {
        console.debug('Assuming to be running in a Chrome-ish browser.');
        this.version = (await chrome.management.getSelf()).version;
      } catch (error) {
        console.debug('Not in a Chrome-ish browser, or something changed.');
      }

      if (!this.version) {
        try {
          console.debug('Assuming to be running in a Firefox browser.');
          this.version = (await browser.management.getSelf()).version;
        } catch (error) {
          console.debug('Not in a Firefox browser, or something changed.');
          console.info('Letting the version "unknown"');
          this.version = '(unknown)';
        }
      }
    }

    return this.version;
  }

  logPpdnsRequest(webRequestBody) {
    // todo check if we're opt in
    let url = new URL(webRequestBody.url);
    // todo filter extension
    let hostname = url.hostname;
    if (!['http:', 'https:', 'ws:', 'wss:'].includes(url.protocol)) {
      console.warn('dropping scheme: ' + url.protocol);
      return null;
    }

    if (!this.validateTelemetry(hostname, webRequestBody.ip)) {
      console.warn(
        `dropping resolution because a value is missing. host_name:${hostname} ip_address:${webRequestBody.ip}`
      );
      return;
    }
    let ppdnsK = hostname + webRequestBody.ip;
    if (this.ppdnsL[ppdnsK] != undefined) {
      return;
    }
    this.ppdnsL.set(ppdnsK, {
      type: 'Resolution',
      attributes: {
        host_name: hostname,
        ip_address: webRequestBody.ip,
      },
    });
    console.info('resolution: ' + hostname + ' ' + webRequestBody.ip);
    if (!this.submitInProgress && this.ppdnsL.size >= this.ppdnsBatchSize) {
      this.debouncedSubmitPpdnsBatch();
    }
  }

  validateTelemetry(hostname, ip) {
    if (!hostname || !ip) {
      return false;
    }
    return true;
  }

  submitPpdnsBatch() {
    /* TODO ttl on ppdns resolutions ... there are alot of same IPs and this is rather high volume, almost want a bloom ttl */
    /* todo throw error on API key fail */
    this.storage.get(SETTINGS_KEY, this.cbX.bind(this));
  }

  cbX(result) {
    this.submitInProgress = true;
    // copy records and clear map immedietly, so we don't submit duplicates
    let toSubmit = new Map(this.ppdnsL);
    this.ppdnsL.clear();
    let data = {
      resolutions: Array.from(toSubmit.values()),
      sender_version: this.version,
    };
    if (
      typeof result.settings === 'undefined' ||
      typeof result.settings.apiKey === 'undefined'
    ) {
      console.warn('no settings in local store');
      this.submitInProgress = false;
      this.storage.get(SETTINGS_KEY, this.ingestError.bind(this));
      return;
    }
    let apiKey = result.settings ? result.settings.apiKey : '';
    if (apiKey === undefined || apiKey == '') {
      console.error('failed to get API key from local storage');
      this.submitInProgress = false;
      this.storage.get(SETTINGS_KEY, this.ingestError.bind(this));
      return;
    }

    let baseUrl = result.settings.baseUrl || process.env.POLYSWARM_API_URL;
    let headers = {
      // todo grab from settings!
      Authorization: apiKey,
      'Content-Type': 'application/json',
    };
    // todo wanted to use axios, but it needs fetch adapter
    fetch(baseUrl + '/v3/telemetry', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['status'] == 'OK') {
          this.storage.get(
            SETTINGS_KEY,
            this.incrementResolutionCount.bind(this)
          );
        } else {
          // key is valid, but likely lacks requried features
          this.storage.get(SETTINGS_KEY, this.ingestError.bind(this));
          console.error('Recieved unexpected response:', data);
        }
      })
      .catch((error) => {
        console.error('Error making request:', error);
        this.storage.get(SETTINGS_KEY, this.ingestError.bind(this));
      })
      .finally(() => {
        this.submitInProgress = false;
      });
  }

  async ingestError(result) {
    await updateStorageField(this.storage, SETTINGS_KEY, 'ingestSuccess', 'false');

    const snoozedUntil = (await this.storage.get(SETTINGS_KEY))[SETTINGS_KEY].snoozedUntil;
    if (Number(snoozedUntil) >= Date.now()){
      // Snoozed.
      console.info('Notification: ingestError [snoozed until %s]', snoozedUntil);
      return
    }

    let notificationOptions = {
      type: 'basic',
      iconUrl: 'icon-34.png',
      title: 'Error submitting data',
      message: 'There was an issue submitting data.',
      contextMessage: 'PolySwarm Extension',
      priority: 2,
      silent: true,
      buttons: [
        { title: 'Snooze until tomorrow' },
        { title: 'Dismiss' },
      ],
    }
    if (isFirefox){
      delete notificationOptions.silent;
      delete notificationOptions.buttons;
    }

    chrome.notifications.create('ingestError', notificationOptions, function callback(notificationId) {
      console.info('Notification: ingestError');
      // nothing necessary here, but required before Chrome 42
    });

    chrome.notifications.onClicked.addListener(async (notificationId) => {
      console.debug('Notification clicked: %s', notificationId);
      // TODO: Open some detail page onClicked of notification
    });

    // Firefox accepts no buttons on notifications. Too bad for it.
    if (!isFirefox){
      chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
        console.debug('Button clicked: [%s] %s', notificationId, buttonIndex);
        if (notificationId != 'ingestError' || buttonIndex != 0){
          console.debug('No action for button %s click on notification %s', buttonIndex, notificationId);
          return
        }

        let currentSnoozedUntil = (await this.storage.get(SETTINGS_KEY))[SETTINGS_KEY].snoozedUntil;
        console.debug('Current "snoozedUntil": %s', currentSnoozedUntil);

        let snoozedUntil = (Date.now() + 86400000).toString(); // now + 1 day
        await updateStorageField(this.storage, SETTINGS_KEY, 'snoozedUntil', snoozedUntil)

        console.debug('Snoozed until %s', (await this.storage.get(SETTINGS_KEY))[SETTINGS_KEY].snoozedUntil);
      });
    }
  }

  incrementResolutionCount(result) {
    chrome.notifications.clear('ingestError');

    var count = parseInt(result.settings.resolutionsSubmittedCount);
    if (isNaN(count)) {
      count = this.ppdnsBatchSize;
    } else {
      count += this.ppdnsBatchSize;
    }

    updateStorageField(this.storage, SETTINGS_KEY, ingestSuccess, 'true');
    updateStorageField(this.storage, SETTINGS_KEY, resolutionsSubmittedCount, count.toString());
  }
}

let ppdnsBG = new PpdnsBackground();
let logPpdnsHndlr = ppdnsBG.logPpdnsRequest.bind(ppdnsBG);
let setupHandler = () => {
  if (!chrome.webRequest.onResponseStarted.hasListener(logPpdnsHndlr)) {
    chrome.webRequest.onResponseStarted.addListener(logPpdnsHndlr, {
      urls: ['<all_urls>'],
    });
  }
};

setupHandler();
chrome.webNavigation.onBeforeNavigate.addListener(setupHandler, {
  url: [{ schemes: ['http', 'https', 'ws', 'wss'] }],
});
