import { afterEach, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

import { ProviderBusyError, refineWithProvider } from '../utils/api-handlers.js';

const jsonResponse = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const baseOptions = { apiKey: 'test-key', temperature: 0.5, maxTokens: 100, systemPrompt: 'Refine:' };

afterEach(() => mock.restoreAll());

describe('refineWithProvider', () => {
  it('rejects unknown providers', () => {
    assert.throws(() => refineWithProvider('nope', 'hi', baseOptions), /Unknown provider/);
  });

  it('calls OpenAI with a bearer token and returns trimmed text', async () => {
    const fetchMock = mock.method(globalThis, 'fetch', async () =>
      jsonResponse(200, { choices: [{ message: { content: '  Hello there.  ' } }] }),
    );

    const result = await refineWithProvider('openai', 'hello there', { ...baseOptions, model: 'gpt-4o' });

    assert.equal(result, 'Hello there.');
    const [url, init] = fetchMock.mock.calls[0].arguments;
    assert.equal(url, 'https://api.openai.com/v1/chat/completions');
    assert.equal(init.headers.Authorization, 'Bearer test-key');
    assert.equal(JSON.parse(init.body).model, 'gpt-4o');
  });

  it('sends the Gemini key in a header, never in the URL', async () => {
    const fetchMock = mock.method(globalThis, 'fetch', async () =>
      jsonResponse(200, { candidates: [{ content: { parts: [{ text: 'Done.' }] } }] }),
    );

    await refineWithProvider('gemini', 'done', { ...baseOptions, model: 'gemini-3.8-flash' });

    const [url, init] = fetchMock.mock.calls[0].arguments;
    assert.ok(!url.includes('test-key'));
    assert.equal(init.headers['x-goog-api-key'], 'test-key');
  });

  it('upgrades retired Gemini 2.x models', async () => {
    const fetchMock = mock.method(globalThis, 'fetch', async () =>
      jsonResponse(200, { candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    );

    await refineWithProvider('gemini', 'ok', { ...baseOptions, model: 'gemini-2.5-flash' });

    assert.match(fetchMock.mock.calls[0].arguments[0], /models\/gemini-3\.8-flash:/);
  });

  it('falls back to another Gemini model when the first is overloaded', async (t) => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    let calls = 0;
    const fetchMock = mock.method(globalThis, 'fetch', async () => {
      calls += 1;
      return calls <= 2
        ? jsonResponse(503, { error: { message: 'high demand' } })
        : jsonResponse(200, { candidates: [{ content: { parts: [{ text: 'fallback' }] } }] });
    });

    const pending = refineWithProvider('gemini', 'x', { ...baseOptions, model: 'gemini-3.8-flash' });
    // Let the first request fail, then skip the 1s retry delay
    await new Promise((resolve) => setImmediate(resolve));
    t.mock.timers.tick(1000);

    assert.equal(await pending, 'fallback');
    assert.match(fetchMock.mock.calls[2].arguments[0], /gemini-3\.8-flash-lite/);
  });

  it('maps 401 responses to an invalid-key error', async () => {
    mock.method(globalThis, 'fetch', async () => jsonResponse(401, { error: { message: 'bad key' } }));

    await assert.rejects(refineWithProvider('anthropic', 'x', baseOptions), /Invalid Anthropic API key.*bad key/);
  });

  it('marks 429 responses as ProviderBusyError', async () => {
    mock.method(globalThis, 'fetch', async () => jsonResponse(429, { error: { message: 'slow down' } }));

    await assert.rejects(refineWithProvider('openai', 'x', baseOptions), ProviderBusyError);
  });

  it('strips quotes the model wrapped around the answer', async () => {
    mock.method(globalThis, 'fetch', async () =>
      jsonResponse(200, { choices: [{ message: { content: '"Polished text."' } }] }),
    );

    assert.equal(await refineWithProvider('openai', 'polished text', baseOptions), 'Polished text.');
  });

  it('parses non-OpenAI response shapes from custom endpoints and omits empty auth', async () => {
    const fetchMock = mock.method(globalThis, 'fetch', async () => jsonResponse(200, { response: 'Local output' }));

    const result = await refineWithProvider('custom', 'x', {
      ...baseOptions,
      apiKey: '',
      endpoint: 'http://localhost:11434/v1/chat/completions',
    });

    assert.equal(result, 'Local output');
    assert.equal(fetchMock.mock.calls[0].arguments[1].headers.Authorization, undefined);
  });

  it('requires an endpoint for the custom provider', async () => {
    await assert.rejects(refineWithProvider('custom', 'x', baseOptions), /endpoint is not configured/);
  });
});
