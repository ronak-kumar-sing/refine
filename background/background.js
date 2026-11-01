/**
 * AI Text Refiner - Background Service Worker
 * Handles API calls and message routing
 */

import { refineWithGemini, refineWithOpenAI, refineWithClaude, refineWithCustom, refineWithExperientialLabs } from '../utils/api-handlers.js';
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
    creative: 'Refine the text to be engaging and creative. Add flair while maintaining clarity.',
    academic: 'Refine the text to be scholarly and well-structured. Use academic vocabulary, proper citations style, and formal tone suitable for research or educational contexts.',
    persuasive: 'Refine the text to be compelling and persuasive. Use strong rhetorical techniques, clear arguments, and impactful language that motivates action.'
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
- Do not include any explanations, changes made, formatting notes, quotes, or meta-commentary
- Return ONLY the raw refined text, nothing else

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

    case 'experientiallabs':
      refinedText = await refineWithExperientialLabs(text, settings.apiKey, {
        model: settings.model || 'claude-opus-5.5',
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
        // Test Gemini API with automatic model fallback on high demand (503)
        const primaryTestModel = (!model || model === 'gemini-2.5-flash' || model.startsWith('gemini-2.'))
          ? 'gemini-3.8-flash'
          : model;
        const candidateModels = [
          primaryTestModel,
          primaryTestModel !== 'gemini-3.8-flash-lite' ? 'gemini-3.8-flash-lite' : 'gemini-3.8-flash',
          'gemini-3.8-pro'
        ];
        const uniqueTestModels = [...new Set(candidateModels)];

        let lastGeminiError = null;
        let successfulModel = null;

        for (const testModel of uniqueTestModels) {
          try {
            const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${apiKey}`, {
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

            if (geminiResponse.ok) {
              isValid = true;
              successfulModel = testModel;
              break;
            }

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

            // Hard auth errors (fail immediately)
            if (geminiResponse.status === 400 || geminiResponse.status === 401) {
              throw new Error('Invalid API key: ' + errorMsg);
            }
            if (geminiResponse.status === 403) {
              throw new Error('Permission denied: ' + errorMsg);
            }

            lastGeminiError = `API error (${geminiResponse.status}): ${errorMsg}`;

            // If 503 (high demand) or 429, wait briefly before testing fallback model
            if (geminiResponse.status === 503 || geminiResponse.status === 429) {
              await new Promise(r => setTimeout(r, 600));
            }
          } catch (err) {
            if (err.message.includes('Invalid API key') || err.message.includes('Permission denied')) {
              throw err;
            }
            lastGeminiError = err.message;
          }
        }

        if (!isValid) {
          // If all tested models returned 503, the API key is actually authenticated (valid)
          // but Google servers are temporarily at capacity
          if (lastGeminiError && (lastGeminiError.includes('503') || lastGeminiError.includes('high demand'))) {
            return {
              success: true,
              message: 'API key is valid! (Google servers are currently under high traffic — automatic fallback is active)'
            };
          }
          throw new Error(lastGeminiError || 'Unable to connect to Gemini API');
        }

        return {
          success: true,
          message: successfulModel && successfulModel !== primaryTestModel
            ? `API key is valid! (Auto-selected ${successfulModel} due to high traffic on ${primaryTestModel})`
            : 'API key is valid!'
        };

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

      case 'experientiallabs':
        // Test ExperientialLabs API
        const explabsResponse = await fetch('https://api.experientiallabs.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model || 'claude-opus-5.5',
            messages: [{ role: 'user', content: testText }]
          })
        });

        if (!explabsResponse.ok) {
          const errorText = await explabsResponse.text();
          let errorMsg = explabsResponse.statusText;
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

          if (explabsResponse.status === 401) throw new Error('Invalid ExperientialLabs API key');
          throw new Error(`API error (${explabsResponse.status}): ${errorMsg}`);
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
      .then(async (refinedText) => {
        sendResponse({ refinedText });
        // Increment refinement counter
        try {
          const settings = await getSettings();
          const count = (settings.totalRefinements || 0) + 1;
          await chrome.storage.sync.set({ totalRefinements: count });
        } catch (e) {
          console.log('Could not update refinement count:', e);
        }
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

  // Set up context menus for right-click refinement
  if (chrome.contextMenus) {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'refine-text-root',
        title: '✨ Refine text with AI',
        contexts: ['selection', 'editable']
      });

      chrome.contextMenus.create({
        id: 'refine-style-default',
        parentId: 'refine-text-root',
        title: '⚡ Quick Refine (Default Style)',
        contexts: ['selection', 'editable']
      });

      chrome.contextMenus.create({
        id: 'refine-style-professional',
        parentId: 'refine-text-root',
        title: '💼 Professional',
        contexts: ['selection', 'editable']
      });

      chrome.contextMenus.create({
        id: 'refine-style-casual',
        parentId: 'refine-text-root',
        title: '😊 Casual & Friendly',
        contexts: ['selection', 'editable']
      });

      chrome.contextMenus.create({
        id: 'refine-style-concise',
        parentId: 'refine-text-root',
        title: '✂️ Concise',
        contexts: ['selection', 'editable']
      });

      chrome.contextMenus.create({
        id: 'refine-style-academic',
        parentId: 'refine-text-root',
        title: '🎓 Academic',
        contexts: ['selection', 'editable']
      });

      chrome.contextMenus.create({
        id: 'refine-style-persuasive',
        parentId: 'refine-text-root',
        title: '🚀 Persuasive',
        contexts: ['selection', 'editable']
      });
    });
  }
});

/**
 * Handle context menu item clicks
 */
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  let styleOverride = null;
  if (info.menuItemId.startsWith('refine-style-') && info.menuItemId !== 'refine-style-default') {
    styleOverride = info.menuItemId.replace('refine-style-', '');
  }

  chrome.tabs.sendMessage(tab.id, {
    type: 'CONTEXT_MENU_REFINE',
    selectedText: info.selectionText || '',
    styleOverride: styleOverride
  }).catch(() => {
    console.log('Could not send context menu message to tab:', tab.id);
  });
});

/**
 * Handle extension icon click (open popup)
 */
chrome.action.onClicked.addListener((tab) => {
  // Popup will open automatically due to default_popup in manifest
});

// Log that the service worker is running
console.log('AI Text Refiner background service worker initialized');
