const fs = require('fs');
const path = require('path');

const puppeteerPath = '/home/sid/.gemini/antigravity/scratch/auditpilot/backend/node_modules/puppeteer';
const puppeteer = require(puppeteerPath);

async function generatePromoTiles() {
  console.log('[generate-promo-tiles-v2] Launching browser to generate promo tiles...');
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
    console.log('[generate-promo-tiles-v2] Rendering Small Promo Tile (440x280)...');
    const page = await browser.newPage();
    await page.setViewport({ width: 440, height: 280, deviceScaleFactor: 1 });

    const htmlSmall = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 440px;
              height: 280px;
              overflow: hidden;
              background-color: #050811;
              background-image: 
                radial-gradient(circle at 88% 12%, rgba(20, 184, 166, 0.26) 0%, transparent 50%),
                radial-gradient(circle at 12% 88%, rgba(16, 185, 129, 0.20) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 60%);
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              color: #f8fafc;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 24px 26px;
              position: relative;
            }
            .grid-overlay {
              position: absolute;
              inset: 0;
              background-image: radial-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px);
              background-size: 16px 16px;
              pointer-events: none;
            }
            .border-glow {
              position: absolute;
              inset: 0;
              border: 1px solid rgba(51, 65, 85, 0.7);
              pointer-events: none;
            }
            .top-bar {
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: relative;
              z-index: 10;
            }
            .brand {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .logo-wrap {
              width: 38px;
              height: 38px;
              filter: drop-shadow(0 0 14px rgba(20, 184, 166, 0.55));
            }
            .brand-name {
              font-size: 19px;
              font-weight: 900;
              letter-spacing: -0.03em;
              color: #ffffff;
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .brand-name span {
              color: #2dd4bf;
            }
            .version-pill {
              font-family: 'JetBrains Mono', monospace;
              font-size: 9.5px;
              font-weight: 700;
              background: rgba(16, 185, 129, 0.14);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.35);
              padding: 3px 8px;
              border-radius: 9999px;
              letter-spacing: 0.02em;
            }
            .center-content {
              position: relative;
              z-index: 10;
              margin: auto 0;
            }
            .headline {
              font-size: 20px;
              font-weight: 900;
              line-height: 1.25;
              letter-spacing: -0.03em;
              color: #ffffff;
              margin-bottom: 7px;
            }
            .headline .gradient-accent {
              background: linear-gradient(135deg, #2dd4bf 0%, #34d399 50%, #38bdf8 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .subheadline {
              font-size: 12px;
              color: #94a3b8;
              line-height: 1.45;
              font-weight: 500;
            }
            .footer-pills {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              position: relative;
              z-index: 10;
            }
            .pill {
              font-size: 10px;
              font-weight: 700;
              padding: 4px 9px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              gap: 4px;
              letter-spacing: 0.01em;
            }
            .pill-teal {
              background: rgba(20, 184, 166, 0.16);
              border: 1px solid rgba(20, 184, 166, 0.4);
              color: #2dd4bf;
            }
            .pill-emerald {
              background: rgba(16, 185, 129, 0.16);
              border: 1px solid rgba(16, 185, 129, 0.4);
              color: #34d399;
            }
            .pill-cyan {
              background: rgba(6, 182, 212, 0.16);
              border: 1px solid rgba(6, 182, 212, 0.4);
              color: #38bdf8;
            }
            .pill-slate {
              background: rgba(30, 41, 59, 0.7);
              border: 1px solid rgba(71, 85, 105, 0.5);
              color: #cbd5e1;
            }
            .bottom-accent {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 2px;
              background: linear-gradient(90deg, transparent, #14b8a6, #10b981, #06b6d4, transparent);
            }
          </style>
        </head>
        <body>
          <div class="grid-overlay"></div>
          <div class="border-glow"></div>

          <div class="top-bar">
            <div class="brand">
              <div class="logo-wrap">${logoSvg}</div>
              <div class="brand-name">SEO <span>Inspector</span></div>
            </div>
            <div class="version-pill">MV3 • Edge & Chrome</div>
          </div>

          <div class="center-content">
            <div class="headline">
              <span class="gradient-accent">100+ Parameter</span> On-Page Technical Diagnostics
            </div>
            <div class="subheadline">
              DOM tree hierarchy, link graph, hreflang alternates, and JSON-LD validation in real-time.
            </div>
          </div>

          <div class="footer-pills">
            <div class="pill pill-teal">⚡ 9 Diagnostic Tabs</div>
            <div class="pill pill-emerald">🧬 Schema.org</div>
            <div class="pill pill-cyan">⚡ Core Web Vitals</div>
            <div class="pill pill-slate">🔒 100% Client-Side</div>
          </div>

          <div class="bottom-accent"></div>
        </body>
      </html>
    `;

    await page.setContent(htmlSmall, { waitUntil: 'networkidle0' });
    const smallOut = path.join(outDir, 'promo-tile-small-440x280.png');
    await page.screenshot({ path: smallOut, clip: { x: 0, y: 0, width: 440, height: 280 } });
    console.log(`[generate-promo-tiles-v2] Wrote: ${path.relative(process.cwd(), smallOut)}`);
    await page.close();
  }

  // ==========================================
  // 2. MARQUEE BANNER (1400 x 560)
  // ==========================================
  {
    console.log('[generate-promo-tiles-v2] Rendering Marquee Promo Banner (1400x560)...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 560, deviceScaleFactor: 1 });

    const htmlMarquee = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 1400px;
              height: 560px;
              overflow: hidden;
              background-color: #040711;
              background-image: 
                radial-gradient(circle at 82% 18%, rgba(20, 184, 166, 0.28) 0%, transparent 48%),
                radial-gradient(circle at 12% 82%, rgba(16, 185, 129, 0.22) 0%, transparent 45%),
                radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.10) 0%, transparent 60%);
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              color: #f8fafc;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 76px;
              position: relative;
            }
            .grid-overlay {
              position: absolute;
              inset: 0;
              background-image: radial-gradient(rgba(148, 163, 184, 0.12) 1.2px, transparent 1.2px);
              background-size: 24px 24px;
              pointer-events: none;
            }
            .border-glow {
              position: absolute;
              inset: 0;
              border: 1px solid rgba(51, 65, 85, 0.6);
              pointer-events: none;
            }
            .bottom-accent {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 3px;
              background: linear-gradient(90deg, transparent, #14b8a6, #10b981, #06b6d4, transparent);
            }
            .left-col {
              flex: 1;
              max-width: 660px;
              z-index: 10;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .brand-badge-row {
              display: flex;
              align-items: center;
              gap: 16px;
              margin-bottom: 22px;
            }
            .logo-large {
              width: 58px;
              height: 58px;
              filter: drop-shadow(0 0 18px rgba(20, 184, 166, 0.65));
            }
            .brand-title {
              font-size: 32px;
              font-weight: 900;
              letter-spacing: -0.035em;
              color: #ffffff;
            }
            .brand-title span {
              color: #2dd4bf;
            }
            .pill-tag {
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              font-weight: 700;
              background: rgba(16, 185, 129, 0.14);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.35);
              padding: 4px 12px;
              border-radius: 9999px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .headline {
              font-size: 42px;
              font-weight: 900;
              line-height: 1.15;
              letter-spacing: -0.035em;
              color: #ffffff;
              margin-bottom: 18px;
            }
            .headline .gradient-text {
              background: linear-gradient(135deg, #2dd4bf 0%, #10b981 50%, #38bdf8 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .description {
              font-size: 16px;
              color: #94a3b8;
              line-height: 1.55;
              margin-bottom: 28px;
              font-weight: 500;
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
              background: rgba(20, 184, 166, 0.16);
              border: 1px solid rgba(20, 184, 166, 0.45);
              color: #2dd4bf;
            }
            .pill-emerald {
              background: rgba(16, 185, 129, 0.16);
              border: 1px solid rgba(16, 185, 129, 0.45);
              color: #34d399;
            }
            .pill-cyan {
              background: rgba(6, 182, 212, 0.16);
              border: 1px solid rgba(6, 182, 212, 0.45);
              color: #38bdf8;
            }
            .pill-slate {
              background: rgba(30, 41, 59, 0.8);
              border: 1px solid rgba(71, 85, 105, 0.5);
              color: #cbd5e1;
            }

            .right-col {
              flex: 1;
              max-width: 550px;
              z-index: 10;
              display: flex;
              justify-content: flex-end;
              perspective: 1000px;
            }
            .mock-window {
              width: 510px;
              background: #090e1a;
              border: 1px solid rgba(51, 65, 85, 0.9);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 
                0 30px 60px -15px rgba(0, 0, 0, 0.9),
                0 0 40px rgba(20, 184, 166, 0.22);
              transform: rotateY(-6deg) rotateX(2deg);
            }
            .mock-header {
              background: #060911;
              padding: 12px 18px;
              border-bottom: 1px solid #1e293b;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .mock-header-brand {
              display: flex;
              align-items: center;
              gap: 9px;
            }
            .mock-header-title {
              font-weight: 800;
              font-size: 13.5px;
              color: #f8fafc;
            }
            .mock-score-badge {
              display: flex;
              align-items: center;
              gap: 8px;
              background: rgba(16, 185, 129, 0.15);
              border: 1px solid rgba(16, 185, 129, 0.4);
              padding: 4px 12px;
              border-radius: 9999px;
              color: #34d399;
              font-size: 12.5px;
              font-weight: 800;
            }
            .score-indicator-dot {
              width: 7px;
              height: 7px;
              border-radius: 50%;
              background: #10b981;
              box-shadow: 0 0 8px #10b981;
            }
            .mock-nav-tabs {
              display: flex;
              background: #080c16;
              border-bottom: 1px solid #1e293b;
              padding: 4px 8px;
              gap: 4px;
              overflow: hidden;
            }
            .mock-tab {
              padding: 6px 11px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 700;
              color: #64748b;
              white-space: nowrap;
            }
            .mock-tab.active {
              background: rgba(20, 184, 166, 0.18);
              color: #2dd4bf;
              border: 1px solid rgba(20, 184, 166, 0.4);
            }
            .mock-tab.badge-tab {
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .mock-tab-badge {
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              background: rgba(244, 63, 94, 0.2);
              color: #fb7185;
              border: 1px solid rgba(244, 63, 94, 0.4);
              padding: 1px 4px;
              border-radius: 9999px;
            }
            .mock-body {
              padding: 18px;
              display: flex;
              flex-direction: column;
              gap: 12px;
              background: #090e1a;
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
              min-width: 0;
            }
            .metric-title {
              font-size: 11px;
              font-weight: 700;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.04em;
            }
            .metric-val {
              font-size: 13px;
              font-weight: 700;
              color: #f1f5f9;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .status-badge-ok {
              background: rgba(16, 185, 129, 0.15);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.4);
              font-size: 11px;
              font-weight: 700;
              padding: 3px 8px;
              border-radius: 6px;
              shrink: 0;
            }
            .heading-tree-preview {
              background: #060911;
              border: 1px dashed #334155;
              border-radius: 8px;
              padding: 10px 14px;
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              color: #cbd5e1;
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .ht-row {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .ht-tag {
              background: #1e293b;
              padding: 1px 6px;
              border-radius: 4px;
              font-weight: 700;
              font-size: 10px;
            }
            .ht-tag.h1 { color: #2dd4bf; border-left: 2px solid #2dd4bf; }
            .ht-tag.h2 { color: #38bdf8; border-left: 2px solid #38bdf8; }
            .ht-tag.schema { color: #34d399; border-left: 2px solid #34d399; }
          </style>
        </head>
        <body>
          <div class="grid-overlay"></div>
          <div class="border-glow"></div>

          <div class="left-col">
            <div class="brand-badge-row">
              <div class="logo-large">${logoSvg}</div>
              <div>
                <div class="brand-title">SEO <span>Inspector</span></div>
                <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-top: 2px;">Professional On-Page SEO Suite</div>
              </div>
              <div class="pill-tag">MV3 • Edge & Chrome</div>
            </div>

            <div class="headline">
              <span class="gradient-text">100+ Parameter</span> On-Page Technical Diagnostics
            </div>

            <div class="description">
              Instant DOM structure inspection, heading hierarchy tree, internal & external link audits, hreflang alternates, JSON-LD Schema.org entities, and Core Web Vitals.
            </div>

            <div class="pills-grid">
              <div class="pill-item pill-teal">⚡ 9 Diagnostic Tabs</div>
              <div class="pill-item pill-emerald">🧬 Schema.org Validator</div>
              <div class="pill-item pill-cyan">🔍 Real-Time DOM Inspection</div>
              <div class="pill-item pill-slate">🔒 100% Client-Side & Private</div>
              <div class="pill-item pill-slate">📋 1-Click MD & JSON Export</div>
            </div>
          </div>

          <div class="right-col">
            <div class="mock-window">
              <div class="mock-header">
                <div class="mock-header-brand">
                  <div style="width: 24px; height: 24px;">${logoSvg}</div>
                  <span class="mock-header-title">SEO Inspector</span>
                  <span style="font-size: 10px; background: rgba(20, 184, 166, 0.15); color: #2dd4bf; border: 1px solid rgba(20, 184, 166, 0.3); padding: 1px 6px; border-radius: 4px; font-weight: 700; font-family: 'JetBrains Mono', monospace;">v1.0</span>
                </div>
                <div class="mock-score-badge">
                  <div class="score-indicator-dot"></div>
                  <span>Health: 94/100</span>
                </div>
              </div>

              <div class="mock-nav-tabs">
                <div class="mock-tab active">Overview</div>
                <div class="mock-tab">Content</div>
                <div class="mock-tab">Links</div>
                <div class="mock-tab">Hreflangs</div>
                <div class="mock-tab">Images</div>
                <div class="mock-tab">Schema</div>
                <div class="mock-tab badge-tab">Issues <span class="mock-tab-badge">2</span></div>
              </div>

              <div class="mock-body">
                <div class="metric-card">
                  <div class="metric-info">
                    <span class="metric-title">Page Title (58 chars)</span>
                    <span class="metric-val">Technical SEO & DOM Inspector Guide | Acme Corp</span>
                  </div>
                  <span class="status-badge-ok">Optimal</span>
                </div>

                <div class="metric-card">
                  <div class="metric-info">
                    <span class="metric-title">Canonical & Directives</span>
                    <span class="metric-val">https://acme.dev/guide • index, follow</span>
                  </div>
                  <span class="status-badge-ok">Self-Ref</span>
                </div>

                <div class="heading-tree-preview">
                  <div class="ht-row"><span class="ht-tag h1">H1</span> Complete Technical SEO Architecture (2026)</div>
                  <div class="ht-row" style="margin-left: 12px;"><span class="ht-tag h2">H2</span> Core Web Vitals & Real-Time Performance</div>
                  <div class="ht-row" style="margin-left: 12px;"><span class="ht-tag schema">JSON-LD</span> @type: TechArticle (Valid)</div>
                </div>
              </div>
            </div>
          </div>

          <div class="bottom-accent"></div>
        </body>
      </html>
    `;

    await page.setContent(htmlMarquee, { waitUntil: 'networkidle0' });
    const marqueeOut = path.join(outDir, 'promo-tile-marquee-1400x560.png');
    await page.screenshot({ path: marqueeOut, clip: { x: 0, y: 0, width: 1400, height: 560 } });
    console.log(`[generate-promo-tiles-v2] Wrote: ${path.relative(process.cwd(), marqueeOut)}`);
    await page.close();
  }

  // ==========================================
  // 3. FEATURED PROMO BANNER (920 x 680)
  // ==========================================
  {
    console.log('[generate-promo-tiles-v2] Rendering Featured Promo Banner (920x680)...');
    const page = await browser.newPage();
    await page.setViewport({ width: 920, height: 680, deviceScaleFactor: 1 });

    const htmlFeatured = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 920px;
              height: 680px;
              overflow: hidden;
              background-color: #040711;
              background-image: 
                radial-gradient(circle at 80% 15%, rgba(20, 184, 166, 0.28) 0%, transparent 45%),
                radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.22) 0%, transparent 45%),
                radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.10) 0%, transparent 55%);
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              color: #f8fafc;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 44px 52px;
              position: relative;
            }
            .grid-overlay {
              position: absolute;
              inset: 0;
              background-image: radial-gradient(rgba(148, 163, 184, 0.12) 1.2px, transparent 1.2px);
              background-size: 20px 20px;
              pointer-events: none;
            }
            .border-glow {
              position: absolute;
              inset: 0;
              border: 1px solid rgba(51, 65, 85, 0.65);
              pointer-events: none;
            }
            .bottom-accent {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 3px;
              background: linear-gradient(90deg, transparent, #14b8a6, #10b981, #06b6d4, transparent);
            }
            .header-bar {
              display: flex;
              align-items: center;
              justify-content: space-between;
              position: relative;
              z-index: 10;
            }
            .brand {
              display: flex;
              align-items: center;
              gap: 14px;
            }
            .logo-wrap {
              width: 48px;
              height: 48px;
              filter: drop-shadow(0 0 16px rgba(20, 184, 166, 0.6));
            }
            .brand-name {
              font-size: 24px;
              font-weight: 900;
              letter-spacing: -0.03em;
              color: #ffffff;
            }
            .brand-name span {
              color: #2dd4bf;
            }
            .badge-tag {
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              font-weight: 700;
              background: rgba(16, 185, 129, 0.14);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.35);
              padding: 4px 12px;
              border-radius: 9999px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .hero-content {
              position: relative;
              z-index: 10;
              margin: 20px 0 24px 0;
            }
            .headline {
              font-size: 34px;
              font-weight: 900;
              line-height: 1.2;
              letter-spacing: -0.03em;
              color: #ffffff;
              margin-bottom: 12px;
            }
            .headline .gradient-accent {
              background: linear-gradient(135deg, #2dd4bf 0%, #10b981 50%, #38bdf8 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .subheadline {
              font-size: 15px;
              color: #94a3b8;
              line-height: 1.5;
              font-weight: 500;
              max-width: 760px;
            }
            .ui-preview-strip {
              position: relative;
              z-index: 10;
              background: #090e1a;
              border: 1px solid #1e293b;
              border-radius: 14px;
              padding: 16px 20px;
              box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7);
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
            }
            .preview-card {
              background: #0f172a;
              border: 1px solid #1e293b;
              border-radius: 10px;
              padding: 14px;
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .pc-label {
              font-size: 11px;
              font-weight: 700;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.04em;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .pc-val {
              font-size: 15px;
              font-weight: 800;
              color: #f8fafc;
            }
            .pc-sub {
              font-size: 11.5px;
              color: #64748b;
            }
            .status-tag {
              font-size: 10px;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 4px;
            }
            .tag-green {
              background: rgba(16, 185, 129, 0.15);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.4);
            }
            .tag-blue {
              background: rgba(6, 182, 212, 0.15);
              color: #38bdf8;
              border: 1px solid rgba(6, 182, 212, 0.4);
            }
            .footer-pills {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              position: relative;
              z-index: 10;
            }
            .pill {
              font-size: 11.5px;
              font-weight: 700;
              padding: 6px 12px;
              border-radius: 7px;
              display: flex;
              align-items: center;
              gap: 5px;
            }
            .pill-teal {
              background: rgba(20, 184, 166, 0.16);
              border: 1px solid rgba(20, 184, 166, 0.45);
              color: #2dd4bf;
            }
            .pill-emerald {
              background: rgba(16, 185, 129, 0.16);
              border: 1px solid rgba(16, 185, 129, 0.45);
              color: #34d399;
            }
            .pill-cyan {
              background: rgba(6, 182, 212, 0.16);
              border: 1px solid rgba(6, 182, 212, 0.45);
              color: #38bdf8;
            }
            .pill-slate {
              background: rgba(30, 41, 59, 0.8);
              border: 1px solid rgba(71, 85, 105, 0.5);
              color: #cbd5e1;
            }
          </style>
        </head>
        <body>
          <div class="grid-overlay"></div>
          <div class="border-glow"></div>

          <div class="header-bar">
            <div class="brand">
              <div class="logo-wrap">${logoSvg}</div>
              <div>
                <div class="brand-name">SEO <span>Inspector</span></div>
                <div style="font-size: 11px; color: #64748b; font-weight: 600;">100+ Parameter On-Page Technical Auditor</div>
              </div>
            </div>
            <div class="badge-tag">Edge & Chrome MV3</div>
          </div>

          <div class="hero-content">
            <div class="headline">
              The Agency-Grade <span class="gradient-accent">Technical SEO</span> Suite for Modern Developers
            </div>
            <div class="subheadline">
              Audit heading DOM hierarchies, analyze link authority, detect broken hreflangs, validate Schema.org entities, and track Core Web Vitals with zero remote tracking latency.
            </div>
          </div>

          <div class="ui-preview-strip">
            <div class="preview-card">
              <div class="pc-label">
                <span>Health Score</span>
                <span class="status-tag tag-green">Good</span>
              </div>
              <div class="pc-val" style="color: #34d399;">94 / 100</div>
              <div class="pc-sub">12 Passed • 2 Warnings</div>
            </div>

            <div class="preview-card">
              <div class="pc-label">
                <span>DOM Headings</span>
                <span class="status-tag tag-blue">Tree OK</span>
              </div>
              <div class="pc-val">1 H1 • 6 H2 • 4 H3</div>
              <div class="pc-sub">No skipped heading levels</div>
            </div>

            <div class="preview-card">
              <div class="pc-label">
                <span>Schema.org</span>
                <span class="status-tag tag-green">Valid</span>
              </div>
              <div class="pc-val">@type: TechArticle</div>
              <div class="pc-sub">Rich snippet eligible</div>
            </div>
          </div>

          <div class="footer-pills">
            <div class="pill pill-teal">⚡ 9 Diagnostic Tabs</div>
            <div class="pill pill-emerald">🧬 Schema.org Validator</div>
            <div class="pill pill-cyan">⚡ Core Web Vitals</div>
            <div class="pill pill-slate">🔒 100% Client-Side</div>
            <div class="pill pill-slate">📋 1-Click MD & JSON Export</div>
          </div>

          <div class="bottom-accent"></div>
        </body>
      </html>
    `;

    await page.setContent(htmlFeatured, { waitUntil: 'networkidle0' });
    const featuredOut = path.join(outDir, 'promo-tile-featured-920x680.png');
    await page.screenshot({ path: featuredOut, clip: { x: 0, y: 0, width: 920, height: 680 } });
    console.log(`[generate-promo-tiles-v2] Wrote: ${path.relative(process.cwd(), featuredOut)}`);
    await page.close();
  }

  await browser.close();
  console.log('✅ [generate-promo-tiles-v2] All promotional tiles generated successfully!');
}

generatePromoTiles().catch((err) => {
  console.error('[generate-promo-tiles-v2] Error:', err);
  process.exit(1);
});
