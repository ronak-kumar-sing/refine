/**
 * AI Text Refiner - API Handlers
 * Handles API calls to different LLM providers
 */

/**
 * Refine text using Google Gemini API
 * @param {string} text - The text to refine
 * @param {string} apiKey - Gemini API key
 * @param {Object} settings - Model settings
 * @returns {Promise<string>} Refined text
 */
export async function refineWithGemini(text, apiKey, settings) {
  const { model = 'gemini-3.8-flash', temperature = 0.7, maxTokens = 1024, systemPrompt } = settings;

  // Auto-upgrade deprecated model requests to gemini-3.8-flash
  const primaryModel = (!model || model === 'gemini-2.5-flash' || model.startsWith('gemini-2.'))
    ? 'gemini-3.8-flash'
    : model;

  // Candidate models to try in sequence on high demand (503) or rate limit (429)
  const modelsToTry = [
    primaryModel,
    primaryModel !== 'gemini-3.8-flash-lite' ? 'gemini-3.8-flash-lite' : 'gemini-3.8-flash',
    'gemini-3.8-pro'
  ];
  const uniqueModels = [...new Set(modelsToTry)];

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${systemPrompt}\n\n${text}`
          }
        ]
      }
    ],
    generationConfig: {
      temperature: temperature,
      maxOutputTokens: maxTokens,
      topP: 0.95,
      topK: 40
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE"
      }
    ]
  };

  let lastError = null;

  for (let i = 0; i < uniqueModels.length; i++) {
    const currentModel = uniqueModels[i];
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

    // Try up to 2 attempts per model for transient spikes
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response generated from Gemini');
          }

          const refinedText = data.candidates[0].content?.parts?.[0]?.text;
          if (!refinedText) {
            throw new Error('Empty response from Gemini');
          }

          return refinedText.trim();
        }

        const error = await response.json().catch(() => ({}));
        const errorMessage = error.error?.message || `Gemini API error: ${response.status}`;

        if (errorMessage.includes('API_KEY_INVALID') || response.status === 400 || response.status === 401) {
          throw new Error('Invalid Gemini API key. Please check your settings.');
        }

        // If 503 (high demand) or 429 (rate limit), retry or switch model
        if (response.status === 503 || response.status === 429 || errorMessage.includes('high demand')) {
          lastError = new Error(errorMessage);
          if (attempt === 0) {
            // Wait 1 second before retrying the same model
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          // On second attempt failure, proceed to next model in cascade
          break;
        }

        throw new Error(errorMessage);
      } catch (err) {
        lastError = err;
        if (err.message.includes('Invalid Gemini API key') || err.message.includes('Permission denied')) {
          throw err;
        }
        // If not a high-demand/rate-limit error, don't cascade, throw immediately
        if (!err.message.includes('503') && !err.message.includes('high demand') && !err.message.includes('429')) {
          throw err;
        }
      }
    }
  }

  if (lastError && (lastError.message.includes('503') || lastError.message.includes('high demand'))) {
    throw new Error('Google Gemini is experiencing high server demand right now. We attempted automatic fallback, but servers are temporarily busy. Please wait a few seconds and try again.');
  }

  throw lastError || new Error('Failed to refine text with Gemini');
}

/**
 * Refine text using OpenAI API
 * @param {string} text - The text to refine
 * @param {string} apiKey - OpenAI API key
 * @param {Object} settings - Model settings
 * @returns {Promise<string>} Refined text
 */
export async function refineWithOpenAI(text, apiKey, settings) {
  const { model = 'gpt-4o-mini', temperature = 0.7, maxTokens = 1024, systemPrompt } = settings;

  const endpoint = 'https://api.openai.com/v1/chat/completions';

  const requestBody = {
    model: model,
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: temperature,
    max_tokens: maxTokens,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from OpenAI');
    }

    const refinedText = data.choices[0].message?.content;

    if (!refinedText) {
      throw new Error('Empty response from OpenAI');
    }

    return refinedText.trim();
  } catch (error) {
    if (error.message.includes('Incorrect API key')) {
      throw new Error('Invalid OpenAI API key. Please check your settings.');
    }
    if (error.message.includes('Rate limit')) {
      throw new Error('OpenAI rate limit reached. Please try again later.');
    }
    if (error.message.includes('insufficient_quota')) {
      throw new Error('OpenAI quota exceeded. Please check your billing.');
    }
    throw error;
  }
}

/**
 * Refine text using Anthropic Claude API
 * @param {string} text - The text to refine
 * @param {string} apiKey - Anthropic API key
 * @param {Object} settings - Model settings
 * @returns {Promise<string>} Refined text
 */
export async function refineWithClaude(text, apiKey, settings) {
  const { model = 'claude-3-5-sonnet-20241022', temperature = 0.7, maxTokens = 1024, systemPrompt } = settings;

  const endpoint = 'https://api.anthropic.com/v1/messages';

  const requestBody = {
    model: model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: text
      }
    ],
    temperature: temperature
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `Claude API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.content || data.content.length === 0) {
      throw new Error('No response generated from Claude');
    }

    const refinedText = data.content[0]?.text;

    if (!refinedText) {
      throw new Error('Empty response from Claude');
    }

    return refinedText.trim();
  } catch (error) {
    if (error.message.includes('invalid_api_key')) {
      throw new Error('Invalid Anthropic API key. Please check your settings.');
    }
    if (error.message.includes('rate_limit')) {
      throw new Error('Claude rate limit reached. Please try again later.');
    }
    throw error;
  }
}

