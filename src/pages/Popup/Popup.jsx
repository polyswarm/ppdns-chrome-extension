import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import { useSettingsStore } from '../../common/settings';

const Popup = () => {
  const [settings, setSettings] = useSettingsStore();
  const [valid, setValid] = useState(!!settings.apiKey);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [hidePassword, setHidePassword] = useState(true);
  const handleChange = (event) => {
    setApiKey(event.target.value);
    validateAPIKey(event.target.value, settings).then((valid) => {
      setValid(valid);
      settings.ingestSuccess = '';
      if (valid) {
        return setSettings((prevState) => {
          return {
            ...prevState,
            apiKey: event.target.value,
          };
        });
      }
    });
  };
  const onHidePasswordClick = (event) => {
    event.preventDefault();
    setHidePassword(!hidePassword);
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
            <div className="input-wrapper">
              <input
                type={hidePassword ? 'password' : 'text'}
                name="apiKey"
                placeholder="  "
                defaultValue={settings.apiKey}
                onChange={handleChange}
              />
              <label className="api-key-label">API Key</label>
              {apiKey && apiKey.length && !valid && (
                <label className="invalid message">Invalid</label>
              )}
              {apiKey && valid && (
                <label className="valid message">Valid</label>
              )}
              <span id="hidePw" onClick={onHidePasswordClick}>
                {!hidePassword ? 'hide' : 'show'}
              </span>
            </div>
          </div>
          {settings.resolutionsSubmittedCount && (
            <div className="resolutions">
              {settings.resolutionsSubmittedCount} total resolutions submitted
            </div>
          )}
          {settings.apiKey &&
            settings.apiKey.length &&
            settings.ingestSuccess == 'false' && (
              <div className="ingest-failure">
                There was an issue submitting data. Have you joined the beta?{' '}
                <a
                  target="_blank"
                  href="https://docs.polyswarm.io/consumers/rewards/#rewards"
                >
                  Read the docs.
                </a>
              </div>
            )}
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
