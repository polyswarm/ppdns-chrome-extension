import { createChromeStorageStateHookLocal } from 'use-chrome-storage';
export const SETTINGS_KEY = 'settings';
export const INITIAL_VALUE = {
  apiKey: '',
  ingestSuccess: '',
  resolutionsSubmittedCount: '0',
  baseUrl: process.env.POLYSWARM_API_URL,
  snoozedUntil: '0',
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

export const updateStorageField = async (storage, key, field, value) => {
  let storage_map = await storage.get(key);
  storage_map[key][field] = value;
  return await storage.set(storage_map)
};
