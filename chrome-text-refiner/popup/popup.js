/**
 * AI Text Refiner - Popup Script
 * Handles settings management and UI interactions
 */

import { getSettings, saveSettings, DEFAULT_SETTINGS } from '../utils/storage.js';

// Model options for each provider
const MODEL_OPTIONS = {
  gemini: [
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' }
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
  elements.apiKey.value = settings.apiKey || '';
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
        }).catch(() => {});
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
        }).catch(() => {});
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
 * Show toast notification
 */
function showToast(message, type = 'success') {
  const toast = elements.toast;
  toast.className = `toast ${type}`;
  toast.querySelector('.toast-message').textContent = message;
  
  // Show toast
  toast.classList.remove('hidden');
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Hide after delay
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
  }, 3000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
