# ✨ AI Text Refiner - Complete Guide

A powerful Chrome extension that adds a magical sparkle icon to all text input fields, allowing you to refine your text instantly with AI-powered grammar, style, and clarity improvements.

![AI Text Refiner Banner](icons/icon128.png)

## 🌟 Features

- **🪄 One-Click Refinement**: Click the sparkle icon (✨) in any text field to instantly improve your writing.
- **⚡ Keyboard Shortcuts**: 
  - **Mac**: `Cmd + K` (Recommended) or `Cmd + Shift + R`
  - **Windows/Linux**: `Ctrl + K` (Recommended) or `Ctrl + Shift + R`
- **🎨 Multiple Refinement Styles**:
  - **Professional**: Formal, business-appropriate language.
  - **Casual**: Friendly, conversational tone.
  - **Concise**: Brief, to-the-point communication.
  - **Creative**: Engaging, expressive writing.
  - **Custom**: Define your own prompt (e.g., "Make it sound like a pirate").
- **🤖 Multi-LLM Support**:
  - **Google Gemini** (Default - Free tier available)
  - **OpenAI GPT** (GPT-4o, GPT-3.5)
  - **Anthropic Claude** (Claude 3.5 Sonnet)
  - **Custom Endpoints** (Local LLMs like Ollama)
- **✨ Visual Polish**:
  - **"Blur & Glow" Animations**: Smooth transitions when text is updated.
  - **Success Pulse**: Visual confirmation when refinement is complete.
  - **Loading States**: Integrated spinner inside the icon.
- **↩️ Undo Support**: Easily revert changes if you prefer the original text.
- **🛡️ Privacy First**: Your API keys are stored locally in Chrome. Text is sent *only* to your chosen AI provider.

---

## 📥 Installation

Since this is a developer-mode extension, follow these steps to install it:

1. **Download the Code**:
   - Clone this repository or download the source code folder.

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Toggle **Developer mode** (top right corner).
   - Click **Load unpacked** (top left).
   - Select the `chrome-text-refiner` folder.

3. **Pin the Extension**:
   - Click the puzzle piece icon in Chrome's toolbar.
   - Click the pin icon 📌 next to "AI Text Refiner" for easy access to settings.

---

## ⚙️ Configuration

Click the extension icon in your toolbar to open the settings panel.

### 1. API Setup (Required)
You need an API key from one of the providers. 

- **Google Gemini** (Recommended for free usage):
  1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
  2. Create a new API Key.
  3. Paste it into the extension settings and select "Google Gemini".

- **OpenAI / Anthropic**:
  - Get keys from [OpenAI Platform](https://platform.openai.com/api-keys) or [Anthropic Console](https://console.anthropic.com/).

### 2. Max Tokens (Important for Long Text)
If you plan to generating long content (like full emails or articles), increase the **Max Tokens** setting.
- **Default**: `2048`
- **Maximum**: `65536`
- *Tip: If text gets cut off, increase this value to 4096 or higher.*

### 3. Custom Instructions
Select "Custom" style to write your own prompt.
- Example: *"Translate to Spanish and make it formal"*
- Example: *"Fix grammar but keep my slang"*

---

## 🚀 Usage Guide

### Refining Text
1. Click into any text box (Gmail, Twitter, Slack, etc.).
2. Type your rough draft.
3. **Option A**: Click the ✨ sparkle icon that appears on the right.
4. **Option B**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows).
5. Watch the text blur and update magicallly!

### Undoing Changes
- If you don't like the result, a notification toast will appear at the bottom.
- Click **"Undo"** on the notification to revert to your original text.

### Visual Cues
- **Spinner**: AI is thinking.
- **Blur**: Text is being replaced.
- **Indigo Pulse**: Success! Text has been refined.
- **Red Toast**: Something went wrong (check the error message).

---

## 🔧 Troubleshooting

### "API Error: 400 Invalid Value"
- This usually means an issue with Safety Settings or Model compatibility.
- *Fix*: We have updated the extension to use modern Gemini safety categories (`HARM_CATEGORY_HARASSMENT`, etc.). ensuring you are on the latest version of the code.

### Text is Cut Off / Incomplete
- The AI hit the token limit.
- *Fix*: Open Settings -> Increase **Max Tokens** to `4096` or `8192`.

### Icon Not Appearing
- The extension works on standard input fields.
- *Fix*: Refresh the page. Some single-page apps (SPAs) need a refresh to detect new fields.
- *Check*: Ensure "Show on hover only" isn't enabled in settings if you want it always visible.

### Shortcuts Not Working
- *Fix*: Go to `chrome://extensions/shortcuts` and check if `Cmd+K` or `Ctrl+Shift+R` is assigned to AI Text Refiner.
- *Note*: Some websites capture these keys (e.g., Slack uses Cmd+K for channel switcher). In those cases, click the icon manually.

---

## 👨‍💻 Developer Guide

### File Structure
```
chrome-text-refiner/
├── manifest.json          # V3 Manifest config
├── popup/                 # Settings UI
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── content/               # Injected Script
│   ├── content.js         # Logic: Icon injection, Shortcuts, Animation
│   └── content.css        # Styles: Animations (Blur/Pulse), Tooltips
├── background/            # Background Worker
│   └── background.js      # API Calls, Environment Handling
└── utils/
    ├── api-handlers.js    # Specific logic for Gemini/OpenAI/Claude
    └── storage.js         # Chrome Sync Storage wrapper
```

### Key Components
- **`content.js`**: Uses a `MutationObserver` to watch for new text fields being added to the DOM dynamically.
- **`api-handlers.js`**: specialized handlers for each LLM provider to normalize their request/response formats.
- **`background.js`**: Handles the actual `fetch` calls to avoid CORS issues in the content script.

### Building
No build step required! Uses native ES Modules.

---

**Made with ✨ by AI Text Refiner**
