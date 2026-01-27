# Support & FAQ

## 📞 Getting Help

### Quick Links
- **GitHub Issues**: [Report bugs](https://github.com/ronak-kumar-sing/refine/issues)
- **GitHub Discussions**: [Ask questions](https://github.com/ronak-kumar-sing/refine/discussions)
- **Documentation**: [Complete guides](Doc/)
- **Security Issues**: See [SECURITY.md](SECURITY.md)

## ❓ Frequently Asked Questions

### Installation & Setup

**Q: How do I install the extension?**
A: 
1. Clone or download this repository
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the refine folder

**Q: Do I need to pay for this?**
A: The extension is free! You need an API key from an AI provider (Gemini free tier works great).

**Q: Which browsers are supported?**
A: Currently Chrome and Chromium-based browsers (Edge, Brave, Opera, etc.).

### API & Configuration

**Q: What API should I use?**
A: We recommend Google Gemini's free tier for most users. It's reliable and generous with free credits.

**Q: How do I get a Gemini API key?**
A:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key
4. Paste it in the extension settings

**Q: Can I use multiple API providers?**
A: Yes! The extension supports Gemini, OpenAI, Claude, and custom endpoints.

**Q: Is it safe to paste my API key?**
A: Yes! Keys are stored locally in Chrome's encrypted storage and never leave your browser except for API calls.

**Q: What if I'm using a VPN or proxy?**
A: API calls should work normally. If not, check that your VPN/proxy doesn't block the AI provider's endpoints.

### Usage

**Q: The sparkle icon isn't showing up**
A:
- Make sure the extension is enabled in settings
- Refresh the webpage
- Check browser console for errors (F12 > Console)

**Q: Keyboard shortcuts aren't working**
A:
- Check they're enabled in settings
- Verify the shortcut isn't blocked by another app
- Try using the sparkle icon instead

**Q: I don't see any refinement styles**
A: Styles are in the popup menu. Click the extension icon and select a style from the dropdown.

**Q: Can I undo changes?**
A: Yes! After refinement, there's an undo button. Make sure "Enable Undo" is checked in settings.

### Troubleshooting

**Q: I'm getting an API error**
A:
1. Check your API key is correct
2. Verify your API account has credits/quota
3. Check your internet connection
4. Try a different API provider
5. Check API provider status page

**Q: Text isn't updating after clicking the icon**
A:
1. Check browser console for errors
2. Try clicking the icon again
3. Make sure the text field is supported
4. Try with a simple text field first

**Q: The extension is slow**
A:
- Check your internet connection
- Verify API provider isn't having issues
- Try with a shorter text snippet
- Check if your device resources are low

**Q: I see console errors**
A:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Copy the error message
5. [Report it as an issue](https://github.com/ronak-kumar-sing/refine/issues)

### Features & Customization

**Q: Can I create custom refinement styles?**
A: Yes! In settings, select "Custom" style and enter your own prompt.

**Q: Example prompts:**
- "Make it sound like a pirate"
- "Rewrite this as a limerick"
- "Make this more humorous"
- "Simplify this for a 5-year-old"

**Q: Can I adjust the refinement intensity?**
A: Yes! The "Temperature" setting controls creativity (0.1 = precise, 1.0 = creative).

**Q: Is there dark mode?**
A: Yes! Toggle it in settings under "UI Settings".

## 🐛 Common Issues & Solutions

### Issue: "Invalid API Key"
**Solution:**
- Verify the key is correct (copy-paste carefully)
- Check you're using the right key for the provider
- Ensure the key hasn't expired
- Regenerate the key if needed

### Issue: "Rate Limit Exceeded"
**Solution:**
- Wait a few minutes before trying again
- Upgrade your API tier
- Use a different provider
- Reduce refinement frequency

### Issue: "Network Error"
**Solution:**
- Check your internet connection
- Disable VPN/proxy temporarily
- Check if API provider is down
- Restart your browser

### Issue: "Text Field Not Working"
**Solution:**
- Some custom text editors might not work
- Try a standard HTML text field first
- Try right-clicking and using context menu
- Try keyboard shortcut (Cmd+K or Ctrl+K)

### Issue: "Extension Crashes"
**Solution:**
- Reload the extension (chrome://extensions/)
- Clear browser cache
- Disable and re-enable the extension
- Check for browser updates

## 📱 Platform-Specific Help

### Windows
- Keyboard shortcut: Ctrl + K or Ctrl + Shift + R
- Check Windows Defender isn't blocking network requests
- Use Chrome browser (not Edge edge cases)

### macOS
- Keyboard shortcut: Cmd + K or Cmd + Shift + R
- Check System Preferences > Security for app permissions
- Ensure Chrome has permission to access system features

### Linux
- Keyboard shortcut: Ctrl + K or Ctrl + Shift + R
- Check firewall isn't blocking API requests
- Works on most Chromium-based browsers

## 🔧 Advanced Configuration

### Custom Endpoints
For local LLMs like Ollama:
1. Start your local LLM server
2. In settings, select "Custom" provider
3. Enter your endpoint URL
4. Select appropriate model
5. Leave API key blank (if not required)

### Environment Setup
```bash
git clone https://github.com/ronak-kumar-sing/refine.git
cd refine
# Start development
# See Doc/DEVELOPMENT.md for details
```

## 📚 Documentation

- [Complete Development Guide](Doc/DEVELOPMENT.md)
- [API Key Management](Doc/API_KEY_MANAGEMENT.md)
- [Implementation Details](Doc/IMPLEMENTATION_COMPLETE.md)
- [Project Summary](Doc/PROJECT_SUMMARY.md)

## 🤝 Getting Involved

- **Found a bug?** [Open an issue](https://github.com/ronak-kumar-sing/refine/issues)
- **Want to help?** [See CONTRIBUTING.md](CONTRIBUTING.md)
- **Have feedback?** [Start a discussion](https://github.com/ronak-kumar-sing/refine/discussions)

## 🚀 Reporting Issues

When reporting an issue, please include:
- Extension version
- Chrome version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error messages

**[Report an Issue](https://github.com/ronak-kumar-sing/refine/issues/new)**

## 📝 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Still need help?** [Open a GitHub Discussion](https://github.com/ronak-kumar-sing/refine/discussions/new)
