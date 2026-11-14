/**
 * AI Text Refiner - API Handlers
 *
 * One adapter per LLM provider. Every adapter has the same signature:
 *
 *   (text, { apiKey, endpoint, model, temperature, maxTokens, systemPrompt }) => Promise<string>
 *
 * and resolves with the refined text or rejects with a user-readable Error.
 */

const GEMINI_DEFAULT_MODEL = 'gemini-3.8-flash';
const GEMINI_FALLBACK_MODELS = ['gemini-3.8-flash-lite', 'gemini-3.8-pro'];
const OPENROUTER_DEFAULT_MODEL = 'anthropic/claude-opus-5.5';
const RETRYABLE_STATUS = new Set([429, 503]);

/** Error type for transient provider overload, so callers can treat it differently. */
export class ProviderBusyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProviderBusyError';
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Extract the most useful error message from a failed response.
 * @param {Response} response
 * @returns {Promise<string>}
 */
async function readErrorMessage(response) {
  const body = await response.text().catch(() => '');
  try {
    const json = JSON.parse(body);
    const err = json.error ?? json;
    if (typeof err === 'string') return err;
    if (err?.message) return err.message;
    return JSON.stringify(err);
  } catch {
    return body || response.statusText || `HTTP ${response.status}`;
  }
}

/**
 * POST JSON and return the parsed response, converting HTTP failures to Errors.
 * @param {string} url
 * @param {Record<string, string>} headers
 * @param {object} body
 * @param {string} providerName - Used in error messages.
 */
async function postJson(url, headers, body, providerName) {
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(
      `Could not reach ${providerName}. Check your network connection or endpoint URL. (${error.message})`,
      { cause: error },
    );
  }

  if (response.ok) {
    return response.json();
  }

  const message = await readErrorMessage(response);
  if (response.status === 401 || response.status === 403) {
    throw new Error(`Invalid ${providerName} API key or insufficient permissions: ${message}`);
  }
  if (RETRYABLE_STATUS.has(response.status)) {
    throw new ProviderBusyError(`${providerName} is busy (HTTP ${response.status}): ${message}`);
  }
  throw new Error(`${providerName} API error (HTTP ${response.status}): ${message}`);
}

/**
 * Strip wrapping quotes some models add even when told not to.
 */
function cleanOutput(output, originalText) {
  let text = (output ?? '').trim();
  if (!text) {
    throw new Error('The model returned an empty response.');
  }
  if (text.length > 1 && text.startsWith('"') && text.endsWith('"') && !originalText.trim().startsWith('"')) {
    text = text.slice(1, -1).trim();
  }
  return text;
}

/**
 * Build an OpenAI-compatible chat completion request body.
 */
function chatCompletionBody(text, { model, temperature, maxTokens, systemPrompt }) {
  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
    temperature,
  };
  if (maxTokens) body.max_tokens = maxTokens;
  return body;
}

/* -------------------------------------------------------------------------- */
/* Provider adapters                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Google Gemini. Retries once on overload, then cascades through fallback models.
 */
export async function refineWithGemini(text, options) {
  const { apiKey, temperature = 0.7, maxTokens = 2048, systemPrompt } = options;

  // Gemini 2.x models are retired; transparently upgrade old saved settings.
  const requested = options.model && !options.model.startsWith('gemini-2.') ? options.model : GEMINI_DEFAULT_MODEL;
  const models = [...new Set([requested, ...GEMINI_FALLBACK_MODELS, GEMINI_DEFAULT_MODEL])];

  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text }] }],
    generationConfig: { temperature, maxOutputTokens: maxTokens, topP: 0.95, topK: 40 },
    safetySettings: [
      'HARM_CATEGORY_HARASSMENT',
      'HARM_CATEGORY_HATE_SPEECH',
      'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      'HARM_CATEGORY_DANGEROUS_CONTENT',
    ].map((category) => ({ category, threshold: 'BLOCK_NONE' })),
  };

  let lastError;
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const data = await postJson(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
          // Send the key as a header rather than a query parameter so it never appears in URLs or logs.
          { 'x-goog-api-key': apiKey },
          body,
          'Gemini',
        );
        return cleanOutput(data.candidates?.[0]?.content?.parts?.[0]?.text, text);
      } catch (error) {
        if (!(error instanceof ProviderBusyError)) throw error;
        lastError = error;
        if (attempt === 0) await sleep(1000);
      }
    }
  }

  throw new ProviderBusyError(
    'Google Gemini is under heavy load and every fallback model is busy. Please try again in a few seconds.' +
      (lastError ? ` (${lastError.message})` : ''),
  );
}

