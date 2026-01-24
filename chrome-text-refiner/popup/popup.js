/**
 * AI Text Refiner - Popup Script
 * Handles settings management and UI interactions
 */

import { getSettings, saveSettings, DEFAULT_SETTINGS } from '../utils/storage.js';

// Rate limiting state (not used in popup but good to be consistent)
let localApiKeys = {};

// Model options for each provider
const MODEL_OPTIONS = {
  gemini: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Recommended)' },
    { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite (Fastest)' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Best Quality)' },
    { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
    { value: 'gemini-2.0-flash-001', label: 'Gemini 2.0 Flash 001 (Stable)' },
    { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash-Lite' },
    { value: 'gemini-2.0-flash-lite-001', label: 'Gemini 2.0 Flash-Lite 001 (Stable)' }
  ],
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
  ],
  anthropic: [
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
  ],
  custom: [
    { value: 'custom', label: 'Custom Model' }
  ]
};

// DOM Elements
const elements = {
  // Main controls
  extensionEnabled: document.getElementById('extensionEnabled'),

  // Provider settings
  provider: document.getElementById('provider'),
  customEndpointGroup: document.getElementById('customEndpointGroup'),
  customEndpoint: document.getElementById('customEndpoint'),

  // API settings
  apiKey: document.getElementById('apiKey'),
  toggleApiKey: document.getElementById('toggleApiKey'),
  testApiBtn: document.getElementById('testApiBtn'),
  getApiKeyLink: document.getElementById('getApiKeyLink'),
  model: document.getElementById('model'),
  temperature: document.getElementById('temperature'),
  temperatureValue: document.getElementById('temperatureValue'),
  maxTokens: document.getElementById('maxTokens'),

  // Refinement settings
  style: document.getElementById('style'),
  customInstructionsGroup: document.getElementById('customInstructionsGroup'),
  customInstructions: document.getElementById('customInstructions'),

  // UI settings
  showOnHoverOnly: document.getElementById('showOnHoverOnly'),
  enableKeyboardShortcut: document.getElementById('enableKeyboardShortcut'),
  enableUndo: document.getElementById('enableUndo'),
  darkMode: document.getElementById('darkMode'),

  // Action buttons
  saveBtn: document.getElementById('saveBtn'),
  resetBtn: document.getElementById('resetBtn'),

  // Toast
  toast: document.getElementById('toast')
};

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  const toast = elements.toast;
  const icon = toast.querySelector('.toast-icon');
  const msg = toast.querySelector('.toast-message');

  // Set content
  msg.textContent = message;
  toast.className = `toast toast-${type} show`;

  // Icon
  if (type === 'success') icon.textContent = '✅';
  else if (type === 'error') icon.textContent = '❌';
  else if (type === 'warning') icon.textContent = '⚠️';
  else icon.textContent = 'ℹ️';

  // Auto hide
  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

/**
 * Initialize the popup
 */
async function init() {
  // Load saved settings
  const settings = await getSettings();
  populateForm(settings);

  // Set up event listeners
  setupEventListeners();

  // Apply dark mode if enabled
  if (settings.darkMode) {
    document.body.classList.add('dark-mode');
  }
}

/**
 * Populate form with saved settings
 */
function populateForm(settings) {
  // Main toggle
  elements.extensionEnabled.checked = settings.enabled;

  // Provider
  elements.provider.value = settings.provider;
  updateProviderUI(settings.provider);

  // Custom endpoint
  elements.customEndpoint.value = settings.customEndpoint || '';

  // API settings
  localApiKeys = settings.apiKeys || {};
  // Migration for legacy single key or if apiKey is set but not in apiKeys
  if (!localApiKeys[settings.provider] && settings.apiKey) {
    localApiKeys[settings.provider] = settings.apiKey;
  }

  elements.apiKey.value = localApiKeys[settings.provider] || '';
  updateModelOptions(settings.provider, settings.model);
  elements.temperature.value = settings.temperature;
  elements.temperatureValue.textContent = settings.temperature;
  elements.maxTokens.value = settings.maxTokens;

  // Refinement style
  elements.style.value = settings.style;
  updateStyleUI(settings.style);
  elements.customInstructions.value = settings.customInstructions || '';

  // UI settings
  elements.showOnHoverOnly.checked = settings.showOnHoverOnly;
  elements.enableKeyboardShortcut.checked = settings.enableKeyboardShortcut;
  elements.enableUndo.checked = settings.enableUndo;
  elements.darkMode.checked = settings.darkMode;
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Provider change
  elements.provider.addEventListener('change', (e) => {
    const provider = e.target.value;
    updateProviderUI(provider);
    updateModelOptions(provider);
    updateApiKeyLink(provider);

    // Update API Key field for the new provider
    elements.apiKey.value = localApiKeys[provider] || '';
  });

  // Style change
  elements.style.addEventListener('change', (e) => {
    updateStyleUI(e.target.value);
  });

  // Temperature slider
  elements.temperature.addEventListener('input', (e) => {
    elements.temperatureValue.textContent = e.target.value;
  });

  // Toggle API key visibility
  elements.toggleApiKey.addEventListener('click', () => {
    const type = elements.apiKey.type === 'password' ? 'text' : 'password';
    elements.apiKey.type = type;
    elements.toggleApiKey.querySelector('.eye-icon').textContent =
      type === 'password' ? '👁️' : '🙈';
  });

  // Dark mode toggle
  elements.darkMode.addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
  });

  // Save button
  elements.saveBtn.addEventListener('click', handleSave);

  // Reset button
  elements.resetBtn.addEventListener('click', handleReset);

  // Test API button
  elements.testApiBtn.addEventListener('click', handleTestApi);

  // Get API Key link
  elements.getApiKeyLink.addEventListener('click', (e) => {
    e.preventDefault();
    const provider = elements.provider.value;
    const urls = {
      gemini: 'https://aistudio.google.com/app/apikey',
      openai: 'https://platform.openai.com/api-keys',
      anthropic: 'https://console.anthropic.com/',
      custom: 'https://example.com'
    };
    if (urls[provider]) {
      chrome.tabs.create({ url: urls[provider] });
    }
  });

  // Extension enabled toggle - save immediately
  elements.extensionEnabled.addEventListener('change', async (e) => {
    const settings = await getSettings();
    settings.enabled = e.target.checked;
    await saveSettings(settings);
    showToast(e.target.checked ? 'Extension enabled' : 'Extension disabled', 'success');

    // Notify content scripts
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'SETTINGS_UPDATED',
          settings
        }).catch(() => { });
      }
    });
  });
}

