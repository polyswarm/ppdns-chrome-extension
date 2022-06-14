import { createChromeStorageStateHookLocal } from 'use-chrome-storage';
export const SETTINGS_KEY = 'settings';
export const INITIAL_VALUE = {
  apiKey: '',
  ingestSuccess: '',
  resolutionsSubmittedCount: '0',
};

export const useSettingsStore = createChromeStorageStateHookLocal(
  SETTINGS_KEY,
  INITIAL_VALUE
);
