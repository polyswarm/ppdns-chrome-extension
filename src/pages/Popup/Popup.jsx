import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import { useSettingsStore } from '../../common/settings';

const Popup = () => {
  const [settings, setSettings] = useSettingsStore();

  const handleChange = (event) => {
    setSettings((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  settings.apiKeyValidated = true; // TODO: actual validation in background class

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form>
          <div
            id="apiKeyWrapper"
            className={
              settings.apiKey && !settings.apiKeyValidated ? 'invalid' : ''
            }
          >
            <input
              type="text"
              name="apiKey"
              placeholder="  "
              value={settings.apiKey}
              onChange={handleChange}
            />
            <label class="api-key-label">API Key</label>
            {settings.apiKey && !settings.apiKeyValidated && (
              <label class="invalid message">Invalid</label>
            )}
            {settings.apiKey && settings.apiKeyValidated && (
              <label class="valid message">Valid</label>
            )}
          </div>
        </form>
      </header>
    </div>
  );
};

export default Popup;
