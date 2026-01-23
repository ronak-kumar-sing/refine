/**
 * AI Text Refiner - Content Script
 * Injects sparkle icons into text input fields and handles text refinement
 */

// Configuration
const ICON_SIZE = 24;
const ICON_PADDING = 5;
const DEBOUNCE_DELAY = 100;

// State management
let settings = null;
let activeField = null;
let originalTexts = new Map(); // Store original text for undo
let processedFields = new WeakSet();
let iconElements = new WeakMap();

/**
 * Initialize the content script
 */
async function init() {
  // Load settings
  settings = await loadSettings();
  
  if (!settings.enabled) {
    return;
  }
  
  // Process existing text fields
  processTextFields();
  
  // Set up mutation observer for dynamically added fields
  setupMutationObserver();
  
  // Listen for settings updates
  chrome.runtime.onMessage.addListener(handleMessage);
  
  // Set up keyboard shortcut
  if (settings.enableKeyboardShortcut) {
    document.addEventListener('keydown', handleKeyboardShortcut);
  }
}

/**
 * Load settings from storage
 */
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(null, (result) => {
      resolve({
        enabled: result.enabled ?? true,
        showOnHoverOnly: result.showOnHoverOnly ?? false,
        enableKeyboardShortcut: result.enableKeyboardShortcut ?? true,
        enableUndo: result.enableUndo ?? true,
        style: result.style ?? 'professional',
        customInstructions: result.customInstructions ?? ''
      });
    });
  });
}

/**
 * Handle messages from popup or background script
 */
function handleMessage(message, sender, sendResponse) {
  if (message.type === 'SETTINGS_UPDATED') {
    settings = message.settings;
    
    if (!settings.enabled) {
      removeAllIcons();
    } else {
      processTextFields();
    }
  } else if (message.type === 'REFINE_ACTIVE_FIELD') {
    if (activeField) {
      refineText(activeField);
    }
  }
  
  return true;
}

/**
 * Process all text input fields on the page
 */
function processTextFields() {
  // Find all text input elements
  const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="search"], input:not([type]), textarea');
  const contentEditables = document.querySelectorAll('[contenteditable="true"]');
  
  textInputs.forEach(field => attachIconToField(field));
  contentEditables.forEach(field => attachIconToField(field));
}

/**
 * Set up MutationObserver to detect dynamically added fields
 */
function setupMutationObserver() {
  const observer = new MutationObserver(debounce((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the added node is a text field
          if (isTextField(node)) {
            attachIconToField(node);
          }
          
          // Check for text fields within the added node
          const textFields = node.querySelectorAll?.('input[type="text"], input[type="email"], input[type="search"], input:not([type]), textarea, [contenteditable="true"]');
          textFields?.forEach(field => attachIconToField(field));
        }
      });
    });
  }, DEBOUNCE_DELAY));
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Check if an element is a text input field
 */
function isTextField(element) {
  if (!element.tagName) return false;
  
  const tagName = element.tagName.toLowerCase();
  
  if (tagName === 'textarea') return true;
  if (element.getAttribute('contenteditable') === 'true') return true;
  if (tagName === 'input') {
    const type = element.type?.toLowerCase() || 'text';
    return ['text', 'email', 'search', ''].includes(type);
  }
  
  return false;
}

/**
 * Attach sparkle icon to a text field
 */
function attachIconToField(field) {
  // Skip if already processed or not visible
  if (processedFields.has(field)) return;
  if (!isVisible(field)) return;
  if (field.readOnly || field.disabled) return;
  
  processedFields.add(field);
  
  // Create wrapper if needed for positioning
  const wrapper = createIconWrapper(field);
  const icon = createSparkleIcon(field);
  
  wrapper.appendChild(icon);
  iconElements.set(field, { wrapper, icon });
  
  // Set up event listeners
  setupFieldListeners(field, icon, wrapper);
  
  // Initial visibility check
  updateIconVisibility(field, icon);
}

/**
 * Create wrapper for the icon
 */
