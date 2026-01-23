# Privacy Policy for AI Text Refiner

**Last Updated: January 23, 2025**

## Overview

AI Text Refiner ("the Extension") is committed to protecting your privacy. This privacy policy explains how we handle information when you use our Chrome extension.

## Information Collection

### What We DON'T Collect

- ❌ We do not collect or store your text content
- ❌ We do not track your browsing history
- ❌ We do not collect personal identification information
- ❌ We do not use analytics or tracking cookies
- ❌ We do not share any data with third parties
- ❌ We do not have access to your API keys

### What We DO Use

- ✅ **Chrome Storage API**: Used solely to save your extension settings (provider choice, model selection, UI preferences) locally in your browser
- ✅ **Your API Key**: Stored locally in Chrome's secure sync storage and only used to authenticate requests to your chosen LLM provider

## Data Flow

When you use AI Text Refiner:

1. **Your text** is sent directly from your browser to your chosen LLM provider (Google, OpenAI, Anthropic, or your custom endpoint)
2. **The refined text** is returned directly to your browser
3. **No data** passes through our servers - there are no intermediary servers
4. **All communication** happens via HTTPS encrypted connections

## Third-Party Services

When you use this extension, your text is processed by your chosen LLM provider. Please review their privacy policies:

- **Google Gemini**: [Google AI Privacy](https://ai.google.dev/terms)
- **OpenAI**: [OpenAI Privacy Policy](https://openai.com/policies/privacy-policy)
- **Anthropic**: [Anthropic Privacy Policy](https://www.anthropic.com/privacy)

## API Key Security

- Your API keys are stored using Chrome's `chrome.storage.sync` API
- Keys are encrypted by Chrome and synced across your logged-in Chrome browsers
- Keys never leave your browser except when authenticating with your LLM provider
- We cannot access, view, or retrieve your API keys

## Permissions Explained

The extension requests the following permissions:

| Permission | Purpose |
|------------|---------|
| `activeTab` | To access and modify text in the current tab's input fields |
| `storage` | To save your settings and API keys securely |
| `scripting` | To inject the sparkle icon into web pages |
| Host permissions | To communicate with LLM provider APIs |

## Data Retention

- **Settings**: Stored in Chrome storage until you uninstall the extension or clear browser data
- **Undo History**: Stored temporarily in browser memory, cleared when the page is refreshed
- **Text Content**: Never stored; only transmitted to your LLM provider

## Your Rights

You have the right to:

- **Access**: View your stored settings in the extension popup
- **Modify**: Change your settings at any time
- **Delete**: Remove all stored data by uninstalling the extension
- **Export**: Your settings can be exported (API keys excluded for security)

## Children's Privacy

This extension is not intended for use by children under 13 years of age. We do not knowingly collect information from children.

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be noted with an updated "Last Updated" date. Continued use of the extension after changes constitutes acceptance of the new policy.

## Open Source

AI Text Refiner is open source. You can review our complete source code to verify our privacy practices:

- [GitHub Repository](https://github.com/yourusername/chrome-text-refiner)

## Contact

For privacy-related questions or concerns, please:

1. Open an issue on our [GitHub repository](https://github.com/yourusername/chrome-text-refiner/issues)
2. Email: privacy@example.com (replace with your contact)

## Summary

**Your privacy is simple with AI Text Refiner:**

1. Your text goes directly to your chosen AI provider
2. We never see, store, or process your text
3. Your API keys stay in your browser
4. No tracking, no analytics, no data collection

---

*This privacy policy was created to be transparent about our data practices. We believe in privacy by design.*
