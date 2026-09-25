import { SeoInspectorSettings, DEFAULT_SETTINGS } from '../types/seo';

const SETTINGS_STORAGE_KEY = 'seo_inspector_settings_v1';

/**
 * Loads persistent settings from chrome.storage.sync, falling back to local or localStorage
 */
export async function getStoredSettings(): Promise<SeoInspectorSettings> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      return new Promise((resolve) => {
        chrome.storage.sync.get([SETTINGS_STORAGE_KEY], (result) => {
          if (chrome.runtime.lastError || !result[SETTINGS_STORAGE_KEY]) {
            // Check chrome.storage.local
            if (chrome.storage.local) {
              chrome.storage.local.get([SETTINGS_STORAGE_KEY], (localRes) => {
                if (localRes[SETTINGS_STORAGE_KEY]) {
                  resolve({ ...DEFAULT_SETTINGS, ...localRes[SETTINGS_STORAGE_KEY] });
                } else {
                  resolve({ ...DEFAULT_SETTINGS });
                }
              });
            } else {
              resolve({ ...DEFAULT_SETTINGS });
            }
          } else {
            resolve({ ...DEFAULT_SETTINGS, ...result[SETTINGS_STORAGE_KEY] });
          }
        });
      });
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

  return { ...DEFAULT_SETTINGS };
}

/**
 * Persists updated settings to chrome.storage.sync / local / localStorage
 */
export async function saveStoredSettings(
  updated: Partial<SeoInspectorSettings>
): Promise<SeoInspectorSettings> {
  const current = await getStoredSettings();
  const merged: SeoInspectorSettings = { ...current, ...updated };

  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      await new Promise<void>((resolve) => {
        chrome.storage.sync.set({ [SETTINGS_STORAGE_KEY]: merged }, () => {
          if (chrome.runtime.lastError) {
            // If sync fails (e.g. quota), save to local
            chrome.storage.local?.set({ [SETTINGS_STORAGE_KEY]: merged }, () => resolve());
          } else {
            resolve();
          }
        });
      });
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
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
        chrome.storage.local.remove([SETTINGS_STORAGE_KEY]);
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
