# Getting Help

- **How do I…?** Start with the [README](../README.md) and [provider guide](../docs/PROVIDERS.md).
- **Found a bug?** Open a [bug report](https://github.com/ronak-kumar-sing/refine/issues/new?template=bug_report.md).
- **Have an idea?** Open a [feature request](https://github.com/ronak-kumar-sing/refine/issues/new?template=feature_request.md).
- **Security issue?** Report it privately as described in [SECURITY.md](SECURITY.md).

## Common problems

| Symptom | Fix |
| --- | --- |
| ✨ icon doesn't appear | Make sure the extension is enabled in the popup, then refresh the page. Icons don't appear on `chrome://` pages or the Chrome Web Store. |
| "API key not configured" | Open the popup, choose a provider, paste your key, and click **Test API Key**. |
| Invalid API key / 401 | Check that the key belongs to the selected provider and hasn't been revoked. |
| Gemini "high demand" / 503 | The extension already retries and falls back to other Gemini models. Wait a few seconds and try again. |
| "Rate limit exceeded" | The extension allows 10 refinements per minute; wait for the cooldown shown. |
| Output is cut off | Increase **Max Tokens** in settings. |
| Shortcut doesn't work | The site may reserve it. Use <kbd>Ctrl/⌘</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> or rebind it at `chrome://extensions/shortcuts`. |

When asking for help, include your Chrome version, OS, extension version, provider and model, and any console errors.
