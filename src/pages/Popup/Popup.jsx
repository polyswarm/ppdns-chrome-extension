import React, { useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import { SETTINGS_KEY, useSettingsStore, updateStorageField } from '../../common/settings';

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
        let now = Date.now();
        return setSettings((prevState) => {
          return {
            ...prevState,
            apiKey: event.target.value,
            apiKeyCheckedDate: now.toString(),
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
              {(apiKey || settings.apiKey) && (
                <span id="hidePw" onClick={onHidePasswordClick}>
                  {!hidePassword ? (
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABmJLR0QA/wD/AP+gvaeTAAAApklEQVQokcXQO2oCARDG8Z+PFIKNQcEIXsQmFhLBynK7VBY5QFJZ23gAGxtPIURbTyLpgoWojcqmmYVF0/uHgXkw3zx4FM9hdxRyfhVfKGEbtTbOmOKQb+ijF/EYS6QYYIIL1vguIkEdn9jhBa/ooonfmNxAUg6lNCZdsccwcodQz0izld7QwQIj/ES+hTnescHq9ugPVOJQeMIJMxz/+1pGLewB/AHcex/KQPg+OAAAAABJRU5ErkJggg==" />
                  ) : (
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABmJLR0QA/wD/AP+gvaeTAAAAsklEQVQoka3RMWpCQRQF0JP8GLGJYKMBQbGwsk5nYWvrEoS0aUyjYKVLsLFwGdlFGussQZuAjYhazBQf/R+F5MKDy5s79725wz+hiFLWwUOKP2GIV/ziiDK2WGJ/efkD7QzTBkZ/2reA8R26T7wkwq4VvGGdIx5gh+/H2DihgymaKWEdE/SwIaRUQx8rIaUyWtHkBwcs8I6v9NgEs8i7sWAuRH6FBNXIO7EI//Kc87bbOAN1WxczHoMyBgAAAABJRU5ErkJggg==" />
                  )}
                </span>
              )}
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
                There was an issue submitting data. Have you joined the{' '}
                <a
                  target="_blank"
                  href="https://polyswarm.network/account/rewards"
                >
                  NectarNet program?
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

  return await fetch(`${settings.baseUrl}/v3/public/accounts/whois`, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => { return response.ok })
    .catch((error) => console.error('error', error));
}

export default Popup;
