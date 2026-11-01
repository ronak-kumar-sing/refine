/**
 * AI Text Refiner - Popup Script
 * Handles settings management, UI interactions, quick refine, and import/export
 */

import { getSettings, saveSettings, DEFAULT_SETTINGS, exportSettings, importSettings } from '../utils/storage.js';

// Rate limiting state (not used in popup but good to be consistent)
let localApiKeys = {};

// Model options for each provider
const MODEL_OPTIONS = {
  experientiallabs: [
    { value: 'claude-opus-5.5', label: 'Claude Opus 5.5 (Flagship AI)' }
  ],
  gemini: [
    { value: 'gemini-3.8-flash-lite', label: 'Gemini 3.8 Flash-Lite (Fastest & High Availability)' },
    { value: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (Balanced)' },
    { value: 'gemini-3.8-pro', label: 'Gemini 3.8 Pro (Best Quality)' }
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

// Provider display names
const PROVIDER_NAMES = {
  experientiallabs: 'ExperientialLabs',
  gemini: 'Gemini',
  openai: 'OpenAI',
  anthropic: 'Claude',
  custom: 'Custom'
};

// Style display names
const STYLE_NAMES = {
  professional: 'Professional',
  casual: 'Casual',
  concise: 'Concise',
  creative: 'Creative',
  academic: 'Academic',
  persuasive: 'Persuasive',
  custom: 'Custom'
};

// DOM Elements
const elements = {
  // Main controls
  extensionEnabled: document.getElementById('extensionEnabled'),
  statusText: document.getElementById('statusText'),

  // Quick Refine
  quickRefineInput: document.getElementById('quickRefineInput'),
  quickRefineBtn: document.getElementById('quickRefineBtn'),
  quickCopyBtn: document.getElementById('quickCopyBtn'),

  // Stats
  totalRefinements: document.getElementById('totalRefinements'),
  currentProvider: document.getElementById('currentProvider'),
  currentStyle: document.getElementById('currentStyle'),

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

  // Import/Export
  exportBtn: document.getElementById('exportBtn'),
  importBtn: document.getElementById('importBtn'),
  importFile: document.getElementById('importFile'),

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
  }, 4000);
}

/**
 * Update status text in header
 */
function updateStatus(text) {
  if (elements.statusText) {
    elements.statusText.textContent = text;
  }
}

/**
 * Update stats bar
 */
async function updateStats(settings) {
  if (elements.totalRefinements) {
    const count = settings.totalRefinements || 0;
    elements.totalRefinements.textContent = count.toLocaleString();
  }
  if (elements.currentProvider) {
    elements.currentProvider.textContent = PROVIDER_NAMES[settings.provider] || settings.provider;
  }
  if (elements.currentStyle) {
    elements.currentStyle.textContent = STYLE_NAMES[settings.style] || settings.style;
  }
}

/**
 * Initialize the popup
 */
async function init() {
  // Load saved settings
  const settings = await getSettings();
  populateForm(settings);
  updateStats(settings);

  // Set up event listeners
  setupEventListeners();

  // Apply dark mode if enabled
  if (settings.darkMode) {
    document.body.classList.add('dark-mode');
  }

  // Update status
  updateStatus(settings.enabled ? 'Active — Ready to refine' : 'Disabled');
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
  if (!localApiKeys.experientiallabs) {
    localApiKeys.experientiallabs = 'xpl_9dd6bd8b21933881740fd22a8d4a304aca1841b4';
  }
  // Migration for legacy single key or if apiKey is set but not in apiKeys
  if (!localApiKeys[settings.provider] && settings.apiKey) {
    localApiKeys[settings.provider] = settings.apiKey;
  }

  elements.apiKey.value = localApiKeys[settings.provider] || '';
  let activeModel = settings.model;
  if (settings.provider === 'gemini' && (!activeModel || activeModel === 'gemini-2.5-flash' || activeModel.startsWith('gemini-2.'))) {
    activeModel = 'gemini-3.8-flash';
  } else if (settings.provider === 'experientiallabs' && !activeModel) {
    activeModel = 'claude-opus-5.5';
  }
  updateModelOptions(settings.provider, activeModel);
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
 * Debounce helper
 */
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Auto-save all current settings to Chrome storage
 */
async function autoSave(showNotification = false) {
  try {
    const existingSettings = await getSettings();
    const provider = elements.provider.value;
    const apiKey = elements.apiKey.value.trim();

    if (apiKey) {
      localApiKeys[provider] = apiKey;
    }

    const settings = {
      ...existingSettings,
      enabled: elements.extensionEnabled.checked,
      provider: provider,
      customEndpoint: elements.customEndpoint.value.trim(),
      apiKey: apiKey || localApiKeys[provider] || existingSettings.apiKey || '',
      apiKeys: localApiKeys,
      model: elements.model.value,
      temperature: parseFloat(elements.temperature.value),
      maxTokens: parseInt(elements.maxTokens.value, 10) || 65536,
      style: elements.style.value,
      customInstructions: elements.customInstructions.value.trim(),
      showOnHoverOnly: elements.showOnHoverOnly.checked,
      enableKeyboardShortcut: elements.enableKeyboardShortcut.checked,
      enableUndo: elements.enableUndo.checked,
      darkMode: elements.darkMode.checked,
      totalRefinements: existingSettings.totalRefinements || 0
    };

    await saveSettings(settings);

    // Notify background & tabs
    chrome.runtime.sendMessage({ type: 'SETTINGS_UPDATED', settings }).catch(() => {});
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { type: 'SETTINGS_UPDATED', settings }).catch(() => {});
      });
    });

    if (showNotification) {
      showToast('Settings saved!', 'success');
    }
  } catch (err) {
    console.error('Error auto-saving settings:', err);
  }
}

