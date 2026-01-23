# ✨ AI Text Refiner

A Chrome extension that adds a magical sparkle icon to all text input fields, allowing you to refine your text with AI-powered grammar, style, and clarity improvements.

![AI Text Refiner Banner](icons/icon128.png)

## Features

- 🪄 **One-Click Refinement**: Click the sparkle icon (✨) to instantly improve your text
- 🎨 **Multiple Refinement Styles**: Professional, Casual, Concise, Creative, or Custom
- 🤖 **Multi-LLM Support**: Works with Google Gemini, OpenAI GPT, Anthropic Claude, or custom endpoints
- ⌨️ **Keyboard Shortcut**: Use `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac) to refine text quickly
- ↩️ **Undo Support**: Easily revert to original text if needed
- 🌙 **Dark Mode**: Built-in dark mode support for the settings panel
- 🔒 **Secure**: API keys stored securely in Chrome's sync storage

## Installation

### From Source (Developer Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/yourusername/chrome-text-refiner.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** in the top right corner

4. Click **Load unpacked**

5. Select the `chrome-text-refiner` directory

6. The extension icon will appear in your Chrome toolbar

### Configuration

1. Click the extension icon (✨) in the Chrome toolbar
2. Select your preferred LLM provider (Gemini, OpenAI, Claude, or Custom)
3. Enter your API key
4. Choose your default refinement style
5. Click **Save Settings**

## Getting API Keys

### Google Gemini (Default)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key

### OpenAI GPT
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Copy the generated key

### Anthropic Claude
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Navigate to API Keys
3. Create and copy a new key

## Usage

### Basic Usage

1. Click on any text input field, textarea, or contenteditable element
2. Type your text
3. Click the ✨ sparkle icon that appears
4. Watch your text transform!

### Keyboard Shortcut

- **Windows/Linux**: `Ctrl + Shift + R`
- **macOS**: `Cmd + Shift + R`

Focus on a text field and use the shortcut to refine without clicking.

### Refinement Styles

| Style | Description |
|-------|-------------|
| **Professional** | Formal, business-appropriate language |
| **Casual** | Friendly, conversational tone |
| **Concise** | Brief, to-the-point communication |
| **Creative** | Engaging, expressive writing |
| **Custom** | Your own refinement instructions |

## Settings

### LLM Provider Settings
- **Provider**: Choose from Gemini, OpenAI, Claude, or Custom
- **API Key**: Your provider's API key (stored securely)
- **Model**: Select specific model version
- **Temperature**: Control creativity (0.0 = precise, 1.0 = creative)
- **Max Tokens**: Maximum response length

### UI Settings
- **Show on hover only**: Only display icon when hovering over fields
- **Enable keyboard shortcut**: Toggle Ctrl+Shift+R functionality
- **Enable undo**: Allow reverting to original text
- **Dark mode**: Dark theme for settings panel

## Supported Websites

AI Text Refiner works on virtually any website with text inputs, including:

- ✅ Gmail & Email clients
- ✅ Twitter/X, Facebook, LinkedIn
- ✅ Google Docs (text inputs)
- ✅ Slack, Discord, Teams
- ✅ Reddit, HackerNews
- ✅ WordPress, Medium
- ✅ Any website with text fields!

## Privacy & Security

- **Local Processing**: Your text is only sent to your chosen LLM provider
- **No Data Collection**: We don't collect, store, or track your text
- **Secure Storage**: API keys are stored using Chrome's secure sync storage
- **Open Source**: Full source code available for review

See our [Privacy Policy](PRIVACY.md) for more details.

## Troubleshooting

### Icon not appearing
- Refresh the page after installing the extension
- Check if the extension is enabled in `chrome://extensions/`
- Ensure the input field is not readonly or disabled

### API errors
- Verify your API key is correct
- Check if you have sufficient API credits
- Ensure the selected model is available for your API plan

### Text not updating
- Some websites use custom editors that may not be supported
- Try selecting the text manually and checking the refined output

## Development

### Project Structure

```
chrome-text-refiner/
├── manifest.json          # Extension manifest (V3)
├── popup/
│   ├── popup.html        # Settings UI
│   ├── popup.css         # Settings styles
│   └── popup.js          # Settings logic
├── content/
│   ├── content.js        # Icon injection & handling
│   └── content.css       # Injected styles
├── background/
│   └── background.js     # API calls & message routing
├── utils/
│   ├── api-handlers.js   # LLM API handlers
│   └── storage.js        # Chrome storage utilities
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md
└── PRIVACY.md
```

### Building

No build step required! The extension uses vanilla JavaScript with ES modules.

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Changelog

### v1.0.0 (2025-01-23)
- Initial release
- Multi-LLM support (Gemini, OpenAI, Claude, Custom)
- Multiple refinement styles
- Keyboard shortcut support
- Undo functionality
- Dark mode

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- 🐛 [Report a Bug](https://github.com/yourusername/chrome-text-refiner/issues)
- 💡 [Request a Feature](https://github.com/yourusername/chrome-text-refiner/issues)
- ⭐ Star this repo if you find it useful!

---

Made with ✨ by the AI Text Refiner Team
