/**
 * AI Text Refiner - Main Entry Point
 * ====================================
 * 
 * This file serves as the central hub for the AI Text Refiner Chrome Extension.
 * It coordinates all components and provides utilities for the extension's functionality.
 * 
 * Extension Architecture:
 * ├── manifest.json          - Extension configuration
 * ├── background/            - Background service worker
 * │   └── background.js      - Handles API requests and cross-component communication
 * ├── content/               - Content script injected into web pages
 * │   ├── content.js         - Adds sparkle icon to text fields
 * │   └── content.css        - Styling for the sparkle icon and animations
 * ├── popup/                 - Extension settings UI
 * │   ├── popup.html         - Settings interface
 * │   ├── popup.js           - Settings management
 * │   └── popup.css          - Settings styling
 * ├── utils/                 - Shared utilities
 * │   ├── storage.js         - Chrome storage management
 * │   └── api-handlers.js    - API request handling
 * └── icons/                 - Extension icons
 *     ├── icon16.png         - 16x16 icon
 *     ├── icon48.png         - 48x48 icon
 *     └── icon128.png        - 128x128 icon
 * 
 * Data Flow:
 * ==========
 * 
 * 1. USER INTERACTION (Web Page)
 *    └─→ User clicks sparkle icon in text field
 *        └─→ Triggers content/content.js
 * 
 * 2. CONTENT SCRIPT (content/content.js)
 *    └─→ Sends message to background worker
 *        └─→ Includes selected text and refinement style
 * 
 * 3. BACKGROUND WORKER (background/background.js)
 *    └─→ Receives refinement request
 *        ├─→ Retrieves API key from storage
 *        ├─→ Calls appropriate AI API (Gemini, OpenAI, Claude, or Custom)
 *        └─→ Returns refined text to content script
 * 
 * 4. RESPONSE HANDLING (content/content.js)
 *    └─→ Updates text field with refined text
 *        └─→ Displays success animation
 *        └─→ Enables undo functionality
 * 
 * Settings Management:
 * ===================
 * All settings are stored in Chrome's local storage via utils/storage.js
 * 
 * Default Settings Structure:
 * {
 *   enabled: true,
 *   apiProvider: 'gemini',
 *   apiKey: '',
 *   model: 'gemini-3.8-flash',
 *   refinementStyle: 'professional',
 *   temperature: 0.7,
 *   maxTokens: 1000,
 *   customInstructions: '',
 *   showOnHoverOnly: false,
 *   enableKeyboardShortcut: true,
 *   enableUndo: true,
 *   darkMode: false,
 *   customEndpoint: ''
 * }
 * 
 * API Providers Supported:
 * =======================
 * 
 * 1. Google Gemini (Default)
 *    - Free tier available
 *    - Latest models: Gemini 3.8 Flash, Flash-Lite, Pro
 *    - Endpoint: https://generativelanguage.googleapis.com
 * 
 * 2. OpenAI GPT
 *    - GPT-4o, GPT-4o Mini, GPT-3.5 Turbo
 *    - Endpoint: https://api.openai.com
 * 
 * 3. Anthropic Claude
 *    - Claude 3.5 Sonnet, Claude 3 Haiku
 *    - Endpoint: https://api.anthropic.com
 * 
 * 4. Custom Endpoints
 *    - Local LLMs (Ollama, LM Studio, etc.)
 *    - User-defined endpoint URL
 * 
 * Refinement Styles:
 * ==================
 * 
 * - Professional: Formal, business-appropriate language
 * - Casual: Friendly, conversational tone
 * - Concise: Brief, to-the-point communication
 * - Creative: Engaging, expressive writing
 * - Custom: User-defined prompt
 * 
 * Keyboard Shortcuts:
 * ===================
 * 
 * - Mac: Cmd + K (or Cmd + Shift + R)
 * - Windows/Linux: Ctrl + K (or Ctrl + Shift + R)
 * 
 * Features:
 * =========
 * 
 * ✨ One-Click Refinement
 *    - Click sparkle icon to improve text instantly
 * 
 * ⚡ Keyboard Shortcuts
 *    - Quick access without mouse
 * 
 * 🎨 Multiple Refinement Styles
 *    - Professional, Casual, Concise, Creative, Custom
 * 
 * 🤖 Multi-LLM Support
 *    - Gemini, GPT, Claude, Custom endpoints
 * 
 * 🎬 Visual Animations
 *    - Blur & Glow animations on text update
 *    - Success pulse on completion
 *    - Loading spinner during processing
 * 
 * ↩️ Undo Support
 *    - Revert to original text anytime
 * 
 * 🛡️ Privacy First
 *    - API keys stored locally in Chrome
 *    - Text sent only to chosen AI provider
 * 
 * Development Guidelines:
 * ======================
 * 
 * 1. Storage Operations
 *    - Always use utils/storage.js for Chrome storage access
 *    - Never store sensitive data outside Chrome storage
 * 
 * 2. Message Passing
 *    - Use chrome.runtime.sendMessage for content ↔ background
 *    - Always include messageType in message object
 *    - Handle responses with proper error checking
 * 
 * 3. API Requests
 *    - Use utils/api-handlers.js for all API calls
 *    - Implement proper error handling and retries
 *    - Log API responses for debugging
 * 
 * 4. UI Updates
 *    - Always use utils/storage.js to persist changes
 *    - Update DOM reactively to storage changes
 *    - Test across different Chrome versions
 * 
 * 5. Testing
 *    - Test with all supported API providers
 *    - Test keyboard shortcuts on Mac and Windows
 *    - Test undo functionality
 *    - Test animations and visual feedback
 * 
 * Security Considerations:
 * ======================
 * 
 * - API keys are stored in Chrome's encrypted storage
 * - Never log API keys or sensitive data to console
 * - Validate all user inputs before sending to APIs
 * - Use HTTPS for all API requests
 * - Implement rate limiting in background worker
 * 
 * Troubleshooting:
 * ===============
 * 
 * Issue: Sparkle icon not appearing
 * Solution: Check if extension is enabled in popup settings
 * 
 * Issue: API errors when refining text
 * Solution: Verify API key is valid and has correct permissions
 * 
 * Issue: Keyboard shortcuts not working
 * Solution: Check if shortcut is enabled in settings and not blocked by other apps
 * 
 * Issue: Text not updating after refinement
 * Solution: Check browser console for errors, verify text field is supported
 * 
 * Performance Optimization:
 * ========================
 * 
 * - Content script uses event delegation to minimize DOM queries
 * - Background worker implements request caching
 * - Storage reads are batched where possible
 * - Message passing avoids unnecessary data transfers
 * 
 * Future Enhancements:
 * ===================
 * 
 * - Support for more AI providers (Cohere, HuggingFace, etc.)
 * - Batch text refinement
 * - Custom refinement presets
 * - Integration with popular platforms (Gmail, Google Docs, etc.)
 * - Language-specific refinement
 * - Tone analysis before refinement
 * 
 * License:
 * =======
 * See LICENSE file in root directory
 * 
 * Contact & Support:
 * ==================
 * For issues and feature requests, visit the GitHub repository
 */

// Main module exports for extension components
export const ExtensionConfig = {
  VERSION: chrome.runtime.getManifest().version,
  NAME: chrome.runtime.getManifest().name,
  
  // Message types for communication between components
  MessageTypes: {
    REFINE_TEXT: 'REFINE_TEXT',
    GET_SETTINGS: 'GET_SETTINGS',
    SAVE_SETTINGS: 'SAVE_SETTINGS',
    TEST_API: 'TEST_API',
    UNDO_TEXT: 'UNDO_TEXT'
  },
  
  // Supported API providers
  Providers: {
    GEMINI: 'gemini',
    OPENAI: 'openai',
    ANTHROPIC: 'anthropic',
    CUSTOM: 'custom'
  },
  
  // Refinement styles
  Styles: {
    PROFESSIONAL: 'professional',
    CASUAL: 'casual',
    CONCISE: 'concise',
    CREATIVE: 'creative',
    CUSTOM: 'custom'
  },
  
  // Keyboard shortcut commands
  Commands: {
    REFINE_TEXT: 'refine-text',
    REFINE_TEXT_ALT: 'refine-text-alt'
  }
};

export default ExtensionConfig;
