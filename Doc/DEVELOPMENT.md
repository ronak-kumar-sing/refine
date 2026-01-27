# Developer Guide - AI Text Refiner

## Project Overview

AI Text Refiner is a Chrome extension (Manifest V3) that injects a sparkle icon into text input fields, allowing users to refine their text using various AI/LLM providers.

## Architecture

### Core Components

```
┌─────────────────────────────────────────────────────┐
│           Chrome Extension (Manifest V3)            │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  │   POPUP      │  │   CONTENT    │  │ BACKGROUND   │
│  │  (Settings)  │  │  (Icons)     │  │  (API Calls) │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤
│  │ popup.html   │  │ content.js   │  │background.js │
│  │ popup.css    │  │ content.css  │  │api-handlers  │
│  │ popup.js     │  │              │  │ storage.js   │
│  └──────────────┘  └──────────────┘  └──────────────┘
│
│  Each component communicates via Chrome APIs
└─────────────────────────────────────────────────────┘
```

## File Structure

```
chrome-text-refiner/
├── manifest.json              # Extension manifest V3
├── popup/
│   ├── popup.html            # Settings UI
│   ├── popup.css             # Settings styles
│   └── popup.js              # Settings logic & event handlers
├── content/
│   ├── content.js            # Main content script
│   └── content.css           # Injected styles for icons
├── background/
│   └── background.js         # Service worker
├── utils/
│   ├── api-handlers.js       # LLM API implementations
│   ├── storage.js            # Storage utility functions
│   └── config.js             # Configuration constants (if needed)
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── create-icons.py       # Script to regenerate icons
├── README.md                 # User documentation
├── PRIVACY.md                # Privacy policy
├── CHANGELOG.md              # Version history
├── LICENSE                   # MIT License
└── .gitignore               # Git ignore rules
```

## Core Concepts

### 1. Message Passing

Components communicate via `chrome.runtime.sendMessage()` and `chrome.runtime.onMessage.addListener()`:

```javascript
// From content script to background
chrome.runtime.sendMessage({
  type: 'REFINE_TEXT',
  text: userText,
  style: selectedStyle,
  customInstructions: instructions
}, response => {
  if (response.error) {
    // Handle error
  } else {
    // Update field with refined text
  }
});

// Background listening
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REFINE_TEXT') {
    // Process and return refined text
    sendResponse({ refinedText: result });
  }
  return true; // For async responses
});
```

### 2. Storage

Settings are stored in `chrome.storage.sync` for cross-device sync:

```javascript
// Save settings
chrome.storage.sync.set({
  provider: 'gemini',
  apiKey: '...',
  temperature: 0.7
});

// Get settings
chrome.storage.sync.get(['provider', 'apiKey'], (result) => {
  console.log(result.provider);
});
```

### 3. Content Script Injection

The content script (`content/content.js`) runs in the context of web pages:

- Detects text input fields
- Creates and injects sparkle icons
- Handles user interactions
- Communicates with background script
- Uses `MutationObserver` for dynamic content

### 4. API Handlers

Different handlers for each LLM provider in `utils/api-handlers.js`:

```javascript
export async function refineWithGemini(text, apiKey, settings)
export async function refineWithOpenAI(text, apiKey, settings)
export async function refineWithClaude(text, apiKey, settings)
export async function refineWithCustom(text, endpoint, apiKey, settings)
```

## Development Workflow

### 1. Local Setup

```bash
# Clone the repository
git clone <repo>
cd chrome-text-refiner

# No build step needed - it's vanilla JavaScript with ES modules
```

### 2. Loading the Extension

1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode" (top-right)
3. Click "Load unpacked"
4. Select the `chrome-text-refiner` directory

### 3. Making Changes

- Edit files directly
- Use `Cmd+Shift+R` to reload the extension
- Refresh the webpage to see changes in content scripts
- Check the popup in the extension icon for settings changes

### 4. Debugging

#### Content Script Debugging
```javascript
// Right-click → Inspect on any webpage
// Go to Console tab to see content script logs
// Check the Elements tab to see injected .ai-refiner-icon elements
```

#### Background Script Debugging
1. Go to `chrome://extensions/`
2. Find AI Text Refiner
3. Click "Inspect views: service worker"
4. View console and network tabs

#### Popup Debugging
1. Right-click extension icon → "Inspect popup"
2. View console and elements

### 5. Testing

#### Test Scenarios

