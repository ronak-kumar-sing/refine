/**
 * AI Text Refiner - Storage Utilities
 * Handles Chrome storage operations for settings
 */

/**
 * Default settings for the extension
 */
export const DEFAULT_SETTINGS = {
  // Extension state
  enabled: true,

  // LLM Provider settings
  provider: 'gemini',
  customEndpoint: '',
  apiKey: '', // Legacy support / Current active key
  apiKeys: {}, // Storage for multiple keys: { gemini: '', openai: '', ... }
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  maxTokens: 65536,

  // Refinement settings
  style: 'professional',
  customInstructions: '',

  // UI settings
  showOnHoverOnly: false,
  enableKeyboardShortcut: true,
  enableUndo: true,
  darkMode: false
};

/**
 * Get all settings from Chrome storage
 * @returns {Promise<Object>} Settings object
 */
export async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
      // Merge with defaults to ensure all keys exist
      resolve({ ...DEFAULT_SETTINGS, ...result });
    });
  });
}

/**
 * Save settings to Chrome storage
 * @param {Object} settings - Settings object to save
 * @returns {Promise<void>}
 */
export async function saveSettings(settings) {
  return new Promise((resolve, reject) => {
    // Validate settings before saving
    const validatedSettings = validateSettings(settings);

    chrome.storage.sync.set(validatedSettings, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Get a specific setting value
 * @param {string} key - Setting key
 * @returns {Promise<any>} Setting value
 */
export async function getSetting(key) {
  return new Promise((resolve) => {
    const defaultValue = DEFAULT_SETTINGS[key];
    chrome.storage.sync.get({ [key]: defaultValue }, (result) => {
      resolve(result[key]);
    });
  });
}

/**
 * Set a specific setting value
 * @param {string} key - Setting key
 * @param {any} value - Setting value
 * @returns {Promise<void>}
 */
export async function setSetting(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Clear all settings and reset to defaults
 * @returns {Promise<void>}
 */
export async function resetSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.clear(() => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        // Set default settings
        chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        });
      }
    });
  });
}

/**
 * Validate settings object
 * @param {Object} settings - Settings to validate
 * @returns {Object} Validated settings
 */
function validateSettings(settings) {
  const validated = { ...settings };

  // Validate provider
  const validProviders = ['gemini', 'openai', 'anthropic', 'custom'];
  if (!validProviders.includes(validated.provider)) {
    validated.provider = DEFAULT_SETTINGS.provider;
  }

  // Validate temperature (0-1)
  if (typeof validated.temperature !== 'number' ||
    validated.temperature < 0 ||
    validated.temperature > 1) {
    validated.temperature = DEFAULT_SETTINGS.temperature;
  }

  // Validate maxTokens (100-4096)
  if (typeof validated.maxTokens !== 'number' ||
    validated.maxTokens < 1 ||
    validated.maxTokens > 65536) {
    validated.maxTokens = DEFAULT_SETTINGS.maxTokens;
  }

  // Validate style
  const validStyles = ['professional', 'casual', 'concise', 'creative', 'custom'];
  if (!validStyles.includes(validated.style)) {
    validated.style = DEFAULT_SETTINGS.style;
  }

  // Validate boolean settings
  const booleanSettings = ['enabled', 'showOnHoverOnly', 'enableKeyboardShortcut', 'enableUndo', 'darkMode'];
  booleanSettings.forEach(key => {
    if (typeof validated[key] !== 'boolean') {
      validated[key] = DEFAULT_SETTINGS[key];
    }
  });

  // Sanitize string settings
  const stringSettings = ['apiKey', 'customEndpoint', 'customInstructions', 'model'];
  stringSettings.forEach(key => {
    if (typeof validated[key] !== 'string') {
      validated[key] = DEFAULT_SETTINGS[key];
    }
  });

  // Validate apiKeys object
  if (typeof validated.apiKeys !== 'object' || validated.apiKeys === null) {
    validated.apiKeys = {};
  }

  return validated;
}

/**
 * Listen for storage changes
 * @param {Function} callback - Callback function (changes, areaName) => void
 * @returns {Function} Unsubscribe function
 */
export function onSettingsChange(callback) {
  const listener = (changes, areaName) => {
    if (areaName === 'sync') {
      callback(changes, areaName);
    }
  };

  chrome.storage.onChanged.addListener(listener);

  // Return unsubscribe function
  return () => {
    chrome.storage.onChanged.removeListener(listener);
  };
}

/**
 * Get storage usage information
 * @returns {Promise<Object>} Storage usage info
 */
export async function getStorageUsage() {
  return new Promise((resolve) => {
    chrome.storage.sync.getBytesInUse(null, (bytesInUse) => {
      resolve({
        bytesUsed: bytesInUse,
        bytesTotal: chrome.storage.sync.QUOTA_BYTES,
        percentUsed: ((bytesInUse / chrome.storage.sync.QUOTA_BYTES) * 100).toFixed(2)
      });
    });
  });
}

/**
 * Export settings as JSON string
 * @returns {Promise<string>} JSON string of settings
 */
export async function exportSettings() {
  const settings = await getSettings();
  // Remove sensitive data
  const exportable = { ...settings };
  delete exportable.apiKey;
  return JSON.stringify(exportable, null, 2);
}

/**
 * Import settings from JSON string
 * @param {string} jsonString - JSON string of settings
 * @returns {Promise<void>}
 */
export async function importSettings(jsonString) {
  try {
    const imported = JSON.parse(jsonString);
    const current = await getSettings();

    // Merge imported settings with current, keeping API key
    const merged = {
      ...current,
      ...imported,
      apiKey: current.apiKey // Preserve API key
    };

    await saveSettings(merged);
  } catch (error) {
    throw new Error('Invalid settings format');
  }
}
