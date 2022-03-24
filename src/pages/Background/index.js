import React from 'react';
import { SETTINGS_KEY, useSettingsStore } from '../../common/settings';

console.log('This is the background page.');
console.log('Put the background scripts here.');

class PpdnsBackground {
  constructor() {
    this.ppdnsL = new Map();
    this.ppdnsBatchSize = 10;
    // todo set from settings/opts

  }

  logPpdnsRequest(webRequestBody) {
    // todo check if we're opt in
    let url = new URL(webRequestBody.url);
    // todo filter extension
    let hostname = url.hostname;
    if (!['http:', 'https:', 'ws:', 'wss:'].includes(url.protocol)) {
      console.log('dropping scheme: ' + url.protocol);
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
    console.log('resolution: ' + hostname + ' ' + webRequestBody.ip);
    if (this.ppdnsL.size >= this.ppdnsBatchSize) {
      /* todo write sending function */
      /* todo get response and update contribution data per request */
      console.log('would log: ' + this.ppdnsL.size);
      this.submitPpdnsBatch();
    }
  }

  submitPpdnsBatch() {
    // todo for mariano or victor, some better JS dev than me... doing it OK here?
    /* TODO ttl on ppdns resolutions ... there are alot of same IPs and this is rather high volume, almost want a bloom ttl */

    /* todo throw error on API key fail */

    chrome.storage.local.get(SETTINGS_KEY, this.cbX.bind(this));

  }

  cbX(result){
    let data = {
      resolutions: Array.from(this.ppdnsL.values()),
    };
    if(typeof result.settings === "undefined" || typeof result.settings.apiKey === "undefined"){
          console.log('no settings in local store');
          return;
        }
        let apiK = result.settings ? result.settings.apiKey : '';
        if (apiK === undefined || apiK == '') {
          console.log('failed to get API k from local storage');
          return;
        }

        let baseUrl = 'http://localhost:9696/v3/ppdns';
        let headers = {
          // todo grab from settings!
          Authorization: apiK,
          'Content-Type': 'application/json',
        };
        // todo wanted to use axios, but it needs fetch adapter
        fetch(baseUrl + '/ingest/', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            this.ppdnsL.clear();
            console.log(data);
          })
          .catch((error) => {
            console.error('Error posting ingest: ', error);
          });
  }

  updateSettings(result) {
    // todo
  }
}

let ppdnsBG = new PpdnsBackground();
let logPpdnsHndlr = ppdnsBG.logPpdnsRequest.bind(ppdnsBG);
chrome.webRequest.onResponseStarted.addListener(logPpdnsHndlr, {
  urls: ['<all_urls>'],
});
