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

export const initStorage = async (storage) => {
  if (Object.keys(await storage.get(SETTINGS_KEY).length == 0)){
    let storage_map = {};
    storage_map[SETTINGS_KEY] = INITIAL_VALUE;
    await storage.set(storage_map);
  }
};

export const updateStorageField = async (storage, key, field, value) => {
  let storage_map = await storage.get(key);
  if (Object.keys(storage_map).length == 0){
    await initStorage(storage);
    storage_map = await storage.get(key);
  }
  storage_map[key][field] = value;
  return await storage.set(storage_map)
};
