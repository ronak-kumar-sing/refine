# Changelog

All notable changes to AI Text Refiner will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

## [Unreleased]

### Planned Features
- Multiple refinement suggestions to choose from
- Side-by-side comparison view
- Tone detection
- Language translation option
- Text expansion/compression modes
- Context-aware refinement (email, tweet, etc.)
- Usage statistics dashboard
- Export/import settings
- Collaborative templates

---

## Version Naming Convention

- **MAJOR** version: Incompatible API changes or major feature overhauls
- **MINOR** version: New functionality in a backwards compatible manner
- **PATCH** version: Backwards compatible bug fixes

## Reporting Issues

Found a bug? Please report it at:
https://github.com/yourusername/chrome-text-refiner/issues
