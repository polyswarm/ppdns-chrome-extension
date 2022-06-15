import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import { useSettingsStore } from '../../common/settings';

const Popup = () => {
  const [settings, setSettings] = useSettingsStore();
  const [valid, setValid] = useState(!!settings.apiKey);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const handleChange = (event) => {
    setApiKey(event.target.value);
    validateAPIKey(event.target.value, settings).then((valid) => {
      setValid(valid);
      if (valid) {
        return setSettings((prevState) => {
          return { ...prevState, apiKey: event.target.value };
        });
      }
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
              type="password"
              name="apiKey"
              placeholder="  "
              defaultValue={settings.apiKey}
              onChange={handleChange}
            />
            <label className="api-key-label">API Key</label>
            {apiKey && apiKey.length && !valid && (
              <label className="invalid message">Invalid</label>
            )}
            {apiKey && valid && <label className="valid message">Valid</label>}
          </div>
        </form>
      </header>
    </div>
  );
};

async function validateAPIKey(apiKey, settings) {
  if (!apiKey || apiKey.length != 32) {
    return false;
  }

  return await fetch(`${settings.baseUrl}/v2/instance`, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => response.ok)
    .catch((error) => console.error('error', error));
}

export default Popup;
