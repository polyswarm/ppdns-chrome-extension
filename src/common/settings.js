import { createChromeStorageStateHookLocal } from 'use-chrome-storage';
export const SETTINGS_KEY = 'settings';
export const INITIAL_VALUE = {
  apiKey: '',
  apiKeyCheckedDate: '0',
  ingestSuccess: '',
  ingestSuccessDate: '0',
  resolutionsSubmittedCount: '0',
  baseUrl: process.env.POLYSWARM_API_URL,
  snoozedUntil: '0',
};

export const isFirefox = typeof InstallTrigger !== 'undefined';

export const useSettingsStore = createChromeStorageStateHookLocal(
  SETTINGS_KEY,
  INITIAL_VALUE
);

export const initStorage = async (storage) => {
  let storage_map = await storage.get(SETTINGS_KEY);
  if (isStorageEmpty(storage_map)){
    let storage_map = {};  // May still be "undefined" on Firefox
    storage_map[SETTINGS_KEY] = INITIAL_VALUE;
    await storage.set(storage_map).then(res => console.debug('Initialized %s: %s', SETTINGS_KEY, res));
  }
};

export const updateStorageField = async (storage, key, field, value) => {
  console.debug('Updating the local storage with: %s.%s = %s', key, field, value);

  let storage_map = await storage.get(key);
  if (isStorageEmpty(storage_map)){
    console.info('Storage key "%s" found empty. Initializing with default data', key);
    await initStorage(storage);
    storage_map = await storage.get(key);
  }
  storage_map[key][field] = value;
  return await storage.set(storage_map)
};

export const isStorageEmpty = (storage_map) => {
  // Empty values: on Firefox => undefined; on Chrome => {};
  if (typeof storage_map == 'undefined' || Object.keys(storage_map).length == 0){
    return true
  } else {
    return false
  }
};
