import { SeoInspectorSettings, DEFAULT_SETTINGS } from '../types/seo';

const SETTINGS_STORAGE_KEY = 'seo_inspector_settings_v1';
const LOCAL_LEGACY_KEY_STORAGE = 'seo_inspector_legacy_pagespeed_key';

/**
 * Loads persistent settings, migrating any legacy API key from sync to local storage
 */
export async function getStoredSettings(): Promise<SeoInspectorSettings> {
  let settings: SeoInspectorSettings = { ...DEFAULT_SETTINGS };

  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      // 1. Read sync settings
      const syncData = await new Promise<any>((resolve) => {
        if (!chrome.storage.sync) return resolve({});
        chrome.storage.sync.get([SETTINGS_STORAGE_KEY], (res) => {
          if (chrome.runtime.lastError || !res) resolve({});
          else resolve(res[SETTINGS_STORAGE_KEY] || {});
        });
      });

      // 2. Read local fallback or primary local settings
      const localData = await new Promise<any>((resolve) => {
        if (!chrome.storage.local) return resolve({});
        chrome.storage.local.get([SETTINGS_STORAGE_KEY, LOCAL_LEGACY_KEY_STORAGE], (res) => {
          if (chrome.runtime.lastError || !res) resolve({});
          else resolve(res || {});
        });
      });

      const fallbackLocalSettings = localData[SETTINGS_STORAGE_KEY] || {};
      settings = { ...DEFAULT_SETTINGS, ...fallbackLocalSettings, ...syncData };

      // 3. Check for existing key in syncData or local storage
      const keyInSync = syncData.googlePageSpeedApiKey;
      const keyInLocal = localData[LOCAL_LEGACY_KEY_STORAGE] || fallbackLocalSettings.googlePageSpeedApiKey;

      if (keyInSync && keyInSync.trim().length > 0) {
        // Idempotent migration: save to chrome.storage.local first
        await new Promise<void>((resolve) => {
          chrome.storage.local.set({ [LOCAL_LEGACY_KEY_STORAGE]: keyInSync }, () => {
            if (!chrome.runtime.lastError) {
              // Successfully saved locally; now strip key from sync storage so future browser sync never carries it
              const sanitizedSync = { ...syncData };
              delete sanitizedSync.googlePageSpeedApiKey;
              chrome.storage.sync.set({ [SETTINGS_STORAGE_KEY]: sanitizedSync }, () => resolve());
            } else {
              resolve();
            }
          });
        });
        settings.googlePageSpeedApiKey = keyInSync;
      } else if (keyInLocal) {
        settings.googlePageSpeedApiKey = keyInLocal;
      }
      return settings;
    }

    // Fallback to window.localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    }
  } catch (err) {
    console.warn('[settingsService] Failed to load stored settings, using defaults:', err);
  }

  return settings;
}

/**
 * Persists updated settings to chrome.storage.sync, strictly omitting googlePageSpeedApiKey from sync writes
 */
export async function saveStoredSettings(
  updated: Partial<SeoInspectorSettings>
): Promise<SeoInspectorSettings> {
  const current = await getStoredSettings();
  const merged: SeoInspectorSettings = { ...current, ...updated };

  // Prepare sanitized settings object for chrome.storage.sync (strip API key)
  const syncPayload: Partial<SeoInspectorSettings> = { ...merged };
  delete syncPayload.googlePageSpeedApiKey;

  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      if (chrome.storage.sync) {
        await new Promise<void>((resolve) => {
          chrome.storage.sync.set({ [SETTINGS_STORAGE_KEY]: syncPayload }, () => {
            if (chrome.runtime.lastError && chrome.storage.local) {
              chrome.storage.local.set({ [SETTINGS_STORAGE_KEY]: syncPayload }, () => resolve());
            } else {
              resolve();
            }
          });
        });
      }

      // If user had a legacy key preserved in merged, keep it in local storage only
      if (merged.googlePageSpeedApiKey && chrome.storage.local) {
        chrome.storage.local.set({ [LOCAL_LEGACY_KEY_STORAGE]: merged.googlePageSpeedApiKey });
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(syncPayload));
    }
  } catch (err) {
    console.error('[settingsService] Failed to persist settings:', err);
  }

  return merged;
}

/**
 * Resets settings back to factory defaults
 */
export async function resetStoredSettings(): Promise<SeoInspectorSettings> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      if (chrome.storage.sync) {
        chrome.storage.sync.remove([SETTINGS_STORAGE_KEY]);
      }
      if (chrome.storage.local) {
        chrome.storage.local.remove([SETTINGS_STORAGE_KEY, LOCAL_LEGACY_KEY_STORAGE]);
      }
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }
  } catch (err) {
    console.warn('[settingsService] Failed to reset storage:', err);
  }

  return { ...DEFAULT_SETTINGS };
}
