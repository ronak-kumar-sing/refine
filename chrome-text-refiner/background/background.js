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
 * Test API key by making a minimal request
 */
async function handleTestApiKey(provider, apiKey, model) {
  try {
    const testText = "Test";
    let isValid = false;

    switch (provider) {
      case 'gemini':
        // Test Gemini API
        const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=' + apiKey, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: testText }] }],
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
            ]
          })
        });

        if (!geminiResponse.ok) {
          const errorText = await geminiResponse.text();
          let errorMsg = geminiResponse.statusText;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMsg = errorJson.error.message;
            } else if (errorJson.error) {
              errorMsg = JSON.stringify(errorJson.error);
            }
          } catch (e) {
            if (errorText) errorMsg = errorText;
          }

          if (geminiResponse.status === 401) throw new Error('Invalid API key: ' + errorMsg);
          if (geminiResponse.status === 403) throw new Error('Permission denied: ' + errorMsg);
          throw new Error(`API error (${geminiResponse.status}): ${errorMsg}`);
        }

        isValid = true;
        break;

      case 'openai':
        // Test OpenAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model || 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: testText }],
            max_tokens: 10
          })
        });

        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          let errorMsg = openaiResponse.statusText;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMsg = errorJson.error.message;
            }
          } catch (e) {
            if (errorText) errorMsg = errorText;
          }

          if (openaiResponse.status === 401) throw new Error('Invalid API key');
          throw new Error(`API error (${openaiResponse.status}): ${errorMsg}`);
        }

        isValid = true;
        break;

      case 'anthropic':
        // Test Claude API
        const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model || 'claude-3-opus-20240229',
            max_tokens: 10,
            messages: [{ role: 'user', content: testText }]
          })
        });

        if (!claudeResponse.ok) {
          const errorText = await claudeResponse.text();
          let errorMsg = claudeResponse.statusText;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && errorJson.error.message) {
              errorMsg = errorJson.error.message;
            }
          } catch (e) {
            if (errorText) errorMsg = errorText;
          }

          if (claudeResponse.status === 401) throw new Error('Invalid API key');
          throw new Error(`API error (${claudeResponse.status}): ${errorMsg}`);
        }

        isValid = true;
        break;

      case 'custom':
        // For custom endpoints, just verify it's a valid URL and accessible
        if (!apiKey || typeof apiKey !== 'string') throw new Error('Invalid endpoint URL');
        try {
          const customResponse = await fetch(apiKey.replace(/\/$/, ''), { method: 'HEAD' });
          if (customResponse.status === 404) isValid = true; // 404 is acceptable for custom endpoints (path might be wrong but server exists)
          else if (customResponse.ok) isValid = true;
          else throw new Error(`Endpoint returned status: ${customResponse.status}`);
        } catch (e) {
          throw new Error(`Connection failed: ${e.message}`);
        }
        break;

      default:
        throw new Error('Unknown provider');
    }

    return { success: isValid, message: 'API key is valid!' };
  } catch (error) {
    console.error('API Test Error Details:', error);
    throw new Error(`${error.message}`);
  }
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

  if (message.type === 'TEST_API_KEY') {
    handleTestApiKey(message.provider, message.apiKey, message.model)
      .then(result => {
        sendResponse({ success: result.success, message: result.message });
      })
      .catch(error => {
        console.error('API test error:', error);
        sendResponse({ success: false, error: error.message });
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
    // Extension installed - no need to open options page
    console.log('AI Text Refiner installed. Click the extension icon to configure.');
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