```javascript
// Test 1: Icon visibility on focus
// - Click input field
// - Verify icon appears

// Test 2: Icon hiding on blur
// - Click outside input
// - Verify icon disappears

// Test 3: Dynamic field detection
// - Add new input via dev tools
// - Verify icon appears on new field

// Test 4: API integration
// - Test with different providers
// - Test with different settings
// - Test error handling

// Test 5: Keyboard shortcut
// - Focus input field
// - Press Ctrl+Shift+R (Cmd+Shift+R on Mac)
// - Verify refinement triggered

// Test 6: Undo functionality
// - Refine text
// - Click "Undo" button
// - Verify original text restored
```

#### Test Websites

- Gmail (`gmail.com`)
- Twitter (`twitter.com`)
- LinkedIn (`linkedin.com`)
- Google Docs (`docs.google.com`)
- Slack (`slack.com`)
- Reddit (`reddit.com`)

## Code Standards

### JavaScript

- Use ES6+ features
- Use `const` and `let`, avoid `var`
- Use async/await over `.then()`
- Add JSDoc comments for functions
- No console.error without proper context

### CSS

- Use CSS variables for consistency
- Mobile-responsive design
- Support dark mode
- Include focus states for accessibility
- Use semantic class names

### Comments

```javascript
/**
 * Function description
 * @param {type} paramName - Description
 * @returns {type} Description
 */
function myFunction(paramName) {
  // Implementation with inline comments explaining why, not what
}
```

## Adding a New LLM Provider

1. **Add handler in `utils/api-handlers.js`**:

```javascript
export async function refineWithMyProvider(text, apiKey, settings) {
  // Implementation
  const { model, temperature, maxTokens, systemPrompt } = settings;
  // API call logic
  return refinedText;
}
```

2. **Update `background/background.js`**:

```javascript
case 'my-provider':
  refinedText = await refineWithMyProvider(...);
  break;
```

3. **Update `popup/popup.html`**:

```html
<option value="my-provider">My Provider</option>
```

4. **Update `popup/popup.js`**:

```javascript
const MODEL_OPTIONS = {
  'my-provider': [
    { value: 'model-1', label: 'Model 1' },
    // ...
  ]
};
```

5. **Add to manifest if needed**:

```json
"host_permissions": [
  "https://my-provider-api.com/*"
]
```

## Performance Optimization

### Current Optimizations

- **Debouncing**: Input detection debounced (100ms)
- **WeakMap**: Field references don't prevent garbage collection
- **WeakSet**: Processed fields don't prevent garbage collection
- **Event delegation**: Single listener pattern where possible
- **Lazy loading**: Settings loaded on demand

### Potential Improvements

```javascript
// Implement caching for repeated text refinement
const refinementCache = new Map();

// Batch multiple refinement requests
const refinementQueue = [];

// Implement request pooling for API calls
const apiConnectionPool = [];
```

## Security Best Practices

✅ **Currently Implemented**

- API keys in `chrome.storage.sync` (Chrome handles encryption)
- No sensitive data in `console.log()`
- Input validation before API calls
- HTTPS-only for all external calls
- No eval() or Function() constructors
- CSP-friendly code

⚠️ **Future Improvements**

- Rate limiting on client side (already added)
- Request signing for custom endpoints
- API key rotation support
- Audit logging of refinements

## Troubleshooting Common Issues

### Icon Not Appearing

```javascript
// Debug in content script console:
document.querySelectorAll('.ai-refiner-icon').length // Should > 0
document.querySelectorAll('input[type="text"]').length // Check for fields
```

### API Calls Failing

```javascript
// Check background worker:
chrome.runtime.sendMessage({ type: 'GET_RATE_LIMIT_STATUS' }, console.log);

// Check network tab for failed requests
// Verify API key in storage
```

### Settings Not Persisting

```javascript
// Check storage:
chrome.storage.sync.get(null, console.log);

// Verify storage quota:
chrome.storage.sync.getBytesInUse(null, (bytes) => {
  console.log(`Using ${bytes} of ${chrome.storage.sync.QUOTA_BYTES} bytes`);
});
```

## Building for Distribution

1. **Prepare for release**:
   - Update version in `manifest.json`
   - Update `CHANGELOG.md`
   - Test thoroughly

2. **Create package**:
   ```bash
   zip -r chrome-text-refiner.zip \
     -x "*.git*" \
     "*/node_modules/*" \
     -r chrome-text-refiner/
   ```

3. **Submit to Chrome Web Store**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Upload zip file
   - Fill in store listing
   - Submit for review

## Resources

- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

## Contributing

See [README.md](README.md) for contribution guidelines.

## License

MIT License - See [LICENSE](LICENSE) for details.
