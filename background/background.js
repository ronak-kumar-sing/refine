/**
 * AI Text Refiner - Background Service Worker
 *
 * Owns all network calls to LLM providers (avoids CORS issues in content scripts),
 * applies rate limiting, and routes messages from the popup and content scripts.
 */

import { refineWithProvider, ProviderBusyError } from '../utils/api-handlers.js';
import { buildSystemPrompt } from '../utils/prompt.js';
import { getSettings } from '../utils/storage.js';

/* -------------------------------------------------------------------------- */
/* Rate limiting                                                              */
/* -------------------------------------------------------------------------- */

const RATE_LIMIT = { maxRequests: 10, windowMs: 60_000 };
let requestTimestamps = [];

function pruneRequests() {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter((time) => now - time < RATE_LIMIT.windowMs);
}

/** Records a request and returns true if it should be rejected. */
function consumeRateLimit() {
  pruneRequests();
  if (requestTimestamps.length >= RATE_LIMIT.maxRequests) {
    return true;
  }
  requestTimestamps.push(Date.now());
  return false;
}

function getCooldownSeconds() {
  pruneRequests();
  if (requestTimestamps.length === 0) return 0;
  const oldest = Math.min(...requestTimestamps);
  return Math.max(0, Math.ceil((oldest + RATE_LIMIT.windowMs - Date.now()) / 1000));
}

/* -------------------------------------------------------------------------- */
/* Handlers                                                                   */
/* -------------------------------------------------------------------------- */

async function handleRefineText({ text, style, customInstructions }) {
  if (consumeRateLimit()) {
    throw new Error(`Rate limit exceeded. Please wait ${getCooldownSeconds()} seconds.`);
  }

  const settings = await getSettings();
  const apiKey = settings.apiKeys?.[settings.provider] || settings.apiKey;

  // Local OpenAI-compatible servers (Ollama, LM Studio) usually need no key.
  if (!apiKey && settings.provider !== 'custom') {
    throw new Error('API key not configured. Open the extension settings to add one.');
  }

  const refinedText = await refineWithProvider(settings.provider, text, {
    apiKey,
    endpoint: settings.customEndpoint,
    model: settings.model,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    systemPrompt: buildSystemPrompt(style ?? settings.style, customInstructions ?? settings.customInstructions),
  });

  await incrementRefinementCount(settings);
  return refinedText;
}

async function incrementRefinementCount(settings) {
  try {
    await chrome.storage.sync.set({ totalRefinements: (settings.totalRefinements || 0) + 1 });
  } catch (error) {
    console.warn('[AI Text Refiner] Could not update refinement count:', error);
  }
}

/**
 * Validate credentials by running a tiny real refinement through the same code path.
 */
async function handleTestApiKey({ provider, apiKey, model, customEndpoint }) {
  try {
    await refineWithProvider(provider, 'Hello', {
      apiKey,
      endpoint: customEndpoint,
      model,
      temperature: 0,
      maxTokens: 16,
      systemPrompt: 'Reply with the word OK.',
    });
    return { success: true, message: 'API key is valid!' };
  } catch (error) {
    // An overloaded provider still authenticated the request, so the key is fine.
    if (error instanceof ProviderBusyError) {
      return { success: true, message: 'API key is valid! (The provider is currently under heavy load.)' };
    }
    throw error;
  }
}

/** Wrap an async handler so it replies via sendResponse and keeps the channel open. */
function respondAsync(promise, sendResponse, toResponse) {
  promise.then(
    (result) => sendResponse(toResponse(result)),
    (error) => {
      console.error('[AI Text Refiner]', error);
      sendResponse({ success: false, error: error.message });
    },
  );
  return true;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case 'REFINE_TEXT':
      return respondAsync(handleRefineText(message), sendResponse, (refinedText) => ({ refinedText }));

    case 'TEST_API_KEY':
      return respondAsync(handleTestApiKey(message), sendResponse, (result) => result);

    case 'GET_RATE_LIMIT_STATUS':
      pruneRequests();
      sendResponse({
        isLimited: requestTimestamps.length >= RATE_LIMIT.maxRequests,
        cooldown: getCooldownSeconds(),
        requestsRemaining: RATE_LIMIT.maxRequests - requestTimestamps.length,
      });
      return false;

    default:
      return false;
  }
});

/* -------------------------------------------------------------------------- */
/* Keyboard shortcut & context menu                                           */
/* -------------------------------------------------------------------------- */

function sendToTab(tabId, message) {
  chrome.tabs.sendMessage(tabId, message).catch(() => {
    // The content script is not available on this page (e.g. chrome:// URLs).
  });
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'refine-text') return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) sendToTab(tab.id, { type: 'REFINE_ACTIVE_FIELD' });
});

const CONTEXT_MENU_ITEMS = [
  { id: 'refine-style-default', title: '⚡ Quick Refine (Default Style)' },
  { id: 'refine-style-professional', title: '💼 Professional' },
  { id: 'refine-style-casual', title: '😊 Casual & Friendly' },
  { id: 'refine-style-concise', title: '✂️ Concise' },
  { id: 'refine-style-academic', title: '🎓 Academic' },
  { id: 'refine-style-persuasive', title: '🚀 Persuasive' },
];

chrome.runtime.onInstalled.addListener(() => {
  const contexts = ['selection', 'editable'];
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: 'refine-text-root', title: '✨ Refine text with AI', contexts });
    for (const item of CONTEXT_MENU_ITEMS) {
      chrome.contextMenus.create({ ...item, parentId: 'refine-text-root', contexts });
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return;
  const id = String(info.menuItemId);
  const styleOverride = id.startsWith('refine-style-') && id !== 'refine-style-default' ? id.slice(13) : null;
  sendToTab(tab.id, {
    type: 'CONTEXT_MENU_REFINE',
    selectedText: info.selectionText || '',
    styleOverride,
  });
});
