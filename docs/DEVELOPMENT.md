# Developer Guide

This guide covers the architecture of AI Text Refiner, how its parts talk to each other, and how to extend it. For setup and contribution workflow, see [CONTRIBUTING.md](../.github/CONTRIBUTING.md).

## Architecture

The extension is a standard Manifest V3 extension with three runtime contexts:

```
┌──────────────────────┐   REFINE_TEXT    ┌───────────────────────────┐   HTTPS   ┌──────────────┐
│ Content script       │ ───────────────▶ │ Background service worker │ ────────▶ │ LLM provider │
│ content/content.js   │ ◀─────────────── │ background/background.js  │ ◀──────── │ (Gemini, …)  │
│ (every web page)     │   refinedText    │  + utils/api-handlers.js  │           └──────────────┘
└──────────────────────┘                  │  + utils/storage.js       │
          ▲                               └───────────────────────────┘
          │ SETTINGS_UPDATED                          ▲
          │                                           │ REFINE_TEXT / TEST_API_KEY
┌──────────────────────┐                              │
│ Popup                │ ─────────────────────────────┘
│ popup/popup.{html,js}│ ── chrome.storage.sync (settings, API keys)
└──────────────────────┘
```

| Context | Responsibility |
| --- | --- |
| **Content script** (`content/`) | Finds text fields, attaches the ✨ icon, handles keyboard shortcuts, replaces text with animation, offers undo. It runs as a classic script, not an ES module, and never sees API keys. |
| **Service worker** (`background/`) | The only place that talks to LLM providers. Builds the system prompt, applies rate limiting (10 requests/minute), increments the usage counter, owns the context menu and the `refine-text` command. |
| **Popup** (`popup/`) | Settings UI, Quick Refine, API key testing, import/export. Writes settings to storage, then pings tabs to reload. |
| **Shared utils** (`utils/`) | `api-handlers.js` contains one adapter per provider. `prompt.js` builds the editing prompt shared by every provider. `storage.js` holds defaults, validation, and import/export. |

## Message reference

| Type | From → To | Payload | Response |
| --- | --- | --- | --- |
| `REFINE_TEXT` | content/popup → background | `{ text, style?, customInstructions? }` | `{ refinedText }` or `{ error }` |
| `TEST_API_KEY` | popup → background | `{ provider, apiKey, model, customEndpoint? }` | `{ success, message }` or `{ success: false, error }` |
| `GET_RATE_LIMIT_STATUS` | any → background | none | `{ isLimited, cooldown, requestsRemaining }` |
| `SETTINGS_UPDATED` | popup → content | none (content re-reads storage) | none |
| `REFINE_ACTIVE_FIELD` | background → content | none (keyboard command) | none |
| `CONTEXT_MENU_REFINE` | background → content | `{ selectedText, styleOverride }` | none |

## Settings

Settings live in `chrome.storage.sync`. `DEFAULT_SETTINGS` in [`utils/storage.js`](../utils/storage.js) is the source of truth, and `validateSettings()` sanitises everything on save. API keys are stored per provider in `apiKeys`. `apiKey` mirrors the active provider's key for backwards compatibility.

## Adding a provider

1. Write an adapter in `utils/api-handlers.js` with the signature
   `(text, { apiKey, endpoint, model, temperature, maxTokens, systemPrompt }) => Promise<string>`.
   Use `postJson()` and `cleanOutput()` so error handling and output cleanup stay consistent. Throw `ProviderBusyError` for transient overload.
2. Register it in the `PROVIDERS` map.
3. Add the API origin to `host_permissions` in `manifest.json`.
4. Add the provider to `validProviders` in `utils/storage.js`, and to the `<select id="provider">`, `MODEL_OPTIONS`, `PROVIDER_NAMES`, and `API_KEY_URLS` in the popup.
5. Add unit tests in `test/api-handlers.test.mjs` and document it in [PROVIDERS.md](PROVIDERS.md).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run lint` / `lint:fix` | ESLint (flat config in `eslint.config.js`) |
| `npm run format` / `format:check` | Prettier |
| `npm run validate` | Manifest sanity checks, version consistency, secret scan |
| `npm test` | Unit tests with the built-in `node:test` runner (fetch is mocked) |
| `npm run check` | All of the above |
| `npm run package` | Zip only the runtime files into `dist/` |

Icons can be regenerated with the helpers in `scripts/icons/`.

## Debugging

- **Content script:** open DevTools on the page → *Console*. Choose the extension's context from the context dropdown.
- **Service worker:** `chrome://extensions` → AI Text Refiner → *Inspect views: service worker*. Network calls to providers show up here.
- **Popup:** right-click the extension icon → *Inspect popup*.
- **Storage:** in any extension console, run `chrome.storage.sync.get(null, console.log)`.

After editing code, click **reload** on the extension card. Content scripts only update after you also refresh the page.

## Website

The showcase site in `website/` is a separate React 19 + Vite + Tailwind CSS v4 app that uses Motion for animations. Content lives in `website/src/data/content.js`, and each page section is a component in `website/src/components/`.

```bash
npm --prefix website install
npm run site:dev     # http://localhost:4173
npm run site:build   # outputs website/dist
```

### Deploying on Vercel (recommended)

1. Go to [vercel.com/new](https://vercel.com/new), import `ronak-kumar-sing/refine`, and click **Deploy**. Leave **Root Directory** as the repository root.
2. That's it. [`vercel.json`](../vercel.json) tells Vercel to install and build `website/`, serve `website/dist`, add security headers (a strict CSP, `nosniff`, referrer and permissions policies), and cache hashed assets for a year.

After that, pushes to `main` deploy to production and pull requests get preview deployments. The `ignoreCommand` skips builds for commits that don't touch `website/` or `vercel.json`, so extension-only changes don't trigger a deployment.

### GitHub Pages (alternative)

`.github/workflows/pages.yml` can deploy the same build to GitHub Pages instead. It only runs when started manually: enable Pages under **Settings → Pages → Source: GitHub Actions**, then run **Deploy website** from the Actions tab.

## CI and releases

- `.github/workflows/ci.yml` runs `lint`, `format:check`, `validate`, `test`, `package`, and a website build on every push to `main` and on every pull request, and uploads the zip as an artifact.
- `.github/workflows/release.yml` runs on `v*` tags, checks that the tag matches `manifest.json`, and publishes a GitHub release with the zip attached.
