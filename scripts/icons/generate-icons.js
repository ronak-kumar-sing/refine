/**
 * Icon Generator Script
 * Run this script to generate PNG icons from the canvas
 *
 * Usage: Open this file in a browser console or run with Node.js canvas
 */

// This creates simple colored icons with the sparkle emoji
// For production, you should use proper design tools to create icons

const iconSizes = [16, 48, 128];

function generateIconDataURL(size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#6366f1');
  gradient.addColorStop(1, '#8b5cf6');

  // Draw rounded rectangle
  const radius = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw sparkle emoji
  ctx.font = `${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✨', size / 2, size / 2);

  return canvas.toDataURL('image/png');
}

// Run in browser console to generate icons
console.log('Copy these data URLs and save as PNG files:');
iconSizes.forEach((size) => {
  console.log(`\nicon${size}.png:`);
  console.log(generateIconDataURL(size));
});
