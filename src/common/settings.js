import { createChromeStorageStateHookLocal } from 'use-chrome-storage';
import { useEffect, useState } from 'react';
export const SETTINGS_KEY = 'settings';
export const INITIAL_VALUE = {
  apiKey: '',
};

export const useSettingsStore = createChromeStorageStateHookLocal(
  SETTINGS_KEY,
  INITIAL_VALUE
);
