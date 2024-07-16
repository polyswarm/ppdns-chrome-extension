import { createChromeStorageStateHookLocal } from 'use-chrome-storage';
export const SETTINGS_KEY = 'settings';
export const INITIAL_VALUE = {
  apiKey: '',
  ingestSuccess: '',
  resolutionsSubmittedCount: '0',
  baseUrl: process.env.POLYSWARM_API_URL,
};

export const useSettingsStore = createChromeStorageStateHookLocal(
  SETTINGS_KEY,
  INITIAL_VALUE
);

export const initStorage = (storage) => {
  if (!!storage.get(SETTINGS_KEY)){
    let storage_map = {};
    storage_map[SETTINGS_KEY] = INITIAL_VALUE;
    storage.set(storage_map);
  }
};