/** OpenAI Chat Completions. */
export async function refineWithOpenAI(text, options) {
  const data = await postJson(
    'https://api.openai.com/v1/chat/completions',
    { Authorization: `Bearer ${options.apiKey}` },
    chatCompletionBody(text, { ...options, model: options.model || 'gpt-4o-mini' }),
    'OpenAI',
  );
  return cleanOutput(data.choices?.[0]?.message?.content, text);
}

/** Anthropic Messages API. */
export async function refineWithClaude(text, options) {
  const { apiKey, model, temperature = 0.7, maxTokens = 2048, systemPrompt } = options;
  const data = await postJson(
    'https://api.anthropic.com/v1/messages',
    {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    {
      model: model || 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: text }],
      temperature,
    },
    'Anthropic',
  );
  return cleanOutput(data.content?.find((block) => block.type === 'text')?.text, text);
}

/** ExperientialLabs (OpenAI-compatible). */
export async function refineWithExperientialLabs(text, options) {
  const data = await postJson(
    'https://api.experientiallabs.ai/v1/chat/completions',
    { Authorization: `Bearer ${options.apiKey}` },
    // max_tokens is not sent to this endpoint (unchanged from earlier versions).
    chatCompletionBody(text, { ...options, model: options.model || 'claude-opus-5.5', maxTokens: undefined }),
    'ExperientialLabs',
  );
  return cleanOutput(data.choices?.[0]?.message?.content, text);
}

/**
 * OpenRouter: one key for hundreds of models (Claude, GPT, Gemini, Llama, ...).
 * The attribution headers are optional and let the app appear on openrouter.ai.
 */
export async function refineWithOpenRouter(text, options) {
  const data = await postJson(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      Authorization: `Bearer ${options.apiKey}`,
      'HTTP-Referer': 'https://github.com/ronak-kumar-sing/refine',
      'X-Title': 'AI Text Refiner',
    },
    chatCompletionBody(text, { ...options, model: options.model || OPENROUTER_DEFAULT_MODEL }),
    'OpenRouter',
  );
  return cleanOutput(data.choices?.[0]?.message?.content, text);
}

/**
 * Any OpenAI-compatible endpoint (Ollama, LM Studio, vLLM, ...).
 * Also understands a few common non-OpenAI response shapes.
 */
export async function refineWithCustom(text, options) {
  if (!options.endpoint) {
    throw new Error('Custom API endpoint is not configured.');
  }
  const headers = options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {};
  const data = await postJson(
    options.endpoint,
    headers,
    chatCompletionBody(text, { ...options, model: options.model || 'default' }),
    'Custom endpoint',
  );

  const output =
    data.choices?.[0]?.message?.content ??
    data.content?.[0]?.text ??
    [data.text, data.response, data.output, data.result].find((value) => typeof value === 'string');

  if (typeof output !== 'string') {
    throw new Error('Unable to parse the response from the custom endpoint. Is it OpenAI-compatible?');
  }
  return cleanOutput(output, text);
}

/** Provider id → adapter. */
export const PROVIDERS = {
  gemini: refineWithGemini,
  openai: refineWithOpenAI,
  anthropic: refineWithClaude,
  openrouter: refineWithOpenRouter,
  experientiallabs: refineWithExperientialLabs,
  custom: refineWithCustom,
};

/**
 * Dispatch a refinement request to the given provider.
 * @param {keyof PROVIDERS} provider
 * @param {string} text
 * @param {object} options - See module docs.
 */
export function refineWithProvider(provider, text, options) {
  const adapter = PROVIDERS[provider];
  if (!adapter) {
    throw new Error(`Unknown provider: ${provider}`);
  }
  return adapter(text, options);
}
