# Changelog

All notable changes to AI Text Refiner will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Vercel deployment for the website (`vercel.json`): zero-config import, security headers, long-term asset caching, and skipped builds for non-website commits.

### Changed
- The GitHub Pages workflow now runs only when started manually, as an alternative to Vercel.

### Fixed
- `npm test` failed in CI on Node 22, which treats `node --test test/` as a file path. It now uses a glob.
- Errors re-thrown in `catch` blocks keep the original error as `cause` (required by ESLint 10's `preserve-caught-error`).

## [1.1.0] - 2026-11-14

### Added
- **OpenRouter provider**: one key for Claude Opus 5.5 (default), Claude Sonnet/Haiku, GPT-5.6, Llama 4, DeepSeek, and more.
- **Showcase website** (`website/`, React + Vite + Tailwind + Motion) with an interactive demo, deployed to GitHub Pages.
- ESLint, Prettier, and EditorConfig setup.
- Unit tests for provider adapters (`npm test`).
- `npm run validate` checks manifest references, version consistency, and committed secrets.
- `npm run package` builds a Web Store–ready zip.
- GitHub Actions CI, tagged releases with the packaged zip attached, and Dependabot.

### Changed
- **New editing prompt** (`utils/prompt.js`) shared by every provider. It produces natural, human-sounding text in the style of Claude Opus, avoids stock AI phrasing, keeps the author's meaning and voice, and rewrites any instructions in the text instead of following them.
- Gemini now receives the prompt as a proper `systemInstruction`.
- Default provider is Google Gemini (`gemini-3.8-flash`) with `maxTokens` 2048, matching the documentation.
- Provider adapters share one request/error-handling path; "Test API Key" now runs a real request through the same code.
- Refinement uses the key saved for the active provider.
- Repository reorganised: community files moved to `.github/`, developer docs to `docs/`, and icon tooling to `scripts/icons/`.

### Fixed
- Quick Refine counted each refinement twice.
- "Test API Key" for custom endpoints treated the API key as the URL.
- Custom (local) endpoints no longer require an API key.
- Enabling the extension from the popup now takes effect without reloading the page.
- New text fields added in quick succession could be missed by the DOM observer.
- Resetting settings lost per-provider API keys.

### Security
- Removed an API key that was bundled in the default settings. Users now supply their own key.
- Settings broadcasts to tabs no longer include API keys; content scripts re-read only non-sensitive settings from storage.
- The Gemini API key is sent in the `x-goog-api-key` header instead of the URL query string.
- Settings export/import never includes or overwrites stored API keys.
- Dropped the unused `scripting` permission.

## [1.0.0] - 2025-01-23

### Added
- Initial release of AI Text Refiner
- Sparkle icon (✨) injection for all text input fields
  - `<input type="text">` support
  - `<textarea>` support
  - `contenteditable` elements support
- Multi-LLM provider support
  - Google Gemini (default)
  - OpenAI GPT
  - Anthropic Claude
  - Custom API endpoints
- Multiple refinement styles
  - Professional
  - Casual/Friendly
  - Concise
  - Creative
  - Custom (user-defined)
- Settings panel with full configuration options
  - API key management
  - Model selection per provider
  - Temperature control
  - Max tokens setting
- Keyboard shortcut support (Ctrl+Shift+R / Cmd+Shift+R)
- Undo functionality to revert to original text
- Toast notifications for success/error feedback
- Dark mode support for settings panel
- Dynamic DOM observation for dynamically added input fields
- Rate limiting protection (10 requests per minute)
- Smooth animations and hover effects
- Glassmorphism-style icon design
- Responsive popup design
- Accessibility features
  - ARIA labels
  - Focus indicators
  - Reduced motion support
  - High contrast mode support
- Secure API key storage using Chrome sync storage
- Comprehensive error handling
  - Network errors
  - API errors
  - Rate limit feedback
  - Invalid key detection

### Security
- All API calls use HTTPS
- API keys never exposed in console or page context
- Input validation and sanitization

[Unreleased]: https://github.com/ronak-kumar-sing/refine/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/ronak-kumar-sing/refine/releases/tag/v1.1.0
