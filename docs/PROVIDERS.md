# LLM Providers

AI Text Refiner does not ship with an API key. Choose a provider in the popup, paste your own key, and click **Test API Key**. The test sends a tiny real request through the same code path used for refinements, so a passing test means refinement will work.

Keys are stored per provider, so you can switch between providers without re-entering them.

## Google Gemini (default)

- **Get a key:** [Google AI Studio](https://aistudio.google.com/app/apikey). A free tier is available.
- **Models:** `gemini-3.8-flash` (balanced, default), `gemini-3.8-flash-lite` (fastest), `gemini-3.8-pro` (highest quality).
- **Resilience:** when a model returns `429`/`503` (overloaded), the extension retries once, then falls back to the other Gemini models before giving up. Saved settings that still point at retired `gemini-2.x` models are upgraded automatically.
- The key is sent in the `x-goog-api-key` header, never in the URL.

## OpenAI

- **Get a key:** [platform.openai.com/api-keys](https://platform.openai.com/api-keys). Requires billing to be set up.
- **Models:** `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`.

## Anthropic Claude

- **Get a key:** [console.anthropic.com](https://console.anthropic.com/).
- **Models:** `claude-3-5-sonnet-20241022`, `claude-3-haiku-20240307`.
- Requests are sent directly from the extension using the `anthropic-dangerous-direct-browser-access` header. This is appropriate here because the key belongs to you and stays in your browser.

## ExperientialLabs

- **Get a key:** [experientiallabs.ai](https://experientiallabs.ai).
- **Model:** `claude-opus-5.5` via an OpenAI-compatible API.

## Custom endpoint

Use any server that implements the OpenAI Chat Completions API (`POST …/v1/chat/completions`), for example:

| Server | Endpoint |
| --- | --- |
| Ollama | `http://localhost:11434/v1/chat/completions` |
| LM Studio | `http://localhost:1234/v1/chat/completions` |
| vLLM / LocalAI / OpenRouter | your server's `/v1/chat/completions` URL |

- The API key is **optional**. When you provide one, it is sent as `Authorization: Bearer <key>`.
- Besides the OpenAI format, the extension also understands responses shaped like `{ content: [{ text }] }`, `{ text }`, `{ response }`, `{ output }`, or `{ result }`.
- Chrome only allows requests to origins listed in `host_permissions`. To use a local or self-hosted endpoint, add its origin (for example `"http://localhost:11434/*"`) to `manifest.json` and reload the extension. Your server may also need to allow CORS from the extension origin.

## Troubleshooting

| Error | Meaning |
| --- | --- |
| `Invalid <provider> API key or insufficient permissions` | HTTP 401/403. Check that the key matches the selected provider and is active. |
| `<provider> is busy (HTTP 429/503)` | Rate-limited or overloaded by the provider. Wait and retry. |
| `Could not reach <provider>` | Network failure, wrong endpoint URL, or (for custom endpoints) a missing host permission. |
| `Rate limit exceeded. Please wait N seconds.` | The extension's own limit of 10 refinements per minute. |
| `The model returned an empty response.` | Often a too-low **Max Tokens** setting or content filtering by the provider. |