/**
 * Refine text using a custom API endpoint
 * @param {string} text - The text to refine
 * @param {string} endpoint - Custom API endpoint URL
 * @param {string} apiKey - API key
 * @param {Object} settings - Model settings
 * @returns {Promise<string>} Refined text
 */
export async function refineWithCustom(text, endpoint, apiKey, settings) {
  const { temperature = 0.7, maxTokens = 1024, systemPrompt } = settings;

  // Use OpenAI-compatible format as it's the most common
  const requestBody = {
    model: settings.model || 'default',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: temperature,
    max_tokens: maxTokens
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error?.message || error.message || `API error: ${response.status}`;
      } catch {
        errorMessage = `API error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Try to extract text from various response formats
    let refinedText;

    // OpenAI format
    if (data.choices && data.choices[0]?.message?.content) {
      refinedText = data.choices[0].message.content;
    }
    // Anthropic format
    else if (data.content && data.content[0]?.text) {
      refinedText = data.content[0].text;
    }
    // Simple text response
    else if (typeof data.text === 'string') {
      refinedText = data.text;
    }
    // Response field
    else if (typeof data.response === 'string') {
      refinedText = data.response;
    }
    // Output field
    else if (typeof data.output === 'string') {
      refinedText = data.output;
    }
    // Result field
    else if (typeof data.result === 'string') {
      refinedText = data.result;
    }
    else {
      throw new Error('Unable to parse response from custom API. Check the endpoint format.');
    }

    return refinedText.trim();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Failed to connect to custom API. Check the endpoint URL and your network.');
    }
    throw error;
  }
}

/**
 * Refine text using ExperientialLabs API (Claude Opus 5.5)
 * @param {string} text - The text to refine
 * @param {string} apiKey - ExperientialLabs API key
 * @param {Object} settings - Model settings
 * @returns {Promise<string>} Refined text
 */
export async function refineWithExperientialLabs(text, apiKey, settings) {
  const { model = 'claude-opus-5.5', temperature = 0.7, systemPrompt } = settings;

  const endpoint = 'https://api.experientiallabs.ai/v1/chat/completions';

  const requestBody = {
    model: model || 'claude-opus-5.5',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: temperature
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error?.message || error.message || `API error: ${response.status}`;
      } catch {
        errorMessage = `API error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response generated from ExperientialLabs');
    }

    const refinedText = data.choices[0].message?.content;

    if (!refinedText) {
      throw new Error('Empty response from ExperientialLabs');
    }

    let cleanText = refinedText.trim();
    if (cleanText.startsWith('"') && cleanText.endsWith('"') && !text.trim().startsWith('"')) {
      cleanText = cleanText.slice(1, -1).trim();
    }
    return cleanText;
  } catch (error) {
    if (error.message.includes('Incorrect API key') || error.message.includes('Unauthorized') || error.message.includes('invalid_api_key')) {
      throw new Error('Invalid ExperientialLabs API key. Please check your settings.');
    }
    throw error;
  }
}