function createIconWrapper(field) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ai-refiner-wrapper';
  
  // Position the wrapper relative to the field
  const rect = field.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  
  wrapper.style.cssText = `
    position: absolute;
    top: ${rect.top + scrollTop}px;
    left: ${rect.left + scrollLeft}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    pointer-events: none;
    z-index: 2147483647;
  `;
  
  document.body.appendChild(wrapper);
  
  // Update position on scroll and resize
  const updatePosition = debounce(() => {
    if (!document.body.contains(field)) {
      wrapper.remove();
      return;
    }
    
    const newRect = field.getBoundingClientRect();
    const newScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const newScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    wrapper.style.top = `${newRect.top + newScrollTop}px`;
    wrapper.style.left = `${newRect.left + newScrollLeft}px`;
    wrapper.style.width = `${newRect.width}px`;
    wrapper.style.height = `${newRect.height}px`;
  }, 16);
  
  window.addEventListener('scroll', updatePosition, { passive: true });
  window.addEventListener('resize', updatePosition, { passive: true });
  
  return wrapper;
}

/**
 * Create the sparkle icon element
 */
function createSparkleIcon(field) {
  const icon = document.createElement('button');
  icon.className = 'ai-refiner-icon';
  icon.innerHTML = '✨';
  icon.type = 'button';
  icon.title = 'Refine text with AI';
  icon.setAttribute('aria-label', 'Refine text with AI');
  
  icon.style.cssText = `
    position: absolute;
    right: ${ICON_PADDING}px;
    top: 50%;
    transform: translateY(-50%);
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    pointer-events: auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 2147483647;
  `;
  
  return icon;
}

/**
 * Set up event listeners for a field
 */
function setupFieldListeners(field, icon, wrapper) {
  // Focus/blur events
  field.addEventListener('focus', () => {
    activeField = field;
    updateIconVisibility(field, icon);
  });
  
  field.addEventListener('blur', () => {
    setTimeout(() => {
      if (activeField === field) {
        activeField = null;
      }
      updateIconVisibility(field, icon);
    }, 200);
  });
  
  // Input event
  field.addEventListener('input', () => {
    updateIconVisibility(field, icon);
  });
  
  // Hover events (if showOnHoverOnly is enabled)
  if (settings.showOnHoverOnly) {
    field.addEventListener('mouseenter', () => {
      if (getFieldText(field).trim()) {
        showIcon(icon);
      }
    });
    
    field.addEventListener('mouseleave', () => {
      if (document.activeElement !== field) {
        hideIcon(icon);
      }
    });
  }
  
  // Icon click handler
  icon.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await refineText(field);
  });
  
  // Icon hover effects
  icon.addEventListener('mouseenter', () => {
    icon.style.transform = 'translateY(-50%) scale(1.1)';
    icon.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.4)';
  });
  
  icon.addEventListener('mouseleave', () => {
    icon.style.transform = 'translateY(-50%) scale(1)';
    icon.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
  });
}

/**
 * Update icon visibility based on field state
 */
function updateIconVisibility(field, icon) {
  if (!settings?.enabled) {
    hideIcon(icon);
    return;
  }
  
  const hasText = getFieldText(field).trim().length > 0;
  const isFocused = document.activeElement === field;
  
  if (settings.showOnHoverOnly) {
    // Only show on hover (handled by mouseenter/mouseleave)
    if (!isFocused && !hasText) {
      hideIcon(icon);
    }
  } else {
    // Show when focused or has text
    if (isFocused || hasText) {
      showIcon(icon);
    } else {
      hideIcon(icon);
    }
  }
}

/**
 * Show the icon with animation
 */
function showIcon(icon) {
  icon.style.opacity = '1';
  icon.style.visibility = 'visible';
}

/**
 * Hide the icon with animation
 */
function hideIcon(icon) {
  icon.style.opacity = '0';
  icon.style.visibility = 'hidden';
}

