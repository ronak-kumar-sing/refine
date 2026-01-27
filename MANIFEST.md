# Project Manifest

This document describes the complete structure and purpose of the AI Text Refiner project.

## 📁 Project Structure

```
refine/
├── .github/                          # GitHub configuration
│   ├── ISSUE_TEMPLATE/              # Issue templates
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── documentation.md
│   ├── workflows/                   # GitHub Actions
│   │   └── code-quality.yml
│   └── pull_request_template.md
│
├── Doc/                              # Documentation
│   ├── API_KEY_MANAGEMENT.md        # API setup guide
│   ├── DEVELOPMENT.md               # Development guide
│   ├── IMPLEMENTATION_COMPLETE.md   # Implementation details
│   └── PROJECT_SUMMARY.md           # Project overview
│
├── background/                       # Background service worker
│   └── background.js                # API requests, message handling
│
├── content/                          # Content scripts
│   ├── content.js                   # DOM manipulation, icon injection
│   └── content.css                  # Icon and animation styling
│
├── popup/                            # Extension settings UI
│   ├── popup.html                   # Settings interface
│   ├── popup.js                     # Settings management
│   └── popup.css                    # Settings styling
│
├── utils/                            # Shared utilities
│   ├── storage.js                   # Chrome storage management
│   └── api-handlers.js              # API request handling
│
├── icons/                            # Extension icons
│   ├── icon16.png                   # 16x16 icon
│   ├── icon48.png                   # 48x48 icon
│   ├── icon128.png                  # 128x128 icon
│   ├── icon16.svg                   # 16x16 SVG
│   ├── icon48.svg                   # 48x48 SVG
│   ├── icon128.svg                  # 128x128 SVG
│   ├── create-icons.html            # Icon creator tool
│   ├── create-icons.py              # Python icon generator
│   └── generate-icons.js            # JavaScript icon generator
│
├── main.js                           # Central entry point
├── manifest.json                     # Chrome extension config
│
├── README.md                         # Main documentation
├── CHANGELOG.md                      # Version history
├── LICENSE                           # MIT License
├── PRIVACY.md                        # Privacy policy
│
├── CONTRIBUTING.md                  # Contribution guidelines
├── CODE_OF_CONDUCT.md               # Community guidelines
├── SUPPORT.md                        # FAQ & support
├── SECURITY.md                       # Security policy
├── ROADMAP.md                        # Feature roadmap
├── CONTRIBUTORS.md                  # Contributors list
├── MANIFEST.md                       # This file
│
├── .gitignore                        # Git ignore rules
└── .git/                             # Git repository
```

## 📄 File Descriptions

### Core Extension Files

- **manifest.json**: Chrome extension configuration including:
  - Extension name, version, permissions
  - Content script and background service worker settings
  - Icon definitions
  - API permissions (Gemini, OpenAI, Anthropic)
  - Command definitions (keyboard shortcuts)

- **main.js**: Central entry point providing:
  - Extension configuration constants
  - Message type definitions
  - API provider constants
  - Refinement style constants
  - Documentation and architecture overview

### Background Service Worker

- **background/background.js**: Handles:
  - Incoming message routing
  - API requests to AI providers
  - Authentication and error handling
  - Response processing
  - Rate limiting (future)

### Content Script

- **content/content.js**: Injects into web pages and:
  - Detects all text input fields
  - Injects sparkle icon
  - Listens for icon clicks
  - Handles refinement requests
  - Shows animations and feedback

- **content/content.css**: Styles for:
  - Sparkle icon appearance
  - Blur & glow animation
  - Success pulse animation
  - Loading spinner
  - Responsive design

### Settings UI

- **popup/popup.html**: Settings interface including:
  - API provider selection
  - API key input
  - Model selection
  - Temperature/token settings
  - Refinement style selection
  - UI preferences (dark mode, shortcuts, etc.)