const debouncedAutoSave = debounce(() => autoSave(false), 300);

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

    // Update stats
    if (elements.currentProvider) {
      elements.currentProvider.textContent = PROVIDER_NAMES[provider] || provider;
    }

    autoSave();
  });

  // Model change - save immediately
  elements.model.addEventListener('change', () => autoSave());

  // Style change - save immediately
  elements.style.addEventListener('change', (e) => {
    updateStyleUI(e.target.value);
    if (elements.currentStyle) {
      elements.currentStyle.textContent = STYLE_NAMES[e.target.value] || e.target.value;
    }
    autoSave();
  });

  // Custom instructions - auto-save as user types
  elements.customInstructions.addEventListener('input', debouncedAutoSave);
  elements.customInstructions.addEventListener('change', () => autoSave());

  // Temperature slider - update label immediately, auto-save smoothly
  elements.temperature.addEventListener('input', (e) => {
    elements.temperatureValue.textContent = e.target.value;
    debouncedAutoSave();
  });
  elements.temperature.addEventListener('change', () => autoSave());

  // Max tokens - auto-save
  elements.maxTokens.addEventListener('change', () => autoSave());
  elements.maxTokens.addEventListener('input', debouncedAutoSave);

  // API Key - auto-save on blur/change
  elements.apiKey.addEventListener('change', () => autoSave());
  elements.apiKey.addEventListener('blur', () => autoSave());

  // Custom endpoint - auto-save
  elements.customEndpoint.addEventListener('change', () => autoSave());

  // UI Toggles - auto-save immediately
  elements.showOnHoverOnly.addEventListener('change', () => autoSave());
  elements.enableKeyboardShortcut.addEventListener('change', () => autoSave());
  elements.enableUndo.addEventListener('change', () => autoSave());

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
    autoSave();
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
      experientiallabs: 'https://experientiallabs.ai',
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
    updateStatus(e.target.checked ? 'Active — Ready to refine' : 'Disabled');

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

  // Quick Refine button
  elements.quickRefineBtn.addEventListener('click', handleQuickRefine);

  // Quick Copy button
  elements.quickCopyBtn.addEventListener('click', () => {
    const text = elements.quickRefineInput.value.trim();
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Failed to copy', 'error');
      });
    }
  });

  // Enable copy button when there's text
  elements.quickRefineInput.addEventListener('input', () => {
    elements.quickCopyBtn.disabled = !elements.quickRefineInput.value.trim();
  });

  // Import/Export
  if (elements.exportBtn) {
    elements.exportBtn.addEventListener('click', handleExport);
  }
  if (elements.importBtn) {
    elements.importBtn.addEventListener('click', () => {
      elements.importFile.click();
    });
  }
  if (elements.importFile) {
    elements.importFile.addEventListener('change', handleImport);
  }
}

/**
 * Handle Quick Refine
 */
async function handleQuickRefine() {
  const text = elements.quickRefineInput.value.trim();

  if (!text) {
    showToast('Please enter text to refine', 'warning');
    return;
  }

  elements.quickRefineBtn.disabled = true;
  elements.quickRefineBtn.classList.add('loading');
  updateStatus('Refining...');

  try {
    const settings = await getSettings();

    const response = await chrome.runtime.sendMessage({
      type: 'REFINE_TEXT',
      text: text,
      style: settings.style,
      customInstructions: settings.customInstructions
    });

    if (response.error) {
      throw new Error(response.error);
    }

    elements.quickRefineInput.value = response.refinedText;
    elements.quickCopyBtn.disabled = false;
    showToast('Text refined! Click Copy to use it.', 'success');
    updateStatus('Active — Ready to refine');

    // Increment refinement counter
    await incrementRefinementCount();
  } catch (error) {
    console.error('Quick refine error:', error);
    showToast(error.message || 'Failed to refine text', 'error');
    updateStatus('Error — check settings');
  } finally {
    elements.quickRefineBtn.disabled = false;
    elements.quickRefineBtn.classList.remove('loading');
  }
}

/**
 * Increment the total refinement count
 */
async function incrementRefinementCount() {
  const settings = await getSettings();
  const count = (settings.totalRefinements || 0) + 1;
  await saveSettings({ ...settings, totalRefinements: count });
  if (elements.totalRefinements) {
    elements.totalRefinements.textContent = count.toLocaleString();
  }
}

/**
 * Handle export settings
 */
async function handleExport() {
  try {
    const json = await exportSettings();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-text-refiner-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Settings exported!', 'success');
  } catch (error) {
    showToast('Failed to export settings', 'error');
  }
}

/**
 * Handle import settings
 */
async function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    await importSettings(text);
    const settings = await getSettings();
    populateForm(settings);
    updateStats(settings);
    showToast('Settings imported successfully!', 'success');
  } catch (error) {
    showToast('Failed to import settings: invalid file', 'error');
  }

  // Reset file input
  e.target.value = '';
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
    const provider = elements.provider.value;
    if (provider === 'custom' && !elements.customEndpoint.value.trim()) {
      showToast('Please enter a custom endpoint URL', 'error');
      return;
    }

    await autoSave(false);
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
      apiKey: currentSettings.apiKey,
      totalRefinements: currentSettings.totalRefinements || 0
    };

    await saveSettings(resetSettings);
    populateForm(resetSettings);
    updateStats(resetSettings);

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
  updateStatus('Testing API key...');

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
      updateStatus('API key invalid');
    } else {
      showToast('✅ API key is working!', 'success');
      updateStatus('Active — API verified');
    }
  } catch (error) {
    console.error('Test error:', error);
    showToast('Failed to test API key', 'error');
    updateStatus('API test failed');
  } finally {
    elements.testApiBtn.disabled = false;
    elements.testApiBtn.classList.remove('loading');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
