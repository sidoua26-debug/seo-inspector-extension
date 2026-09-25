const fs = require('fs');
const path = require('path');

const puppeteerPath = '/home/sid/.gemini/antigravity/scratch/auditpilot/backend/node_modules/puppeteer';
const puppeteer = require(puppeteerPath);

async function generatePromoTiles() {
  console.log('[generate-promo-tiles] Launching browser to generate promo tiles...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'],
  });

  const outDir = path.resolve(__dirname, '../store-assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const logoSvg = fs.readFileSync(path.resolve(__dirname, '../store-assets/seo-inspector-logo.svg'), 'utf8');

  // ==========================================
  // 1. SMALL PROMO TILE (440 x 280)
  // ==========================================
  {
    console.log('[generate-promo-tiles] Rendering Small Promo Tile (440x280)...');
    const page = await browser.newPage();
    await page.setViewport({ width: 440, height: 280, deviceScaleFactor: 1 });

    const htmlSmall = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 440px;
              height: 280px;
              overflow: hidden;
              background-color: #06090e;
              background-image: 
                radial-gradient(circle at 85% 15%, rgba(20, 184, 166, 0.22) 0%, transparent 55%),
                radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.18) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 60%);
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              color: #f8fafc;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 24px;
              position: relative;
              border: 1px solid #1e293b;
            }
            .grid-overlay {
              position: absolute;
              inset: 0;
              background-image: radial-gradient(#1e293b 1px, transparent 1px);
              background-size: 16px 16px;
              opacity: 0.35;
              pointer-events: none;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: relative;
              z-index: 10;
            }
            .brand {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .logo-wrap {
              width: 36px;
              height: 36px;
              filter: drop-shadow(0 0 10px rgba(20, 184, 166, 0.5));
            }
            .brand-name {
              font-size: 19px;
              font-weight: 800;
              letter-spacing: -0.02em;
              color: #f8fafc;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .brand-name span {
              color: #2dd4bf;
            }
            .badge-version {
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              font-weight: 700;
              background: rgba(16, 185, 129, 0.15);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.35);
              padding: 2px 7px;
              border-radius: 9999px;
            }
            .main-content {
              position: relative;
              z-index: 10;
              margin-top: 4px;
            }
            .tagline {
              font-size: 18px;
              font-weight: 800;
              line-height: 1.25;
              letter-spacing: -0.02em;
              color: #ffffff;
              margin-bottom: 6px;
            }
            .tagline .highlight {
              background: linear-gradient(135deg, #2dd4bf 0%, #34d399 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .subtext {
              font-size: 12px;
              color: #94a3b8;
              line-height: 1.4;
            }
            .pills-container {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              position: relative;
              z-index: 10;
              margin-top: auto;
            }
            .pill {
              font-size: 10px;
              font-weight: 700;
              padding: 4px 9px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .pill-teal {
              background: rgba(13, 148, 136, 0.2);
              border: 1px solid rgba(20, 184, 166, 0.4);
              color: #2dd4bf;
            }
            .pill-emerald {
              background: rgba(16, 185, 129, 0.2);
              border: 1px solid rgba(16, 185, 129, 0.4);
              color: #34d399;
            }
            .pill-cyan {
              background: rgba(6, 182, 212, 0.2);
              border: 1px solid rgba(6, 182, 212, 0.4);
              color: #38bdf8;
            }
            .pill-slate {
              background: rgba(30, 41, 59, 0.8);
              border: 1px solid rgba(71, 85, 105, 0.5);
              color: #cbd5e1;
            }
            .glow-line {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 2px;
              background: linear-gradient(90deg, transparent, #14b8a6, #10b981, transparent);
            }
          </style>
        </head>
        <body>
          <div class="grid-overlay"></div>
          
          <div class="header">
            <div class="brand">
              <div class="logo-wrap">${logoSvg}</div>
              <div class="brand-name">SEO <span>Inspector</span></div>
            </div>
            <div class="badge-version">v1.0 • MV3</div>
          </div>

          <div class="main-content">
            <div class="tagline">
              <span class="highlight">100+ Parameter</span> On-Page Technical Diagnostics
            </div>
            <div class="subtext">
              Real-time heading trees, link audits, hreflangs, and JSON-LD Schema.org validation.
            </div>
          </div>

          <div class="pills-container">
            <div class="pill pill-teal">9 Interactive Tabs</div>
            <div class="pill pill-emerald">Schema.org</div>
            <div class="pill pill-cyan">Real-Time DOM</div>
            <div class="pill pill-slate">100% Client-Side</div>
          </div>

          <div class="glow-line"></div>
        </body>
      </html>
    `;

    await page.setContent(htmlSmall, { waitUntil: 'networkidle0' });
    const smallBuffer = await page.screenshot({ type: 'png' });
    const smallOut = path.join(outDir, 'promo-tile-small-440x280.png');
    fs.writeFileSync(smallOut, smallBuffer);
    console.log(`[generate-promo-tiles] Wrote: ${path.relative(process.cwd(), smallOut)} (${smallBuffer.length} bytes)`);
    await page.close();
  }

  // ==========================================
  // 2. MARQUEE / LARGE PROMO TILE (1400 x 560)
  // ==========================================
  {
    console.log('[generate-promo-tiles] Rendering Marquee Promo Tile (1400x560)...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 560, deviceScaleFactor: 1 });

    const htmlMarquee = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 1400px;
              height: 560px;
              overflow: hidden;
              background-color: #06090e;
              background-image: 
                radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.25) 0%, transparent 50%),
                radial-gradient(circle at 10% 80%, rgba(16, 185, 129, 0.20) 0%, transparent 45%),
                radial-gradient(circle at 50% 10%, rgba(6, 182, 212, 0.12) 0%, transparent 60%);
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              color: #f8fafc;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 56px 72px;
              position: relative;
            }
            .grid-overlay {
              position: absolute;
              inset: 0;
              background-image: radial-gradient(#1e293b 1px, transparent 1px);
              background-size: 24px 24px;
              opacity: 0.35;
              pointer-events: none;
            }
            .left-col {
              flex: 1;
              max-width: 660px;
              z-index: 10;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .brand-row {
              display: flex;
              align-items: center;
              gap: 16px;
              margin-bottom: 24px;
            }
            .logo-large {
              width: 56px;
              height: 56px;
              filter: drop-shadow(0 0 16px rgba(20, 184, 166, 0.6));
            }
            .brand-title {
              font-size: 28px;
              font-weight: 900;
              letter-spacing: -0.03em;
              color: #f8fafc;
            }
            .brand-title span {
              color: #2dd4bf;
            }
            .platform-badge {
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              font-weight: 700;
              background: rgba(16, 185, 129, 0.15);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.35);
              padding: 4px 12px;
              border-radius: 9999px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .headline {
              font-size: 40px;
              font-weight: 900;
              line-height: 1.15;
              letter-spacing: -0.03em;
              color: #ffffff;
              margin-bottom: 18px;
            }
            .headline .gradient-text {
              background: linear-gradient(135deg, #2dd4bf 0%, #10b981 60%, #38bdf8 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .description {
              font-size: 16px;
              color: #94a3b8;
              line-height: 1.55;
              margin-bottom: 28px;
            }
            .pills-grid {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }
            .pill-item {
              font-size: 12.5px;
              font-weight: 700;
              padding: 7px 14px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .pill-teal {
              background: rgba(13, 148, 136, 0.22);
              border: 1px solid rgba(20, 184, 166, 0.45);
              color: #2dd4bf;
            }
            .pill-emerald {
              background: rgba(16, 185, 129, 0.22);
              border: 1px solid rgba(16, 185, 129, 0.45);
              color: #34d399;
            }
            .pill-cyan {
              background: rgba(6, 182, 212, 0.22);
              border: 1px solid rgba(6, 182, 212, 0.45);
              color: #38bdf8;
            }
            .pill-slate {
              background: rgba(30, 41, 59, 0.85);
              border: 1px solid rgba(71, 85, 105, 0.5);
              color: #cbd5e1;
            }

            /* Right Column: High Fidelity Interface Preview */
            .right-col {
              flex: 1;
              max-width: 540px;
              z-index: 10;
              display: flex;
              justify-content: center;
            }
            .mock-window {
              width: 500px;
              background: #0b111e;
              border: 1px solid #1e293b;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 
                0 25px 50px -12px rgba(0, 0, 0, 0.8),
                0 0 35px rgba(20, 184, 166, 0.25);
            }
            .mock-header {
              background: #080d17;
              padding: 14px 18px;
              border-bottom: 1px solid #1e293b;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .mock-score-badge {
              display: flex;
              align-items: center;
              gap: 8px;
              background: rgba(16, 185, 129, 0.15);
              border: 1px solid rgba(16, 185, 129, 0.4);
              padding: 5px 12px;
              border-radius: 9999px;
              color: #34d399;
              font-size: 13px;
              font-weight: 800;
            }
            .mock-nav-tabs {
              display: flex;
              background: #090e1a;
              border-bottom: 1px solid #1e293b;
              padding: 4px 8px;
              gap: 4px;
              overflow: hidden;
            }
            .mock-tab {
              padding: 6px 12px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 700;
              color: #64748b;
            }
            .mock-tab.active {
              background: rgba(20, 184, 166, 0.2);
              color: #2dd4bf;
              border: 1px solid rgba(20, 184, 166, 0.4);
            }
            .mock-body {
              padding: 18px;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            .metric-card {
              background: #0f172a;
              border: 1px solid #1e293b;
              border-radius: 10px;
              padding: 12px 14px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .metric-info {
              display: flex;
              flex-direction: column;
              gap: 3px;
            }
            .metric-title {
              font-size: 11.5px;
              font-weight: 700;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.04em;
            }
            .metric-val {
              font-size: 13.5px;
              font-weight: 700;
              color: #f1f5f9;
            }
            .status-badge-ok {
              background: rgba(16, 185, 129, 0.15);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.4);
              font-size: 11px;
              font-weight: 700;
              padding: 3px 8px;
              border-radius: 6px;
            }
            .heading-tree-preview {
              background: #0a0f1d;
              border: 1px dashed #334155;
              border-radius: 8px;
              padding: 10px 12px;
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              color: #cbd5e1;
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            .ht-row {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .ht-tag {
              background: #1e293b;
              padding: 1px 5px;
              border-radius: 4px;
              font-weight: 700;
            }
            .ht-tag.h1 { color: #2dd4bf; border-left: 2px solid #2dd4bf; }
            .ht-tag.h2 { color: #38bdf8; border-left: 2px solid #38bdf8; }
          </style>
        </head>
        <body>
          <div class="grid-overlay"></div>

          <div class="left-col">
            <div class="brand-row">
              <div class="logo-large">${logoSvg}</div>
              <div class="brand-title">SEO <span>Inspector</span></div>
              <div class="platform-badge">Edge & Chrome MV3</div>
            </div>

            <div class="headline">
              <span class="gradient-text">100+ Parameter</span> On-Page Technical Diagnostics
            </div>

            <div class="description">
              Instant in-depth DOM inspection, heading hierarchy tree, link audits, hreflang alternates, JSON-LD Schema.org entities, and Core Web Vitals with zero remote latency.
            </div>

            <div class="pills-grid">
              <div class="pill-item pill-teal">⚡ 9 Interactive Tabs</div>
              <div class="pill-item pill-emerald">🧬 Schema.org Validator</div>
              <div class="pill-item pill-cyan">🔍 Real-Time DOM Inspection</div>
              <div class="pill-item pill-slate">🔒 100% Client-Side & Private</div>
              <div class="pill-item pill-slate">📋 1-Click MD & JSON Export</div>
            </div>
          </div>

          <div class="right-col">
            <div class="mock-window">
              <div class="mock-header">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 24px; height: 24px;">${logoSvg}</div>
                  <span style="font-weight: 800; font-size: 14px; color: #f8fafc;">SEO Inspector</span>
                </div>
                <div class="mock-score-badge">
                  <span>SEO Health: 94/100</span>
                </div>
              </div>

              <div class="mock-nav-tabs">
                <div class="mock-tab active">Overview</div>
                <div class="mock-tab">Content (H1-H6)</div>
                <div class="mock-tab">Links</div>
                <div class="mock-tab">Schema</div>
                <div class="mock-tab">Speed</div>
              </div>

              <div class="mock-body">
                <div class="metric-card">
                  <div class="metric-info">
                    <span class="metric-title">Page Title (58 chars)</span>
                    <span class="metric-val">Ultimate Guide to Technical SEO & DOM Diagnostics</span>
                  </div>
                  <span class="status-badge-ok">Optimal</span>
                </div>

                <div class="metric-card">
                  <div class="metric-info">
                    <span class="metric-title">Canonical & Robots</span>
                    <span class="metric-val">https://example.com/guide • index, follow</span>
                  </div>
                  <span class="status-badge-ok">Self-Ref</span>
                </div>

                <div class="heading-tree-preview">
                  <div class="ht-row"><span class="ht-tag h1">H1</span> Complete Technical SEO Blueprint (2026)</div>
                  <div class="ht-row" style="margin-left: 14px;"><span class="ht-tag h2">H2</span> Core Web Vitals & DOM Performance</div>
                  <div class="ht-row" style="margin-left: 14px;"><span class="ht-tag h2">H2</span> Structured Data & Rich Snippets</div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlMarquee, { waitUntil: 'networkidle0' });
    const marqueeBuffer = await page.screenshot({ type: 'png' });
    const marqueeOut = path.join(outDir, 'promo-tile-marquee-1400x560.png');
    fs.writeFileSync(marqueeOut, marqueeBuffer);
    console.log(`[generate-promo-tiles] Wrote: ${path.relative(process.cwd(), marqueeOut)} (${marqueeBuffer.length} bytes)`);
    await page.close();
  }

  await browser.close();
  console.log('✅ [generate-promo-tiles] All promotional tiles generated successfully!');
}

generatePromoTiles().catch((err) => {
  console.error('[generate-promo-tiles] Error:', err);
  process.exit(1);
});
