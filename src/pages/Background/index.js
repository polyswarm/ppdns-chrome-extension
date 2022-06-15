import debounce from 'lodash.debounce';
import { SETTINGS_KEY } from '../../common/settings';

class PpdnsBackground {
  constructor() {
    this.ppdnsL = new Map();
    this.ppdnsBatchSize = process.env.BATCH_SIZE;
    this.submitInProgress = false;
    this.debouncedSubmitPpdnsBatch = debounce(this.submitPpdnsBatch, 500);
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

    if (webRequestBody.ip != null && hostname != null) {
      // todo check if we're a private IP space or proxy
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

  submitPpdnsBatch() {
    /* TODO ttl on ppdns resolutions ... there are alot of same IPs and this is rather high volume, almost want a bloom ttl */
    /* todo throw error on API key fail */
    chrome.storage.local.get(SETTINGS_KEY, this.cbX.bind(this));
  }

  cbX(result) {
    this.submitInProgress = true;
    // copy records and clear map immedietly, so we don't submit duplicates
    let toSubmit = new Map(this.ppdnsL);
    this.ppdnsL.clear();
    let data = {
      resolutions: Array.from(toSubmit.values()),
    };
    if (
      typeof result.settings === 'undefined' ||
      typeof result.settings.apiKey === 'undefined'
    ) {
      console.error('no settings in local store');
      this.submitInProgress = false;
      return;
    }
    let apiKey = result.settings ? result.settings.apiKey : '';
    if (apiKey === undefined || apiKey == '') {
      console.error('failed to get API key from local storage');
      this.submitInProgress = false;
      return;
    }

    let baseUrl = result.settings.baseUrl || process.env.AI_BASE_URL;
    let headers = {
      // todo grab from settings!
      Authorization: apiKey,
      'Content-Type': 'application/json',
    };
    // todo wanted to use axios, but it needs fetch adapter
    fetch(baseUrl + '/v3/telemetry/', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => console.info(data))
      .catch((error) => {
        console.error('Error posting ingest:', error);
      })
      .finally(() => {
        this.submitInProgress = false;
      });
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
