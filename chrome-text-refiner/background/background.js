/**
 * AI Text Refiner - Background Service Worker
 * Handles API calls and message routing
 */

import { refineWithGemini, refineWithOpenAI, refineWithClaude, refineWithCustom } from '../utils/api-handlers.js';
import { getSettings } from '../utils/storage.js';

// Rate limiting state
const rateLimiter = {
  requests: [],
  maxRequests: 10,
  windowMs: 60000 // 1 minute
};

/**
 * Check if request is rate limited
 */
function isRateLimited() {
  const now = Date.now();
  rateLimiter.requests = rateLimiter.requests.filter(time => now - time < rateLimiter.windowMs);
  
  if (rateLimiter.requests.length >= rateLimiter.maxRequests) {
    return true;
  }
  
  rateLimiter.requests.push(now);
  return false;
}

/**
 * Get remaining cooldown time
 */
function getCooldownTime() {
  if (rateLimiter.requests.length === 0) return 0;
  
  const oldestRequest = Math.min(...rateLimiter.requests);
  const cooldown = Math.ceil((oldestRequest + rateLimiter.windowMs - Date.now()) / 1000);
  return Math.max(0, cooldown);
}

/**
 * Build system prompt based on style
 */
function buildSystemPrompt(style, customInstructions) {
  const stylePrompts = {
    professional: 'Refine the text to be professional, clear, and polished. Use formal language appropriate for business communication.',
    casual: 'Refine the text to be friendly, conversational, and approachable. Keep it natural and warm.',
    concise: 'Refine the text to be brief and to the point. Remove unnecessary words while preserving meaning.',
    creative: 'Refine the text to be engaging and creative. Add flair while maintaining clarity.'
  };
  
  const styleInstruction = style === 'custom' && customInstructions 
    ? customInstructions 
    : stylePrompts[style] || stylePrompts.professional;
  
  return `You are a text refinement assistant. Your task is to improve the given text according to these guidelines:

Style: ${styleInstruction}

Rules:
- Fix all grammar and spelling errors
- Improve clarity and readability
- Maintain the original meaning and intent
- Keep the same general length unless conciseness is requested
- Do not add new information or change the core message
- Do not include any explanations or meta-commentary
- Return ONLY the refined text, nothing else

Refine the following text:`;
}

/**
 * Handle text refinement request
 */
async function handleRefineText(text, style, customInstructions) {
  // Check rate limiting
  if (isRateLimited()) {
    const cooldown = getCooldownTime();
    throw new Error(`Rate limit exceeded. Please wait ${cooldown} seconds.`);
  }
  
  // Get settings
  const settings = await getSettings();
  
  if (!settings.apiKey) {
    throw new Error('API key not configured. Please add your API key in the extension settings.');
  }
  
  const systemPrompt = buildSystemPrompt(style, customInstructions);
  
  // Route to appropriate API handler
  let refinedText;
  
  switch (settings.provider) {
    case 'gemini':
      refinedText = await refineWithGemini(text, settings.apiKey, {
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        systemPrompt
      });
      break;
      
    case 'openai':
      refinedText = await refineWithOpenAI(text, settings.apiKey, {
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        systemPrompt
      });
      break;
      
    case 'anthropic':
      refinedText = await refineWithClaude(text, settings.apiKey, {
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        systemPrompt
      });
      break;
      
    case 'custom':
      if (!settings.customEndpoint) {
        throw new Error('Custom API endpoint not configured.');
      }
      refinedText = await refineWithCustom(text, settings.customEndpoint, settings.apiKey, {
        model: settings.model,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        systemPrompt
      });
      break;
      
    default:
      throw new Error(`Unknown provider: ${settings.provider}`);
  }
  
  return refinedText;
}

/**
 * Listen for messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REFINE_TEXT') {
    handleRefineText(message.text, message.style, message.customInstructions)
      .then(refinedText => {
        sendResponse({ refinedText });
      })
      .catch(error => {
        console.error('Refinement error:', error);
        sendResponse({ error: error.message });
      });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
  
  if (message.type === 'SETTINGS_UPDATED') {
    // Settings updated, no action needed in background
    return false;
  }
  
  if (message.type === 'GET_RATE_LIMIT_STATUS') {
    sendResponse({
      isLimited: isRateLimited(),
      cooldown: getCooldownTime(),
      requestsRemaining: rateLimiter.maxRequests - rateLimiter.requests.length
    });
    return false;
  }
});

/**
 * Handle keyboard shortcut command
 */
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'refine-text') {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab) {
      // Send message to content script to refine the active field
      chrome.tabs.sendMessage(tab.id, { type: 'REFINE_ACTIVE_FIELD' }).catch(() => {
        // Tab might not have content script loaded
        console.log('Could not send message to tab:', tab.id);
      });
    }
  }
});

/**
 * Handle extension installation or update
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open options page on first install
    chrome.runtime.openOptionsPage?.() || chrome.tabs.create({ url: 'popup/popup.html' });
  }
  
  if (details.reason === 'update') {
    console.log('AI Text Refiner updated to version', chrome.runtime.getManifest().version);
  }
});

/**
 * Handle extension icon click (open popup)
 */
chrome.action.onClicked.addListener((tab) => {
  // Popup will open automatically due to default_popup in manifest
});

// Log that the service worker is running
console.log('AI Text Refiner background service worker initialized');
