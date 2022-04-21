import { createChromeStorageStateHookLocal } from 'use-chrome-storage';
export const SETTINGS_KEY = 'settings';
export const INITIAL_VALUE = {
  apiKey: '',
};

export const useSettingsStore = createChromeStorageStateHookLocal(
  SETTINGS_KEY,
  INITIAL_VALUE
);