- **popup/popup.js**: Settings management:
  - Load/save settings from storage
  - Validate API keys
  - Test API connections
  - Update UI based on selected provider

- **popup/popup.css**: Settings styling for:
  - Clean, modern interface
  - Responsive design
  - Dark mode support

### Utilities

- **utils/storage.js**: Chrome storage wrapper:
  - Get/set extension settings
  - Default settings
  - Sync settings across tabs

- **utils/api-handlers.js**: API interaction:
  - Gemini API calls
  - OpenAI API calls
  - Claude API calls
  - Custom endpoint handling
  - Error handling and retries

### Documentation

- **README.md**: Main documentation with:
  - Feature overview
  - Installation instructions
  - Configuration guide
  - Usage examples

- **CONTRIBUTING.md**: Contribution guidelines:
  - Bug reporting
  - Feature requests
  - PR process
  - Testing requirements
  - Code style guidelines

- **CODE_OF_CONDUCT.md**: Community guidelines and enforcement

- **SUPPORT.md**: FAQ and troubleshooting:
  - Common questions
  - Known issues
  - Solutions

- **SECURITY.md**: Security policy:
  - Reporting vulnerabilities
  - Security features
  - Best practices

- **ROADMAP.md**: Future features and priorities

- **Doc/DEVELOPMENT.md**: Detailed development guide:
  - Setup instructions
  - Architecture details
  - API integration steps

- **Doc/API_KEY_MANAGEMENT.md**: API setup guide for all providers

- **Doc/IMPLEMENTATION_COMPLETE.md**: Implementation notes

## 🔄 Data Flow

```
User Web Page
    ↓
Content Script (content.js)
    ↓ (chrome.runtime.sendMessage)
    ↓
Background Worker (background.js)
    ↓ (API call)
    ↓
AI Provider API (Gemini/OpenAI/Claude/Custom)
    ↓ (API response)
    ↓
Background Worker (background.js)
    ↓ (chrome.runtime.sendMessage)
    ↓
Content Script (content.js)
    ↓ (Update DOM)
    ↓
Text Field Updated
```

## 🔐 Privacy & Security

- API keys stored in Chrome's encrypted local storage
- No telemetry or tracking
- No user data collection
- Text sent only to chosen AI provider
- All code is open source and auditable

## 🚀 Development Workflow

1. **Clone Repository**
   ```bash
   git clone https://github.com/ronak-kumar-sing/refine.git
   ```

2. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select the refine folder

3. **Make Changes**
   - Edit source files
   - Save changes
   - Reload extension in Chrome (click reload button)

4. **Test**
   - Open any webpage with text inputs
   - Click sparkle icon
   - Verify refinement works

5. **Commit & Push**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

## 📊 Project Statistics

- **Total Files**: 50+
- **Languages**: JavaScript, HTML, CSS, JSON, Python, Markdown
- **Lines of Code**: 2000+
- **API Providers Supported**: 4
- **Refinement Styles**: 5

## 🎯 Key Features

- ✨ One-click text refinement
- ⚡ Keyboard shortcuts (Cmd+K / Ctrl+K)
- 🎨 Multiple refinement styles
- 🤖 Multi-LLM support
- 🎬 Smooth animations
- ↩️ Undo support
- 🛡️ Privacy-first design

## 🔧 Technology Stack

- **Frontend**: JavaScript, HTML, CSS
- **Backend**: Chrome Service Worker
- **APIs**: Gemini, OpenAI, Anthropic
- **Storage**: Chrome Local Storage
- **Version Control**: Git & GitHub
- **CI/CD**: GitHub Actions

## 📈 Version History

- **1.0.0** (Jan 2026): Initial release
  - Multi-LLM support
  - All core features
  - Complete documentation

See [CHANGELOG.md](CHANGELOG.md) for details.

## 📝 License

MIT License - See [LICENSE](LICENSE)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📞 Support

See [SUPPORT.md](SUPPORT.md) for FAQ and help.

---

**Last Updated**: January 27, 2026
