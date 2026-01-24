# Quick Testing Guide - After Gemini API Fix

## Load the Extension

1. Open Chrome/Edge browser
2. Go to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `chrome-text-refiner` folder
6. Extension should load without errors ✅

## Test 1: API Key Setup & Validation

### Steps:
1. Click the extension icon in Chrome toolbar
2. Select "Google Gemini" as provider
3. Click "Need an API key?" link → Opens Google AI Studio
4. Copy your API key from https://aistudio.google.com/app/apikey
5. Paste API key in the extension
6. Click "Test API Key" button

### Expected Result:
- ✅ Success toast: "API key is working!"
- ❌ If error: Check that key is valid

## Test 2: Model Selection

### Steps:
1. In extension popup, check "Model" dropdown
2. Should see 4 Gemini models:
   - Gemini 1.5 Flash (Fast & Efficient)
   - Gemini 1.5 Flash-8B (Fastest)
   - Gemini 1.5 Pro (Best Quality)
   - Gemini 2.0 Flash (Experimental)

### Expected Result:
- ✅ All 4 models visible
- ✅ Default: Gemini 1.5 Flash

## Test 3: Text Refinement

### Steps:
1. Go to any website (e.g., gmail.com, twitter.com, reddit.com)
2. Find a text field or textarea
3. Type some rough text: "hey can u help me with this thing its kinda urgent"
4. Wait for sparkle ✨ icon to appear
5. Click the sparkle icon

### Expected Result:
- ✅ Text is refined professionally
- ✅ Example output: "Hello, could you help me with this matter? It's quite urgent."
- ✅ Toast notification shows "Text refined!"

## Test 4: Different Styles

### Steps:
1. Open extension popup
2. Change "Refinement Style" to each option:
   - Professional (formal)
   - Casual (friendly)
   - Concise (brief)
   - Creative (engaging)
3. Save settings
4. Test refinement with each style

### Expected Results:

**Original:** "yo this is cool stuff"

- **Professional:** "This is impressive work."
- **Casual:** "Hey, this is really cool stuff!"
- **Concise:** "This is excellent."
- **Creative:** "Wow, this is absolutely fantastic!"

## Test 5: Different Models

Test each Gemini model with the same text:

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| Gemini 1.5 Flash | ⚡⚡⚡ | ⭐⭐⭐ | Daily use |
| Gemini 1.5 Flash-8B | ⚡⚡⚡⚡ | ⭐⭐ | Quick tasks |
| Gemini 1.5 Pro | ⚡⚡ | ⭐⭐⭐⭐⭐ | Important text |
| Gemini 2.0 Flash | ⚡⚡⚡ | ⭐⭐⭐⭐ | Experimental |

## Test 6: Error Handling

### Test Invalid API Key:
1. Enter fake key: `test-invalid-key-12345`
2. Click "Test API Key"
3. Should see: ❌ "API Error: Invalid API key"

### Test Empty API Key:
1. Leave API key field empty
2. Try to save
3. Should see: ⚠️ "Please enter an API key"

## Test 7: Keyboard Shortcut

### Steps:
1. Go to any webpage with text field
2. Type some text
3. Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### Expected Result:
- ✅ Text is automatically refined
- ✅ Works without clicking icon

## Test 8: Undo Functionality

### Steps:
1. Type original text: "this is a test"
2. Click sparkle icon to refine
3. Text changes to: "This is a test."
4. Click undo icon that appears

### Expected Result:
- ✅ Text reverts to original: "this is a test"
- ✅ Undo icon disappears after use

## Test 9: Dark Mode

### Steps:
1. Open extension popup
2. Scroll down to "Dark Mode"
3. Toggle it ON
4. Popup should change to dark theme

### Expected Result:
- ✅ Background becomes dark
- ✅ Text becomes light
- ✅ Icons and buttons adapt

## Test 10: Multiple Providers

Test that other providers still work:

### OpenAI:
1. Select "OpenAI" provider
2. Enter OpenAI API key
3. Test refinement

### Claude:
1. Select "Anthropic Claude" provider
2. Enter Anthropic API key
3. Test refinement

### Custom:
1. Select "Custom API" provider
2. Enter endpoint URL
3. Test refinement

## Console Check

Open browser console (F12) and verify:

### Should See:
- ✅ "AI Text Refiner background service worker initialized"
- ✅ "Popup script initialized"
- ✅ "Content script loaded on: [url]"

### Should NOT See:
- ❌ "models/gemini-1.5-pro is not found for API version v1beta"
- ❌ "API error: " (blank error)
- ❌ Any red error messages

## Troubleshooting

### Issue: Extension won't load
**Solution:** Check manifest.json syntax, ensure all files exist

### Issue: API test fails
**Solution:** 
1. Verify API key at https://aistudio.google.com/app/apikey
2. Check internet connection
3. Try different model

### Issue: Sparkle icon doesn't appear
**Solution:**
1. Refresh the webpage
2. Check that extension is enabled
3. Verify content script loaded in console

### Issue: Text isn't refined
**Solution:**
1. Check API key is saved
2. Verify model is selected
3. Check rate limit (10 requests/minute)
4. Look for errors in console

## Performance Benchmarks

Test refinement speed with different models:

| Model | Text Length | Expected Time |
|-------|-------------|---------------|
| Flash-8B | 100 chars | ~1-2 seconds |
| Flash | 100 chars | ~2-3 seconds |
| Pro | 100 chars | ~3-5 seconds |
| 2.0 Flash | 100 chars | ~2-3 seconds |

## Success Checklist

- [ ] Extension loads without errors
- [ ] API key test succeeds
- [ ] All 4 Gemini models available
- [ ] Text refinement works
- [ ] Sparkle icon appears on text fields
- [ ] All refinement styles work
- [ ] Keyboard shortcut works
- [ ] Undo functionality works
- [ ] Dark mode works
- [ ] No console errors
- [ ] Settings persist after refresh

## Next Steps

Once all tests pass:

1. ✅ Extension is ready for use
2. ✅ Can publish to Chrome Web Store (optional)
3. ✅ Share with others
4. ✅ Customize settings to your preference

## Support

If any test fails:
1. Check [GEMINI_API_FIX.md](./GEMINI_API_FIX.md) for detailed fix info
2. Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
3. Check browser console for error details
4. Reload extension and try again
