const fs = require('fs');
const path = require('path');

// Resolve puppeteer from auditpilot/backend/node_modules
const puppeteerPath = '/home/sid/.gemini/antigravity/scratch/auditpilot/backend/node_modules/puppeteer';
const puppeteer = require(puppeteerPath);

async function generateIcons() {
  console.log('[generate-icons] Starting SEO Inspector icon generation from SVG...');
  const svgPath = path.resolve(__dirname, '../store-assets/seo-inspector-logo.svg');
  if (!fs.existsSync(svgPath)) {
    throw new Error('SVG not found at: ' + svgPath);
  }
  const svgContent = fs.readFileSync(svgPath, 'utf8');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'],
  });

  const sizes = [16, 32, 48, 128, 512];
  const targetDirs = [
    path.resolve(__dirname, '../store-assets/icons'),
    path.resolve(__dirname, '../public/icons'),
    path.resolve(__dirname, '../dist/icons'),
  ];

  targetDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  for (const size of sizes) {
    const page = await browser.newPage();
    await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body {
              width: ${size}px;
              height: ${size}px;
              overflow: hidden;
              background: transparent;
            }
            svg {
              width: ${size}px;
              height: ${size}px;
              display: block;
            }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
      </html>
    `;

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pngBuffer = await page.screenshot({
      omitBackground: true,
      type: 'png',
    });

    for (const dir of targetDirs) {
      const outPath = path.join(dir, `icon-${size}.png`);
      fs.writeFileSync(outPath, pngBuffer);
      console.log(`[generate-icons] Wrote ${size}x${size} icon to: ${path.relative(path.resolve(__dirname, '..'), outPath)}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('✅ [generate-icons] All 5 icon resolutions generated successfully!');
}

generateIcons().catch((err) => {
  console.error('[generate-icons] Error:', err);
  process.exit(1);
});