/**
 * Get text from a field (works for input, textarea, and contenteditable)
 */
function getFieldText(field) {
  if (field.tagName.toLowerCase() === 'input' || field.tagName.toLowerCase() === 'textarea') {
    return field.value;
  }
  return field.innerText || field.textContent || '';
}

/**
 * Set text in a field
 */
function setFieldText(field, text) {
  if (field.tagName.toLowerCase() === 'input' || field.tagName.toLowerCase() === 'textarea') {
    field.value = text;
    // Trigger input event for frameworks that listen to it
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    field.innerText = text;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

/**
 * Refine text using AI
 */
async function refineText(field) {
  const text = getFieldText(field).trim();
  
  if (!text) {
    showNotification('No text to refine', 'warning');
    return;
  }
  
  const iconData = iconElements.get(field);
  if (!iconData) return;
  
  const { icon } = iconData;
  
  // Store original text for undo
  if (settings.enableUndo) {
    originalTexts.set(field, text);
  }
  
  // Show loading state
  icon.innerHTML = '<span class="ai-refiner-spinner"></span>';
  icon.disabled = true;
  
  try {
    // Send message to background script for API call
    const response = await chrome.runtime.sendMessage({
      type: 'REFINE_TEXT',
      text: text,
      style: settings.style,
      customInstructions: settings.customInstructions
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Update field with refined text
    setFieldText(field, response.refinedText);
    
    // Show success notification
    showNotification('Text refined successfully!', 'success');
    
    // Add undo option if enabled
    if (settings.enableUndo) {
      showUndoNotification(field);
    }
  } catch (error) {
    console.error('Refinement error:', error);
    showNotification(error.message || 'Failed to refine text', 'error');
  } finally {
    // Restore icon
    icon.innerHTML = '✨';
    icon.disabled = false;
  }
}

/**
 * Handle keyboard shortcut
 */
function handleKeyboardShortcut(e) {
  // Ctrl+Shift+R or Cmd+Shift+R
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
    e.preventDefault();
    
    if (activeField) {
      refineText(activeField);
    }
  }
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existing = document.querySelector('.ai-refiner-notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `ai-refiner-notification ai-refiner-notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  requestAnimationFrame(() => {
    notification.classList.add('ai-refiner-notification-show');
  });
  
  // Remove after delay
  setTimeout(() => {
    notification.classList.remove('ai-refiner-notification-show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Show undo notification
 */
function showUndoNotification(field) {
  const existing = document.querySelector('.ai-refiner-undo');
  if (existing) {
    existing.remove();
  }
  
  const undo = document.createElement('div');
  undo.className = 'ai-refiner-undo';
  undo.innerHTML = `
    <span>Text refined</span>
    <button class="ai-refiner-undo-btn">Undo</button>
  `;
  
  document.body.appendChild(undo);
  
  // Add click handler for undo
  undo.querySelector('.ai-refiner-undo-btn').addEventListener('click', () => {
    const original = originalTexts.get(field);
    if (original) {
      setFieldText(field, original);
      originalTexts.delete(field);
      showNotification('Reverted to original text', 'info');
    }
    undo.remove();
  });
  
  // Show notification
  requestAnimationFrame(() => {
    undo.classList.add('ai-refiner-undo-show');
  });
  
  // Auto-hide after delay
  setTimeout(() => {
    undo.classList.remove('ai-refiner-undo-show');
    setTimeout(() => undo.remove(), 300);
  }, 5000);
}

/**
 * Remove all icons from the page
 */
function removeAllIcons() {
  document.querySelectorAll('.ai-refiner-wrapper').forEach(el => el.remove());
  document.querySelectorAll('.ai-refiner-notification').forEach(el => el.remove());
  document.querySelectorAll('.ai-refiner-undo').forEach(el => el.remove());
  processedFields = new WeakSet();
  iconElements = new WeakMap();
}

/**
 * Check if an element is visible
 */
function isVisible(element) {
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    rect.width > 0 &&
    rect.height > 0
  );
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