/**
 * Update UI based on selected provider
 */
function updateProviderUI(provider) {
  const isCustom = provider === 'custom';
  elements.customEndpointGroup.style.display = isCustom ? 'block' : 'none';
}

/**
 * Update model dropdown based on provider
 */
function updateModelOptions(provider, selectedModel = null) {
  const options = MODEL_OPTIONS[provider] || [];
  elements.model.innerHTML = '';

  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    elements.model.appendChild(option);
  });

  if (selectedModel) {
    elements.model.value = selectedModel;
  }
}

/**
 * Update UI based on selected style
 */
function updateStyleUI(style) {
  const isCustom = style === 'custom';
  elements.customInstructionsGroup.style.display = isCustom ? 'block' : 'none';
}

/**
 * Handle save button click
 */
async function handleSave() {
  elements.saveBtn.disabled = true;
  elements.saveBtn.classList.add('loading');

  try {
    // Validate inputs
    const apiKey = elements.apiKey.value.trim();
    if (!apiKey) {
      showToast('Please enter an API key', 'error');
      return;
    }

    const provider = elements.provider.value;
    if (provider === 'custom' && !elements.customEndpoint.value.trim()) {
      showToast('Please enter a custom endpoint URL', 'error');
      return;
    }

    // Collect settings
    const settings = {
      enabled: elements.extensionEnabled.checked,
      provider: provider,
      customEndpoint: elements.customEndpoint.value.trim(),
      apiKey: apiKey,
      model: elements.model.value,
      temperature: parseFloat(elements.temperature.value),
      maxTokens: parseInt(elements.maxTokens.value, 10),
      style: elements.style.value,
      customInstructions: elements.customInstructions.value.trim(),
      showOnHoverOnly: elements.showOnHoverOnly.checked,
      enableKeyboardShortcut: elements.enableKeyboardShortcut.checked,
      enableUndo: elements.enableUndo.checked,
      darkMode: elements.darkMode.checked
    };

    // Update local keys and settings
    localApiKeys[provider] = apiKey;
    settings.apiKeys = localApiKeys;

    // Save settings
    await saveSettings(settings);

    // Notify background script
    chrome.runtime.sendMessage({ type: 'SETTINGS_UPDATED', settings });

    // Notify content scripts
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'SETTINGS_UPDATED',
          settings
        }).catch(() => { });
      });
    });

    showToast('Settings saved successfully!', 'success');
  } catch (error) {
    console.error('Error saving settings:', error);
    showToast('Failed to save settings', 'error');
  } finally {
    elements.saveBtn.disabled = false;
    elements.saveBtn.classList.remove('loading');
  }
}

/**
 * Handle reset button click
 */
async function handleReset() {
  if (!confirm('Are you sure you want to reset all settings to defaults?')) {
    return;
  }

  try {
    // Keep the API key when resetting
    const currentSettings = await getSettings();
    const resetSettings = {
      ...DEFAULT_SETTINGS,
      apiKey: currentSettings.apiKey
    };

    await saveSettings(resetSettings);
    populateForm(resetSettings);

    // Apply/remove dark mode
    document.body.classList.toggle('dark-mode', resetSettings.darkMode);

    showToast('Settings reset to defaults', 'success');
  } catch (error) {
    console.error('Error resetting settings:', error);
    showToast('Failed to reset settings', 'error');
  }
}

/**
 * Update API key link based on provider
 */
function updateApiKeyLink(provider) {
  const urls = {
    gemini: 'https://aistudio.google.com/app/apikey',
    openai: 'https://platform.openai.com/api-keys',
    anthropic: 'https://console.anthropic.com/',
    custom: '#'
  };

  elements.getApiKeyLink.href = urls[provider] || '#';
}

/**
 * Handle Test API button click
 */
async function handleTestApi() {
  const apiKey = elements.apiKey.value.trim();

  if (!apiKey) {
    showToast('Please enter an API key first', 'warning');
    return;
  }

  elements.testApiBtn.disabled = true;
  elements.testApiBtn.classList.add('loading');

  try {
    const provider = elements.provider.value;
    const model = elements.model.value;
    const testText = 'Hello';

    // Send test request to background
    const response = await chrome.runtime.sendMessage({
      type: 'TEST_API_KEY',
      provider: provider,
      apiKey: apiKey,
      model: model,
      text: testText
    });

    if (response.error) {
      showToast(`API Error: ${response.error}`, 'error');
    } else {
      showToast('✅ API key is working!', 'success');
    }
  } catch (error) {
    console.error('Test error:', error);
    showToast('Failed to test API key', 'error');
  } finally {
    elements.testApiBtn.disabled = false;
    elements.testApiBtn.classList.remove('loading');
  }
}



// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
