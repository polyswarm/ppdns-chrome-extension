import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import { useSettingsStore } from '../../common/settings';

const Popup = () => {
  const [settings, setSettings] = useSettingsStore();
  const [valid, setValid] = useState('');
  const handleChange = (event) => {
    validateAPIKey(event.target.value).then((valid) => {
      if (valid) {
        setSettings((prevState) => {
          return { ...prevState, apiKey: event.target.value };
        });
      }
      setValid(valid);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form>
          <div
            id="apiKeyWrapper"
            className={settings.apiKey && !valid ? 'invalid' : ''}
          >
            <input
              type="text"
              name="apiKey"
              placeholder="  "
              defaultValue={settings.apiKey}
              onChange={handleChange}
            />
            <label class="api-key-label">API Key</label>
            {settings.apiKey && valid == false && (
              <label class="invalid message">Invalid</label>
            )}
            {settings.apiKey && valid && (
              <label class="valid message">Valid</label>
            )}
          </div>
        </form>
      </header>
    </div>
  );
};

async function validateAPIKey(apiKey) {
  var APIKEYMGMT_BASE_URL = 'http://apikeymgmt-e2e:5000';
  if (!apiKey || apiKey.length != 32) {
    return false;
  }

  return await fetch(`${APIKEYMGMT_BASE_URL}/v1/accounts?api_key=${apiKey}`)
    .then((response) => response.ok)
    .catch((error) => console.log('error', error));
}

export default Popup;
