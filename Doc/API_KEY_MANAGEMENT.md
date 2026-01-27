# API Key Management System

## Overview
The AI Text Refiner extension now includes a comprehensive API key management system that makes it easy for users to:
1. Get API keys from their provider
2. Test and validate their keys
3. Configure and save settings securely

## Features

### 1. Direct Provider Links
Each LLM provider has a direct link in the settings that opens the provider's API key management page:

- **Google Gemini**: Opens https://aistudio.google.com/app/apikey
- **OpenAI**: Opens https://platform.openai.com/api-keys
- **Anthropic Claude**: Opens https://console.anthropic.com/
- **Custom**: Shows alert (custom endpoints don't have a default link)

**How it works:**
- User sees "Need an API key?" link in the API help section
- Clicking the link opens a new tab to the provider's website
- User can create/copy their API key
- Return to extension and paste the key

### 2. Test API Button
A "Test API Key" button validates that the entered API key actually works with the provider.

**How it works:**
- User enters their API key
- User clicks "Test API Key" button
- Extension sends test request to background service worker
- Background worker makes minimal API call to verify the key
- User sees success/error notification

**Test logic for each provider:**
- **Gemini**: Makes a simple `generateContent` request
- **OpenAI**: Makes a minimal `chat/completions` request with max_tokens=10
- **Claude**: Makes a minimal `messages` request
- **Custom**: Attempts to reach the endpoint URL

### 3. User-Friendly Notifications
Toast notifications provide immediate feedback:
- ✅ Green success toast: "API key is working!"
- ❌ Red error toast: Shows specific error message
- ⚠️ Yellow warning toast: "Please enter an API key first"

## Implementation Details

### Files Modified

#### popup/popup.html
- Added API help section with "Need an API key?" link
- Added "Test API Key" button below API key input
- Organized controls in semantic sections

#### popup/popup.css
- `.hint-link`: Styled provider link (blue, underline on hover)
- `.api-help`: Styled help box with left border accent
- `.btn-small`: Smaller button variant for test button
- Dark mode support for all new elements

#### popup/popup.js
- `updateApiKeyLink(provider)`: Updates the link URL based on selected provider
- `handleTestApi()`: Sends test request and displays feedback
- Event listeners for link and button clicks
- Disabled state handling with loading indicator

#### background/background.js
- `handleTestApiKey(provider, apiKey, model)`: Makes minimal API call to test validity
- Handles 401/403 errors (invalid key)
- Handles other API errors gracefully
- Message handler for `TEST_API_KEY` message type
- Returns success/error response to popup

## Error Handling

### API Testing Errors
The system gracefully handles:
- **Invalid API Keys**: Returns "Invalid API key" error
- **Unauthorized Keys**: Returns "API key not authorized" error
- **Network Errors**: Returns error message with details
- **Empty Fields**: Shows warning to fill in API key first

### Provider-Specific Error Messages
- Gemini: "Invalid API key" or "API key not authorized for this resource"
- OpenAI: "Invalid API key" or "API key not authorized"
- Claude: "Invalid API key" or "API key not authorized"
- Custom: "Endpoint returned status: [code]"

## Security Considerations

1. **API Keys in Transit**: Encrypted by HTTPS in all API calls
2. **Storage**: Keys stored in `chrome.storage.sync` (Chrome's secure storage)
3. **No Logging**: API keys are never logged to console
4. **No Transmission to Third Parties**: Keys only sent to official provider endpoints
5. **Test Validation Only**: Test button makes read-only API calls (safe to test)

## User Flow

### Initial Setup
```
1. User opens extension settings
2. Sees "Need an API key?" link
3. Clicks link → New tab opens to provider's website
4. User creates/copies API key
5. Pastes key in "API Key" field
6. Clicks "Test API Key" button
7. Sees success notification
8. Clicks "Save Settings"
```

### Troubleshooting
If test fails:
```
1. User sees error message explaining what went wrong
2. Can click "Need an API key?" again to check key details
3. Can copy a new key and retry
4. Different error messages help identify the issue
```

## API Handler Integration

The background service worker includes test handlers for all providers:

### Gemini Test
- Sends request to: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- Includes safety settings (set to BLOCK_NONE for testing)
- Validates key validity through response status code

### OpenAI Test
- Sends request to: `https://api.openai.com/v1/chat/completions`
- Uses Bearer token authentication
- Minimal message to keep API usage low

### Claude Test
- Sends request to: `https://api.anthropic.com/v1/messages`
- Uses x-api-key header authentication
- Includes required Anthropic-version header

### Custom Endpoint Test
- Attempts HEAD request to endpoint URL
- 404 is acceptable (endpoint exists, just returns not found)
- Any other error indicates invalid endpoint

## Browser Extension Manifest

The feature is enabled in `manifest.json`:
- Required permissions: `storage`, `runtime`, `tabs`
- Content Security Policy allows API calls to provider endpoints
- Service worker handles all API validation

## Testing the System

### Manual Testing Steps
1. Open extension popup
2. Select a provider (e.g., "Google Gemini")
3. Verify "Need an API key?" link URL is correct
4. Try clicking the link (should open new tab)
5. Enter a test API key
6. Click "Test API Key"
7. Verify correct success/error message appears

### Test with Invalid Key
- Use a made-up key: `test-invalid-key-12345`
- Should show error: "API test failed: Invalid API key"

### Test with Valid Key
- Use a real API key from the provider
- Should show: "✅ API key is working!"

## Future Enhancements

Potential improvements:
1. Save multiple API keys (provider profiles)
2. Show API quota/usage information
3. Support for API key validation without test request
4. Backup/restore API keys
5. API key expiration warnings
6. Provider account information display

## Support Resources

Users can refer to:
- [Getting Started Guide](./GETTING_STARTED.md) - Setup instructions
- [API Configuration Guide](./API_CONFIGURATION.md) - Provider-specific details
- [Troubleshooting Guide](./TROUBLESHOOTING.md) - Common issues
