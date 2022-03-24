import React from 'react';
import logo from '../../assets/img/logo.svg';
import { createChromeStorageStateHookLocal } from 'use-chrome-storage';
import './Popup.css';
import { useSettingsStore } from '../../common/settings';

const Popup = () => {
  const [settings, setSettings, isPersistent, error] = useSettingsStore();

  const handleChange = (event) => {
    setSettings((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form>
          <input
            type="text"
            name="apiKey"
            value={settings.apiKey}
            onChange={handleChange}
            placeholder="hex api key"
            aria-label="hex api key"
          />
          <input type="submit" value="OK" />
        </form>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
      </header>
    </div>
  );
};

export default Popup;
