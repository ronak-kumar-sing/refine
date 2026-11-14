# Security Policy

## Supported versions

Only the latest release receives security fixes.

| Version | Supported |
| ------- | --------- |
| 1.1.x   | ✅        |
| < 1.1   | ❌        |

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report privately through GitHub: go to the repository's **Security** tab → **Report a vulnerability** ([direct link](https://github.com/ronak-kumar-sing/refine/security/advisories/new)).

Please include:

- a description of the issue and its impact
- steps to reproduce or a proof of concept
- affected version(s)

You can expect an acknowledgement within a few days. Once a fix is released, you will be credited in the release notes unless you prefer otherwise.

## Security model

- **API keys** are stored with `chrome.storage.sync` (synced with your Chrome profile) and sent only to the provider you selected, over HTTPS. They are never sent to content scripts or web pages, never logged, and never included in settings exports.
- **Text** leaves the browser only when you trigger a refinement, and only to the selected provider.
- **Network access** is restricted by `host_permissions` to the supported provider APIs. All requests are made from the background service worker, never from the page.
- **No keys are bundled** with the extension. CI scans the repository for committed provider keys.

If you accidentally commit a key to a fork or branch, revoke it with the provider immediately. Removing it from the code does not remove it from git history.
