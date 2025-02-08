// generate-icons.js
const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size, outputPath) {
  // Create a canvas with the given dimensions.
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fill the background with a solid color (for example, a shade of blue).
  ctx.fillStyle = '#3498db';
  ctx.fillRect(0, 0, size, size);

  // Set up white text that displays the size (e.g., "16", "48", "128").
  ctx.fillStyle = 'white';
  // Use a font size roughly half of the icon size.
  ctx.font = `${Math.floor(size / 2)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(size), size / 2, size / 2);

  // Convert the canvas to a PNG buffer.
  const buffer = canvas.toBuffer('image/png');
  // Write the buffer to a file.
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated ${outputPath}`);
}

// Generate the icons at the required sizes.
generateIcon(16, 'icon16.png');
generateIcon(48, 'icon48.png');
generateIcon(128, 'icon128.png');
