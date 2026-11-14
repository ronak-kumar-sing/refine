<div align="center">

<img src="icons/icon128.png" alt="AI Text Refiner logo" width="96" height="96" />

# AI Text Refiner

**Polish any text field on the web with one click: grammar, tone, and clarity, powered by the LLM of your choice.**

[![CI](https://github.com/ronak-kumar-sing/refine/actions/workflows/ci.yml/badge.svg)](https://github.com/ronak-kumar-sing/refine/actions/workflows/ci.yml)
[![Manifest V3](https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## Overview

AI Text Refiner is a Chrome extension that adds a small ✨ button to text inputs, textareas, and rich-text editors on any website. Click it (or press a shortcut) and your draft is rewritten in the style you choose, in place, with a one-click undo.

You bring your own API key. Text goes straight from your browser to the provider you pick. There is no middleman server, no analytics, and no tracking.

## Features

| | |
| --- | --- |
| **Works everywhere** | Inputs, textareas, and `contenteditable` editors (Gmail, Slack, LinkedIn, X, Notion, …), including fields added dynamically. |
| **Four ways to refine** | ✨ inline button · <kbd>Ctrl/⌘</kbd> + <kbd>K</kbd> or <kbd>Ctrl/⌘</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> · right-click menu · *Quick Refine* box in the popup. |
| **Seven styles** | Professional, Casual, Concise, Creative, Academic, Persuasive, or your own custom instructions. |
| **Multiple providers** | Google Gemini, OpenAI, Anthropic Claude, ExperientialLabs, or any OpenAI-compatible endpoint (Ollama, LM Studio, vLLM). |
| **Resilient** | Automatic retry and model fallback when Gemini is overloaded, plus client-side rate limiting. |
| **Undo** | Revert to your original text from the toast that appears after each refinement. |
| **Portable settings** | Export/import preferences as JSON. API keys are never included in exports. |
| **Polished UI** | Dark mode, smooth blur-and-glow transitions, and respect for `prefers-reduced-motion`. |

## Installation

### From source (developer mode)

1. Download the [latest release](https://github.com/ronak-kumar-sing/refine/releases/latest) zip and extract it, **or** clone the repository:
   ```bash
   git clone https://github.com/ronak-kumar-sing/refine.git
   ```
2. Open `chrome://extensions` and enable **Developer mode** (top-right).
3. Click **Load unpacked** and select the extracted folder (the one containing `manifest.json`).
4. Pin **AI Text Refiner** from the puzzle-piece menu for quick access.

Works in current versions of Chrome and other Chromium-based browsers (Edge, Brave, Arc).

## Configuration

1. Click the extension icon to open settings.
2. Choose a **provider** and paste your **API key**. Use the **Get one here →** link to open the provider's key page.
3. Click **Test API Key** to verify it, then pick a **model** and **style**.

| Provider | Where to get a key | Notes |
| --- | --- | --- |
| Google Gemini *(default)* | [Google AI Studio](https://aistudio.google.com/app/apikey) | Generous free tier |
| OpenAI | [platform.openai.com](https://platform.openai.com/api-keys) | |
| Anthropic Claude | [console.anthropic.com](https://console.anthropic.com/) | |
| ExperientialLabs | [experientiallabs.ai](https://experientiallabs.ai) | OpenAI-compatible API |
| Custom | Your server | Any OpenAI-compatible `/v1/chat/completions` URL. A key is optional. |

See [docs/PROVIDERS.md](docs/PROVIDERS.md) for model details and troubleshooting.

**Tip:** If long text gets cut off, raise **Max Tokens** (default `2048`, max `65536`).

## Usage

1. Type a draft in any text field.
2. Refine it in any of these ways:
   - Click the ✨ icon on the right edge of the field
   - Press <kbd>⌘</kbd> + <kbd>K</kbd> (macOS) or <kbd>Ctrl</kbd> + <kbd>K</kbd> (Windows/Linux)
   - Right-click → **✨ Refine text with AI** and pick a style
   - Paste into **Quick Refine** in the popup
3. Don't like the result? Click **Undo** on the notification.

Some sites (e.g. Slack) reserve <kbd>⌘/Ctrl</kbd> + <kbd>K</kbd>. Use <kbd>⌘/Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> there, or rebind it at `chrome://extensions/shortcuts`.

## Privacy

- API keys live in `chrome.storage.sync` and are only sent to the provider you selected.
- Your text is sent only to that provider, over HTTPS, and only when you trigger a refinement.
- No analytics, telemetry, or third-party servers.

Full details: [PRIVACY.md](PRIVACY.md).

## Development

No build step: the extension runs directly from source. Node.js 20+ is only needed for linting, tests, and packaging.

```bash
npm install
npm run check     # lint + format check + manifest/secret validation + unit tests
npm run package   # builds dist/ai-text-refiner-v<version>.zip
```

```
├── manifest.json          Extension manifest (MV3)
├── background/            Service worker: provider calls, rate limiting, context menu, shortcuts
├── content/               Content script: icon injection, text replacement, undo
├── popup/                 Settings UI and Quick Refine
├── utils/
│   ├── api-handlers.js    One adapter per LLM provider
│   └── storage.js         Settings defaults, validation, import/export
├── icons/                 Extension icons
├── scripts/               Validation, packaging, and icon generation
├── test/                  Unit tests (node:test)
└── docs/                  Developer documentation
```

Read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for the architecture, message flow, and how to add a provider.

## Contributing

Contributions are welcome. Please read the [contributing guide](.github/CONTRIBUTING.md) and [code of conduct](.github/CODE_OF_CONDUCT.md) first. Report security issues privately as described in [SECURITY.md](.github/SECURITY.md).

## License

[MIT](LICENSE)
