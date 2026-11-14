# Contributing to AI Text Refiner

Thanks for taking the time to contribute! Bug reports, feature ideas, documentation fixes, and pull requests are all welcome.

By participating you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Reporting bugs and requesting features

- Search [existing issues](https://github.com/ronak-kumar-sing/refine/issues) first.
- Use the **Bug report** or **Feature request** template. For bugs, include your Chrome version, OS, extension version, provider/model, the site you were on, and any errors from the console (the page's DevTools, and the service worker's console via `chrome://extensions` → *Inspect views*).
- **Security issues:** do not open a public issue. Follow [SECURITY.md](SECURITY.md).

## Development setup

Requirements: Chrome (or another Chromium browser) and Node.js 20+.

```bash
git clone https://github.com/<your-username>/refine.git
cd refine
npm install
```

Load the extension from `chrome://extensions` → **Developer mode** → **Load unpacked** → select the repository root. After changing code, click the reload icon on the extension card and refresh the page you are testing.

See [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md) for the architecture and debugging tips.

## Making changes

1. Create a branch from `main`: `git switch -c fix/short-description`.
2. Keep changes focused; one logical change per pull request.
3. Run the full check before pushing:
   ```bash
   npm run check   # eslint, prettier, manifest + secret validation, unit tests
   ```
   `npm run lint:fix` and `npm run format` fix most issues automatically.
4. Add or update tests in `test/` when you change logic in `utils/`.
5. Test manually in the browser. At minimum:
   - the ✨ icon appears in an `<input>`, a `<textarea>`, and a `contenteditable` editor
   - refining via icon, keyboard shortcut, context menu, and Quick Refine
   - undo restores the original text
   - the provider you touched works with a real key
6. Update `README.md`, `docs/`, and the `[Unreleased]` section of `CHANGELOG.md` when behaviour changes.

### Code style

- Modern JavaScript (ES2023), ES modules everywhere except `content/content.js`, which runs as a classic content script.
- Formatting is enforced by Prettier (2 spaces, single quotes, 120 columns).
- Prefer small, documented functions; add JSDoc to exported functions.
- Never commit API keys, not even in tests or examples. `npm run validate` and CI scan for them.

### Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Mistral provider
fix(content): keep caret position after undo
docs: clarify custom endpoint setup
```

## Pull requests

- Fill in the PR template and link related issues (`Closes #123`).
- CI must pass.
- Include screenshots or a short recording for UI changes.
- A maintainer will review; please be patient and responsive to feedback.

## Releasing (maintainers)

1. Bump `version` in both `manifest.json` and `package.json`.
2. Move `[Unreleased]` entries in `CHANGELOG.md` under the new version.
3. Tag and push: `git tag v1.2.0 && git push origin v1.2.0`. The **Release** workflow attaches the packaged zip to a GitHub release.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](../LICENSE).
