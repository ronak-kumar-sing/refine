# Contributing to AI Text Refiner

Thank you for your interest in contributing to AI Text Refiner! We welcome contributions from everyone. This document provides guidelines and instructions for contributing.

## 🤝 Ways to Contribute

- **Report Bugs**: Found a bug? Open an issue with detailed information.
- **Suggest Features**: Have a great idea? Share it as a GitHub discussion or issue.
- **Submit Code**: Fix bugs or implement features with a pull request.
- **Improve Documentation**: Help us improve our docs and guides.
- **Add Translations**: Help make the extension available in more languages.

## 🐛 Reporting Bugs

Before creating a bug report, please check if the issue already exists. When creating a bug report, include:

- **Title**: Clear, descriptive title
- **Description**: What you expected vs. what happened
- **Reproduction Steps**: How to reproduce the issue
- **Environment**: Browser version, OS, extension version
- **Screenshots**: If applicable, add screenshots or screen recordings
- **Logs**: Check browser console for error messages

**Example Issue Template:**
```
## Bug: [Title]
### Description
What happened and what you expected.

### Steps to Reproduce
1. Go to...
2. Click...
3. See error...

### Environment
- OS: macOS/Windows/Linux
- Browser: Chrome Version X.X
- Extension Version: 1.0.0

### Error Log
```
Any console errors here
```
```

## ✨ Suggesting Features

We'd love to hear your ideas! When suggesting a feature:

- **Check Existing Issues**: Make sure it hasn't been suggested already
- **Clear Title**: Summarize the feature in a few words
- **Description**: Explain the feature and why it would be useful
- **Use Case**: Give real-world examples of how you'd use it
- **Related Features**: Link to any related suggestions or issues

**Example Feature Request:**
```
## Feature: [Title]
### Description
What would this feature do?

### Use Case
When would someone use this?

### Example
Show how it would work in practice
```

## 🚀 Submitting Pull Requests

### Before You Start
1. Fork the repository
2. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
3. Read the development guide in [Doc/DEVELOPMENT.md](Doc/DEVELOPMENT.md)

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/refine.git
cd refine

# Create a feature branch
git checkout -b feature/my-feature
```

### Code Style

- Follow the existing code style in the project
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and single-purpose

### Making Changes

1. Make your changes in your feature branch
2. Test thoroughly with different scenarios
3. Ensure no console errors occur
4. Test with all supported API providers if modifying API code

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All new features include appropriate comments
- [ ] Changes have been tested in Chrome
- [ ] No console errors or warnings
- [ ] Commit messages are clear and descriptive

### Submitting Your PR

1. Push your branch to your fork
2. Open a Pull Request on the main repository
3. Fill out the PR template completely:
   - Describe what changes you made
   - Explain why these changes are needed
   - Reference any related issues
   - Include screenshots if UI changes

**Example PR Description:**
```
## Description
Fixed the issue where text wasn't updating after refinement.

## Changes
- Updated event listener in content.js
- Added retry logic for failed API calls
- Improved error handling for network timeouts

## Testing
- Tested on macOS Chrome 120
- Verified with Gemini API
- Verified with OpenAI GPT-4o

## Screenshots
[If applicable]

## Closes
#123
```

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Test on Windows and macOS (at minimum)
- [ ] Test with all supported API providers
- [ ] Test keyboard shortcuts
- [ ] Test undo functionality
- [ ] Test with different text input types
- [ ] Verify no API key leaks in console
- [ ] Test extension enable/disable
- [ ] Test all refinement styles

### API Provider Testing
```javascript
// Test with each provider
- Google Gemini (free tier)
- OpenAI (if available)
- Anthropic Claude (if available)
- Custom endpoint (if applicable)
```

## 📝 Commit Message Guidelines

Use clear, descriptive commit messages:

```
# Good
git commit -m "Fix: Prevent text field update race condition"
git commit -m "Feature: Add support for custom refinement presets"
git commit -m "Docs: Update API setup instructions for Gemini"

# Avoid
git commit -m "Fix stuff"
git commit -m "WIP"
git commit -m "Update"
```

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `fix`: Bug fix
- `feature`: New feature
- `docs`: Documentation changes
- `style`: Code style changes (no logic changes)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests

## 🎯 Project Structure

```
refine/
├── background/          # Service worker for API requests
├── content/             # Content script injected into pages
├── popup/               # Extension settings UI
├── utils/               # Shared utilities
├── icons/               # Extension icons
├── Doc/                 # Documentation
├── main.js              # Main entry point
└── manifest.json        # Chrome extension config
```

## 📚 Additional Resources

- [Development Guide](Doc/DEVELOPMENT.md)
- [API Key Management](Doc/API_KEY_MANAGEMENT.md)
- [Implementation Notes](Doc/IMPLEMENTATION_COMPLETE.md)
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)

## 🎓 Learning Resources

- [Chrome Extension Manifest v3](https://developer.chrome.com/docs/extensions/mv3/)
- [Service Workers](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
- [Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

## 💬 Getting Help

- **Questions**: Open a GitHub Discussion
- **Issues**: Open a GitHub Issue
- **Email**: Contact the maintainers
- **Discord/Community**: Join our community (if available)

## 📋 Code Review Process

1. Maintainers will review your PR
2. Feedback will be provided on style, logic, and testing
3. Make requested changes
4. Request re-review when ready
5. Once approved, PR will be merged!

## 🏆 Recognition

Contributors will be recognized in:
- [Contributors list](CONTRIBUTORS.md)
- Release notes for significant contributions
- GitHub automatically credits contributors

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License as the project.

## ❓ Questions?

- Check existing issues and discussions
- Read the documentation
- Ask in a new GitHub Discussion
- Contact the maintainers

---

**Thank you for contributing to AI Text Refiner! 🚀**
