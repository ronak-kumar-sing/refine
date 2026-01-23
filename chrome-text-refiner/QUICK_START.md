# Quick Start Guide

## 🚀 Installation (5 minutes)

### Step 1: Clone or Download
```bash
git clone https://github.com/yourusername/chrome-text-refiner.git
# or download the ZIP file
```

### Step 2: Load into Chrome
1. Open Chrome → Type `chrome://extensions/` in the address bar
2. Toggle **"Developer mode"** (top-right corner)
3. Click **"Load unpacked"**
4. Select the `chrome-text-refiner` folder
5. ✨ Done! The extension now appears in your toolbar

### Step 3: Get an API Key

**Option A: Google Gemini (Recommended - Free tier available)**
1. Visit https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the key

**Option B: OpenAI**
1. Visit https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key

**Option C: Anthropic Claude**
1. Visit https://console.anthropic.com/
2. Navigate to API Keys
3. Create and copy

### Step 4: Configure the Extension
1. Click the ✨ icon in your Chrome toolbar
2. Select your LLM provider
3. Paste your API key
4. Click **"Save Settings"**

## 📝 Using the Extension

### Basic Usage
1. Go to any website (Gmail, Twitter, Google Docs, etc.)
2. Click in a text field
3. Type something
4. Click the ✨ sparkle icon
5. Watch your text improve!

### Keyboard Shortcut
- **Windows/Linux**: `Ctrl + Shift + R`
- **macOS**: `Cmd + Shift + R`

Focus a text field and use the shortcut instead of clicking the icon.

### Choose Your Style
In the extension settings, pick how you want your text refined:
- **Professional**: For business emails and formal writing
- **Casual**: For friendly messages and chats
- **Concise**: For making text shorter and punchier
- **Creative**: For engaging and expressive writing
- **Custom**: Add your own instructions

## ⚙️ Settings Explained

| Setting | What It Does |
|---------|--------------|
| **Provider** | Choose which AI service to use |
| **API Key** | Your authentication key (stored securely) |
| **Model** | Which specific model version to use |
| **Temperature** | 0 = precise, 1 = creative (try 0.7) |
| **Max Tokens** | Maximum length of refined text |
| **Style** | How to refine your text |
| **Keyboard Shortcut** | Enable `Ctrl+Shift+R` / `Cmd+Shift+R` |
| **Undo** | Allow reverting to original text |

## 🆘 Troubleshooting

### Icon not appearing?
- **Refresh the page** after installing
- **Check the extension is enabled** at `chrome://extensions/`
- **Refresh** the page (F5) to reload content scripts

### "Invalid API Key" error?
- Verify the key is copied correctly (no extra spaces)
- Check you're using the right provider's API key
- Make sure the key has the correct permissions

### Extension not working?
1. Go to `chrome://extensions/`
2. Find "AI Text Refiner"
3. Toggle it **Off** then **On**
4. Refresh the website

### Need help?
Open an issue at: https://github.com/yourusername/chrome-text-refiner/issues

## 💡 Pro Tips

- **Test first**: Try the extension on a low-stakes email first
- **Undo available**: If you don't like the refinement, click "Undo"
- **Save settings**: Your settings sync across all your Chrome browsers
- **Copy refined text**: The refined text replaces your original (you can undo)
- **Keyboard shortcut**: Much faster than clicking the icon

## 🔒 Security

- Your text **never touches our servers**
- Your API key is **stored securely in Chrome** (encrypted)
- Text goes **directly to your chosen AI provider**
- We **don't collect or store anything**
- **100% open source** - verify our code yourself

## 📊 What Gets Sent Where?

```
You type in Gmail
    ↓
Your text goes to [Your AI Provider]
    ↓
Refined text comes back
    ↓
We put it back in Gmail
    
Done! 🎉
```

**Important**: Your API key is your personal authentication - keep it private!

## 🎯 Supported Websites

Works on virtually **any website** with text input fields:

✅ Email: Gmail, Outlook, etc.
✅ Social Media: Twitter, LinkedIn, Facebook, Reddit
✅ Documents: Google Docs, Notion, etc.
✅ Chat: Slack, Discord, Teams, Telegram Web
✅ Blogs: Medium, Dev.to, etc.
✅ Forms: Typeform, Surveys, Comments

## 📖 Next Steps

1. **Read the full [README.md](README.md)** for detailed features
2. **Check [DEVELOPMENT.md](DEVELOPMENT.md)** if you want to contribute
3. **Review [PRIVACY.md](PRIVACY.md)** to understand data handling
4. **Star the repo** ⭐ if you find it useful!

---

## Keyboard Reference

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+R` / `Cmd+Shift+R` | Refine focused text field |
| `Click ✨ icon` | Refine text (visible in field) |
| `Click "Undo"` | Revert to original text |

---

**Enjoy refining your text! ✨**

For questions: https://github.com/yourusername/chrome-text-refiner/issues
