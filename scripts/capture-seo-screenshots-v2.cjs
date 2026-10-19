const fs = require('fs');
const path = require('path');

const puppeteerPath = '/home/sid/.gemini/antigravity/scratch/auditpilot/backend/node_modules/puppeteer';
const puppeteer = require(puppeteerPath);

async function captureScreenshots() {
  console.log('[capture-seo-screenshots-v2] Launching browser to capture store screenshots...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'],
  });

  const outDir = path.resolve(__dirname, '../store-assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const logoSvg = fs.readFileSync(path.resolve(__dirname, '../store-assets/seo-inspector-logo.svg'), 'utf8');

  // Helper for generating modern browser frame + page mock + elevated extension popup
  function buildScreenshotHtml({ badgeTitle, headline, subheadline, activeTabId, popupBodyHtml, floatingCardsHtml = '' }) {
    // Exact 9 tabs matching production TabNavigation.tsx
    const tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'content', label: 'Content' },
      { id: 'links', label: 'Links' },
      { id: 'hreflangs', label: 'Hreflangs' },
      { id: 'images', label: 'Images' },
      { id: 'schema', label: 'Schema' },
      { id: 'pagespeed', label: 'PageSpeed' },
      { id: 'tracking', label: 'GSC/GA4' },
      { id: 'issues', label: 'Issues', badge: '3' },
    ];

    const tabNavHtml = tabs
      .map(
        (t) => `
        <div class="popup-tab ${t.id === activeTabId ? 'active' : ''}">
          <span>${t.label}</span>
          ${t.badge ? `<span class="tab-badge">${t.badge}</span>` : ''}
        </div>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 1280px;
              height: 800px;
              overflow: hidden;
              background: #040711;
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              color: #f8fafc;
              display: flex;
              flex-direction: column;
              position: relative;
            }
            /* Ambient glowing mesh gradients */
            .bg-glow-teal {
              position: absolute;
              top: -120px;
              right: 12%;
              width: 650px;
              height: 650px;
              background: radial-gradient(circle, rgba(20, 184, 166, 0.22) 0%, transparent 68%);
              filter: blur(60px);
              pointer-events: none;
            }
            .bg-glow-emerald {
              position: absolute;
              bottom: -160px;
              left: 8%;
              width: 750px;
              height: 750px;
              background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 65%);
              filter: blur(70px);
              pointer-events: none;
            }
            .grid-pattern {
              position: absolute;
              inset: 0;
              background-image: radial-gradient(rgba(148, 163, 184, 0.10) 1.2px, transparent 1.2px);
              background-size: 24px 24px;
              pointer-events: none;
            }

            /* Marketing Header Banner */
            .header-banner {
              height: 68px;
              background: rgba(8, 13, 24, 0.85);
              backdrop-filter: blur(12px);
              border-bottom: 1px solid rgba(30, 41, 59, 0.8);
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 32px;
              z-index: 20;
            }
            .brand-left {
              display: flex;
              align-items: center;
              gap: 14px;
            }
            .logo-icon {
              width: 34px;
              height: 34px;
              filter: drop-shadow(0 0 12px rgba(20, 184, 166, 0.5));
            }
            .brand-title {
              font-size: 17px;
              font-weight: 900;
              letter-spacing: -0.02em;
              color: #ffffff;
            }
            .brand-title span {
              color: #2dd4bf;
            }
            .category-badge {
              font-family: 'JetBrains Mono', monospace;
              font-size: 10.5px;
              font-weight: 700;
              background: rgba(20, 184, 166, 0.15);
              color: #2dd4bf;
              border: 1px solid rgba(20, 184, 166, 0.35);
              padding: 3px 10px;
              border-radius: 9999px;
              text-transform: uppercase;
              letter-spacing: 0.04em;
            }
            .headline-group {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 2px;
            }
            .main-headline {
              font-size: 16px;
              font-weight: 800;
              color: #ffffff;
              letter-spacing: -0.02em;
            }
            .main-headline span {
              background: linear-gradient(135deg, #2dd4bf 0%, #34d399 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .sub-headline {
              font-size: 12px;
              color: #94a3b8;
              font-weight: 500;
            }

            /* Main Browser Chrome & Viewport Frame */
            .browser-frame {
              margin: 14px 28px 24px 28px;
              flex: 1;
              background: #080c16;
              border: 1px solid rgba(51, 65, 85, 0.7);
              border-radius: 14px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(20, 184, 166, 0.12);
              display: flex;
              flex-direction: column;
              overflow: hidden;
              z-index: 10;
              position: relative;
            }
            .browser-nav-bar {
              height: 44px;
              background: #060911;
              border-bottom: 1px solid #1e293b;
              display: flex;
              align-items: center;
              padding: 0 18px;
              gap: 16px;
            }
            .traffic-dots {
              display: flex;
              gap: 7px;
            }
            .traffic-dot {
              width: 10.5px;
              height: 10.5px;
              border-radius: 50%;
            }
            .dot-red { background: #ef4444; }
            .dot-yellow { background: #f59e0b; }
            .dot-green { background: #10b981; }

            .url-bar {
              flex: 1;
              max-width: 640px;
              height: 28px;
              background: #0d1424;
              border: 1px solid #1e293b;
              border-radius: 6px;
              display: flex;
              align-items: center;
              padding: 0 12px;
              gap: 8px;
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              color: #cbd5e1;
            }
            .url-protocol { color: #10b981; }
            .url-domain { color: #f8fafc; font-weight: 600; }
            .url-path { color: #64748b; }

            .browser-actions {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-left: auto;
            }
            .active-extension-pill {
              display: flex;
              align-items: center;
              gap: 7px;
              background: rgba(13, 148, 136, 0.22);
              border: 1px solid rgba(20, 184, 166, 0.5);
              padding: 4px 10px;
              border-radius: 7px;
              font-size: 11.5px;
              font-weight: 700;
              color: #2dd4bf;
              box-shadow: 0 0 12px rgba(20, 184, 166, 0.25);
            }

            /* Viewport Canvas (Split layout: Left page mock + Right active extension popup) */
            .viewport-content {
              flex: 1;
              background: #080c16;
              display: flex;
              position: relative;
              overflow: hidden;
            }

            /* Left: Target Page Mockup with contextual glass callout */
            .webpage-mock {
              width: 44%;
              padding: 28px 32px;
              display: flex;
              flex-direction: column;
              gap: 16px;
              border-right: 1px solid #1e293b;
              background: #060910;
              position: relative;
            }
            .webpage-kicker {
              font-family: 'JetBrains Mono', monospace;
              font-size: 10.5px;
              font-weight: 700;
              color: #38bdf8;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .webpage-h1 {
              font-size: 22px;
              font-weight: 900;
              line-height: 1.25;
              color: #ffffff;
              letter-spacing: -0.02em;
            }
            .webpage-lead {
              font-size: 13px;
              color: #94a3b8;
              line-height: 1.55;
            }
            .webpage-card {
              background: #0c1220;
              border: 1px solid #1e293b;
              border-radius: 8px;
              padding: 14px;
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            .webpage-card-title {
              font-size: 13px;
              font-weight: 700;
              color: #e2e8f0;
            }
            .webpage-card-desc {
              font-size: 11.5px;
              color: #64748b;
              line-height: 1.45;
            }

            /* Floating Glass Annotation Cards */
            .floating-annotations {
              position: absolute;
              bottom: 24px;
              left: 24px;
              right: 24px;
              display: flex;
              flex-direction: column;
              gap: 10px;
              z-index: 15;
            }
            .glass-callout {
              background: rgba(15, 23, 42, 0.88);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(20, 184, 166, 0.4);
              border-radius: 10px;
              padding: 12px 14px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6);
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .glass-callout-icon {
              width: 32px;
              height: 32px;
              border-radius: 8px;
              background: rgba(20, 184, 166, 0.15);
              border: 1px solid rgba(20, 184, 166, 0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              shrink: 0;
            }
            .glass-callout-text {
              font-size: 11.5px;
              color: #cbd5e1;
              line-height: 1.4;
            }
            .glass-callout-text strong {
              color: #2dd4bf;
            }

            /* Right: Elevated Extension Popup Window (matches modern 9 tabs + settings) */
            .popup-container {
              flex: 1;
              padding: 16px 20px 20px 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            }
            .popup-window {
              width: 100%;
              max-width: 650px;
              height: 590px;
              background: #090e1a;
              border: 1px solid rgba(51, 65, 85, 0.9);
              border-radius: 14px;
              box-shadow: 
                0 20px 45px -10px rgba(0, 0, 0, 0.85),
                0 0 35px rgba(20, 184, 166, 0.18);
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }

            /* Real Popup Header: Brand + Score + Settings Gear */
            .popup-head {
              height: 54px;
              background: #060a13;
              border-bottom: 1px solid #1e293b;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 16px;
            }
            .popup-brand-wrap {
              display: flex;
              align-items: center;
              gap: 9px;
            }
            .popup-logo-icon {
              width: 26px;
              height: 26px;
            }
            .popup-brand-name {
              font-size: 14px;
              font-weight: 800;
              color: #f8fafc;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .popup-ver-badge {
              font-family: 'JetBrains Mono', monospace;
              font-size: 9.5px;
              font-weight: 700;
              background: rgba(20, 184, 166, 0.15);
              color: #2dd4bf;
              border: 1px solid rgba(20, 184, 166, 0.3);
              padding: 1px 6px;
              border-radius: 4px;
            }
            .popup-right-actions {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .health-score-container {
              display: flex;
              align-items: center;
              gap: 8px;
              background: rgba(16, 185, 129, 0.14);
              border: 1px solid rgba(16, 185, 129, 0.4);
              padding: 4px 10px;
              border-radius: 8px;
            }
            .score-circle-indicator {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #10b981;
              box-shadow: 0 0 8px #10b981;
            }
            .score-number {
              font-family: 'JetBrains Mono', monospace;
              font-size: 13px;
              font-weight: 800;
              color: #34d399;
            }
            .score-label {
              font-size: 10px;
              font-weight: 700;
              color: #10b981;
              text-transform: uppercase;
            }
            .settings-btn-mock {
              width: 32px;
              height: 32px;
              border-radius: 8px;
              background: #0f172a;
              border: 1px solid #1e293b;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #94a3b8;
              font-size: 13px;
            }

            /* 9 Tabs Scrollable Navigation Bar */
            .popup-tab-bar {
              height: 40px;
              background: #080c16;
              border-bottom: 1px solid #1e293b;
              display: flex;
              align-items: center;
              padding: 0 10px;
              gap: 4px;
              overflow-x: auto;
            }
            .popup-tab {
              padding: 5px 9px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              color: #64748b;
              display: flex;
              align-items: center;
              gap: 5px;
              white-space: nowrap;
            }
            .popup-tab.active {
              background: rgba(20, 184, 166, 0.18);
              color: #2dd4bf;
              border: 1px solid rgba(20, 184, 166, 0.4);
              font-weight: 700;
            }
            .tab-badge {
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              font-weight: 700;
              background: rgba(244, 63, 94, 0.2);
              color: #fb7185;
              border: 1px solid rgba(244, 63, 94, 0.4);
              padding: 1px 5px;
              border-radius: 9999px;
            }

            /* Scrollable Body Canvas */
            .popup-content-area {
              flex: 1;
              overflow-y: auto;
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 12px;
              background: #090e1a;
            }

            /* Standardized UI Cards */
            .c-box {
              background: #0f172a;
              border: 1px solid #1e293b;
              border-radius: 10px;
              padding: 12px 14px;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .c-row-between {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .c-tag {
              font-size: 10.5px;
              font-weight: 700;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.04em;
            }
            .c-pill-ok {
              background: rgba(16, 185, 129, 0.15);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.35);
              font-size: 10.5px;
              font-weight: 700;
              padding: 2px 7px;
              border-radius: 5px;
            }
            .c-pill-warn {
              background: rgba(245, 158, 11, 0.15);
              color: #fbbf24;
              border: 1px solid rgba(245, 158, 11, 0.35);
              font-size: 10.5px;
              font-weight: 700;
              padding: 2px 7px;
              border-radius: 5px;
            }
            .c-pill-crit {
              background: rgba(244, 63, 94, 0.15);
              color: #fb7185;
              border: 1px solid rgba(244, 63, 94, 0.35);
              font-size: 10.5px;
              font-weight: 700;
              padding: 2px 7px;
              border-radius: 5px;
            }
            .c-headline {
              font-size: 13px;
              font-weight: 600;
              color: #f1f5f9;
              line-height: 1.4;
            }
            .c-mono-text {
              font-family: 'JetBrains Mono', monospace;
              font-size: 11px;
              color: #cbd5e1;
            }
            .meter-bar {
              height: 6px;
              background: #1e293b;
              border-radius: 3px;
              overflow: hidden;
            }
            .meter-fill-teal {
              height: 100%;
              background: linear-gradient(90deg, #10b981, #2dd4bf);
              border-radius: 3px;
            }
          </style>
        </head>
        <body>
          <div class="bg-glow-teal"></div>
          <div class="bg-glow-emerald"></div>
          <div class="grid-pattern"></div>

          <!-- Top Marketing Banner -->
          <div class="header-banner">
            <div class="brand-left">
              <div class="logo-icon">${logoSvg}</div>
              <div class="brand-title">SEO <span>Inspector</span></div>
              <div class="category-badge">${badgeTitle}</div>
            </div>
            <div class="headline-group">
              <div class="main-headline">${headline}</div>
              <div class="sub-headline">${subheadline}</div>
            </div>
          </div>

          <!-- Elevated Browser Frame -->
          <div class="browser-frame">
            <div class="browser-nav-bar">
              <div class="traffic-dots">
                <div class="traffic-dot dot-red"></div>
                <div class="traffic-dot dot-yellow"></div>
                <div class="traffic-dot dot-green"></div>
              </div>
              <div class="url-bar">
                <span class="url-protocol">https://</span>
                <span class="url-domain">acme.dev</span>
                <span class="url-path">/blog/modern-onpage-technical-seo-guide</span>
              </div>
              <div class="browser-actions">
                <div class="active-extension-pill">
                  <div style="width: 14px; height: 14px;">${logoSvg}</div>
                  <span>SEO Inspector Active</span>
                </div>
              </div>
            </div>

            <!-- Viewport Canvas -->
            <div class="viewport-content">
              <!-- Left Target Page Mock -->
              <div class="webpage-mock">
                <div class="webpage-kicker">Technical SEO Engineering</div>
                <div class="webpage-h1">Modern On-Page Technical SEO: Complete 2026 Diagnostics</div>
                <div class="webpage-lead">
                  A high-velocity benchmark for inspecting DOM depth, heading hierarchy trees, hreflang cluster parity, JSON-LD Schema.org entities, and browser navigation metrics.
                </div>
                <div class="webpage-card">
                  <div class="webpage-card-title">1. Automated Heading & DOM Inspection</div>
                  <div class="webpage-card-desc">
                    Semantic HTML structures guide both assistive technologies and search engine algorithms. Validating single H1 roots and logical sub-heading nesting prevents crawl anomalies.
                  </div>
                </div>

                <div class="floating-annotations">
                  ${floatingCardsHtml}
                </div>
              </div>

              <!-- Right Elevated Popup -->
              <div class="popup-container">
                <div class="popup-window">
                  <div class="popup-head">
                    <div class="popup-brand-wrap">
                      <div class="popup-logo-icon">${logoSvg}</div>
                      <div class="popup-brand-name">
                        SEO Inspector
                        <span class="popup-ver-badge">v1.0</span>
                      </div>
                    </div>
                    <div class="popup-right-actions">
                      <div class="health-score-container">
                        <div class="score-circle-indicator"></div>
                        <span class="score-number">94</span>
                        <span class="score-label">Good</span>
                      </div>
                      <div class="settings-btn-mock" title="Settings & Preferences">⚙️</div>
                    </div>
                  </div>

                  <div class="popup-tab-bar">
                    ${tabNavHtml}
                  </div>

                  <div class="popup-content-area">
                    ${popupBodyHtml}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // ==========================================
  // SCREENSHOT 1: OVERVIEW TAB & HEALTH SCORE
  // ==========================================
  {
    console.log('[capture-seo-screenshots-v2] Capturing Screenshot 1: Overview & Health Score...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

    const floatingCallout = `
      <div class="glass-callout">
        <div class="glass-callout-icon">🎯</div>
        <div class="glass-callout-text">
          <strong>Instant Health Score (94/100):</strong> Programmatic scoring weighted across 100+ critical on-page factors.
        </div>
      </div>
      <div class="glass-callout">
        <div class="glass-callout-icon">⚡</div>
        <div class="glass-callout-text">
          <strong>9 Diagnostic Tabs & Settings:</strong> Complete coverage including Hreflangs, GSC/GA4, and custom preferences.
        </div>
      </div>
    `;

    const bodyHtml = `
      <div class="c-box">
        <div class="c-row-between">
          <span class="c-tag">Page Title</span>
          <span class="c-pill-ok">Optimal (61 chars)</span>
        </div>
        <div class="c-headline">Modern On-Page Technical SEO: Complete 2026 Diagnostics Blueprint</div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div class="meter-bar"><div class="meter-fill-teal" style="width: 87%;"></div></div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748b; font-family: 'JetBrains Mono', monospace;">
            <span>0</span><span>Optimal: 50–60</span><span>Max: 70</span>
          </div>
        </div>
      </div>

      <div class="c-box">
        <div class="c-row-between">
          <span class="c-tag">Meta Description</span>
          <span class="c-pill-ok">Optimal (148 chars)</span>
        </div>
        <div style="font-size: 12px; color: #cbd5e1; line-height: 1.45;">
          A high-velocity benchmark for inspecting DOM depth, heading hierarchy trees, hreflang cluster parity, JSON-LD Schema.org entities, and browser navigation metrics.
        </div>
        <div class="meter-bar"><div class="meter-fill-teal" style="width: 92%;"></div></div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="c-box">
          <div class="c-row-between">
            <span class="c-tag">Canonical URL</span>
            <span class="c-pill-ok">Self-Ref</span>
          </div>
          <div class="c-mono-text" style="font-size: 10px; word-break: break-all;">https://acme.dev/blog/modern-onpage-technical-seo-guide</div>
        </div>
        <div class="c-box">
          <div class="c-row-between">
            <span class="c-tag">Indexation Status</span>
            <span class="c-pill-ok">200 OK</span>
          </div>
          <div class="c-mono-text" style="font-size: 11px; color: #34d399;">index, follow</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
        <div class="c-box" style="padding: 10px; text-align: center;">
          <div style="font-size: 9.5px; color: #94a3b8; font-weight: 700;">OPEN GRAPH</div>
          <div style="font-size: 12px; font-weight: 700; color: #38bdf8; margin-top: 2px;">Configured</div>
        </div>
        <div class="c-box" style="padding: 10px; text-align: center;">
          <div style="font-size: 9.5px; color: #94a3b8; font-weight: 700;">TWITTER CARD</div>
          <div style="font-size: 12px; font-weight: 700; color: #38bdf8; margin-top: 2px;">summary_large</div>
        </div>
        <div class="c-box" style="padding: 10px; text-align: center;">
          <div style="font-size: 9.5px; color: #94a3b8; font-weight: 700;">CHARSET / VIEWPORT</div>
          <div style="font-size: 12px; font-weight: 700; color: #34d399; margin-top: 2px;">UTF-8 • Responsive</div>
        </div>
      </div>
    `;

    const html = buildScreenshotHtml({
      badgeTitle: 'Overview & Metadata',
      headline: 'Instant <span>Health Score (94/100)</span> & Technical Head Audit',
      subheadline: 'Page Title, Meta Description, Canonical URL, Robots Directives & Social Tags',
      activeTabId: 'overview',
      popupBodyHtml: bodyHtml,
      floatingCardsHtml: floatingCallout,
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const out = path.join(outDir, 'screenshot-1-overview.png');
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1280, height: 800 } });
    console.log(`[capture-seo-screenshots-v2] Wrote: ${path.relative(process.cwd(), out)}`);
    await page.close();
  }

  // ==========================================
  // SCREENSHOT 2: CONTENT & HEADING HIERARCHY
  // ==========================================
  {
    console.log('[capture-seo-screenshots-v2] Capturing Screenshot 2: Content Hierarchy...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

    const floatingCallout = `
      <div class="glass-callout">
        <div class="glass-callout-icon">🌳</div>
        <div class="glass-callout-text">
          <strong>Visual DOM Hierarchy Tree:</strong> Color-coded H1-H6 nesting with immediate alerts for skipped levels.
        </div>
      </div>
      <div class="glass-callout">
        <div class="glass-callout-icon">📊</div>
        <div class="glass-callout-text">
          <strong>Keyword & Density Metrics:</strong> Word counts, reading duration, and text-to-HTML ratio calculation.
        </div>
      </div>
    `;

    const bodyHtml = `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
        <div class="c-box" style="padding: 8px; text-align: center;">
          <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">WORDS</div>
          <div style="font-size: 16px; font-weight: 800; color: #2dd4bf;">1,842</div>
        </div>
        <div class="c-box" style="padding: 8px; text-align: center;">
          <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">READ TIME</div>
          <div style="font-size: 16px; font-weight: 800; color: #38bdf8;">7.4 min</div>
        </div>
        <div class="c-box" style="padding: 8px; text-align: center;">
          <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">TEXT / HTML</div>
          <div style="font-size: 16px; font-weight: 800; color: #34d399;">24.8%</div>
        </div>
        <div class="c-box" style="padding: 8px; text-align: center;">
          <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">HEADINGS</div>
          <div style="font-size: 16px; font-weight: 800; color: #a78bfa;">11 Tags</div>
        </div>
      </div>

      <div class="c-box">
        <div class="c-row-between">
          <span class="c-tag">Heading Structure (H1–H6 Tree)</span>
          <span class="c-pill-ok">Valid Hierarchy</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          <div style="display: flex; align-items: center; gap: 8px; background: #070b14; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #2dd4bf;">
            <span style="color: #2dd4bf; font-weight: 700;">H1</span>
            <span style="color: #f8fafc; font-weight: 600;">Modern On-Page Technical SEO: Complete 2026 Diagnostics</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-left: 14px; background: #070b14; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #38bdf8;">
            <span style="color: #38bdf8; font-weight: 700;">H2</span>
            <span style="color: #cbd5e1;">1. Automated Heading & DOM Inspection</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-left: 28px; background: #070b14; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #818cf8;">
            <span style="color: #818cf8; font-weight: 700;">H3</span>
            <span style="color: #94a3b8;">Preventing Empty and Duplicate Headings</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-left: 14px; background: #070b14; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #38bdf8;">
            <span style="color: #38bdf8; font-weight: 700;">H2</span>
            <span style="color: #cbd5e1;">2. Schema.org Entity Graph Alignment</span>
          </div>
        </div>
      </div>

      <div class="c-box">
        <div class="c-row-between">
          <span class="c-tag">Top Keyword Frequency (Density)</span>
          <span style="font-size: 10px; color: #64748b;">Stop words removed</span>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <span style="background: #1e293b; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; color: #f8fafc;">technical seo <strong style="color: #2dd4bf;">(18x • 2.4%)</strong></span>
          <span style="background: #1e293b; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; color: #f8fafc;">diagnostics <strong style="color: #2dd4bf;">(14x • 1.9%)</strong></span>
          <span style="background: #1e293b; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; color: #f8fafc;">headings <strong style="color: #2dd4bf;">(11x • 1.5%)</strong></span>
          <span style="background: #1e293b; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; color: #f8fafc;">schema <strong style="color: #2dd4bf;">(9x • 1.2%)</strong></span>
        </div>
      </div>
    `;

    const html = buildScreenshotHtml({
      badgeTitle: 'Content Architecture',
      headline: 'Visual <span>Heading Hierarchy Tree</span> & Semantic Audit',
      subheadline: 'H1–H6 Depth Validation, Text-to-HTML Ratio, and Keyword Density Extraction',
      activeTabId: 'content',
      popupBodyHtml: bodyHtml,
      floatingCardsHtml: floatingCallout,
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const out = path.join(outDir, 'screenshot-2-content.png');
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1280, height: 800 } });
    console.log(`[capture-seo-screenshots-v2] Wrote: ${path.relative(process.cwd(), out)}`);
    await page.close();
  }

  // ==========================================
  // SCREENSHOT 3: LINKS & HREFLANG VALIDATION
  // ==========================================
  {
    console.log('[capture-seo-screenshots-v2] Capturing Screenshot 3: Links & Hreflang Validation...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

    const floatingCallout = `
      <div class="glass-callout">
        <div class="glass-callout-icon">🔗</div>
        <div class="glass-callout-text">
          <strong>Internal & External Link Distribution:</strong> Track anchor text quality, nofollow tags, and broken targets.
        </div>
      </div>
      <div class="glass-callout">
        <div class="glass-callout-icon">🌐</div>
        <div class="glass-callout-text">
          <strong>International Hreflang Parity:</strong> Validate language tags (en-US, es, de) and x-default self-references.
        </div>
      </div>
    `;

    const bodyHtml = `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
        <div class="c-box" style="padding: 10px; text-align: center;">
          <div style="font-size: 9.5px; color: #94a3b8; font-weight: 700;">TOTAL LINKS</div>
          <div style="font-size: 18px; font-weight: 800; color: #2dd4bf; margin-top: 2px;">68 Links</div>
          <div style="font-size: 9.5px; color: #64748b;">100% Valid Format</div>
        </div>
        <div class="c-box" style="padding: 10px; text-align: center;">
          <div style="font-size: 9.5px; color: #94a3b8; font-weight: 700;">INTERNAL</div>
          <div style="font-size: 18px; font-weight: 800; color: #38bdf8; margin-top: 2px;">54 (79%)</div>
          <div style="font-size: 9.5px; color: #34d399;">Follow: 52 • Nofollow: 2</div>
        </div>
        <div class="c-box" style="padding: 10px; text-align: center;">
          <div style="font-size: 9.5px; color: #94a3b8; font-weight: 700;">EXTERNAL</div>
          <div style="font-size: 18px; font-weight: 800; color: #a78bfa; margin-top: 2px;">14 (21%)</div>
          <div style="font-size: 9.5px; color: #cbd5e1;">Target: _blank • rel="noopener"</div>
        </div>
      </div>

      <div class="c-box">
        <div class="c-row-between">
          <span class="c-tag">International Hreflang Cluster (4 Alternates)</span>
          <span class="c-pill-ok">Cluster Verified</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          <div style="display: flex; align-items: center; justify-content: space-between; background: #070b14; padding: 6px 10px; border-radius: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #2dd4bf; font-weight: 700;">en-US</span>
              <span style="color: #cbd5e1;">https://acme.dev/blog/technical-seo</span>
            </div>
            <span class="c-pill-ok" style="font-size: 9.5px;">Current</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; background: #070b14; padding: 6px 10px; border-radius: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #38bdf8; font-weight: 700;">es-ES</span>
              <span style="color: #94a3b8;">https://acme.dev/es/blog/seo-tecnico</span>
            </div>
            <span class="c-pill-ok" style="font-size: 9.5px;">Valid</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; background: #070b14; padding: 6px 10px; border-radius: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #f59e0b; font-weight: 700;">x-default</span>
              <span style="color: #94a3b8;">https://acme.dev/blog/technical-seo</span>
            </div>
            <span class="c-pill-ok" style="font-size: 9.5px;">Self-Ref</span>
          </div>
        </div>
      </div>

      <div class="c-box">
        <div class="c-row-between">
          <span class="c-tag">Security & Mixed-Content Protocol Audit</span>
          <span class="c-pill-ok">100% HTTPS</span>
        </div>
        <div style="font-size: 11.5px; color: #94a3b8;">
          All 68 links and 18 external media assets resolve cleanly over HTTPS. Zero unencrypted or insecure mixed-content calls detected.
        </div>
      </div>
    `;

    const html = buildScreenshotHtml({
      badgeTitle: 'Links & Hreflangs',
      headline: 'Deep <span>Link Graph Analysis</span> & Multi-Region Hreflangs',
      subheadline: 'Internal/External Ratio, Anchor Relevance, Follow Flags, and Global Localization',
      activeTabId: 'links',
      popupBodyHtml: bodyHtml,
      floatingCardsHtml: floatingCallout,
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const out = path.join(outDir, 'screenshot-3-links-images.png');
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1280, height: 800 } });
    console.log(`[capture-seo-screenshots-v2] Wrote: ${path.relative(process.cwd(), out)}`);
    await page.close();
  }

  // ==========================================
  // SCREENSHOT 4: SCHEMA.ORG & WEB VITALS
  // ==========================================
  {
    console.log('[capture-seo-screenshots-v2] Capturing Screenshot 4: Structured Data & Core Web Vitals...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

    const floatingCallout = `
      <div class="glass-callout">
        <div class="glass-callout-icon">🧬</div>
        <div class="glass-callout-text">
          <strong>JSON-LD Schema.org Validator:</strong> Instant extraction and syntax validation for Google Rich Results eligibility.
        </div>
      </div>
      <div class="glass-callout">
        <div class="glass-callout-icon">⏱️</div>
        <div class="glass-callout-text">
          <strong>Navigation Timing Vitals:</strong> Real-time TTFB, DOM Interactive, DCL, and DOM Node counts.
        </div>
      </div>
    `;

    const bodyHtml = `
      <div class="c-box">
        <div class="c-row-between">
          <span class="c-tag">JSON-LD Structured Data (3 Valid Entities)</span>
          <span class="c-pill-ok">Rich Results Ready</span>
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <span style="background: rgba(34, 211, 238, 0.15); color: #22d3ee; border: 1px solid rgba(34, 211, 238, 0.35); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 5px;">@type: TechArticle</span>
          <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.35); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 5px;">@type: BreadcrumbList</span>
          <span style="background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.35); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 5px;">@type: Organization</span>
        </div>
        <div style="background: #070b13; border: 1px solid #1e293b; border-radius: 6px; padding: 8px 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #a5f3fc; line-height: 1.45;">
          <span style="color: #64748b;">// Validated TechArticle Schema</span><br>
          {<br>
          &nbsp;&nbsp;"@context": "https://schema.org",<br>
          &nbsp;&nbsp;"@type": "TechArticle",<br>
          &nbsp;&nbsp;"headline": "Modern On-Page Technical SEO: Complete 2026 Diagnostics",<br>
          &nbsp;&nbsp;"author": { "@type": "Person", "name": "Technical Staff" }<br>
          }
        </div>
      </div>

      <div class="c-box">
        <div class="c-row-between">
          <span class="c-tag">Browser Navigation Timings & Vitals</span>
          <span class="c-pill-ok">Optimal Velocity</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 2px;">
          <div style="background: #070b14; padding: 8px; border-radius: 6px; border: 1px solid #1e293b; text-align: center;">
            <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">TTFB</div>
            <div style="font-size: 15px; font-weight: 800; color: #34d399;">108 ms</div>
            <div style="font-size: 8.5px; color: #10b981;">Good (&lt;800ms)</div>
          </div>
          <div style="background: #070b14; padding: 8px; border-radius: 6px; border: 1px solid #1e293b; text-align: center;">
            <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">DOM INTERACTIVE</div>
            <div style="font-size: 15px; font-weight: 800; color: #2dd4bf;">340 ms</div>
            <div style="font-size: 8.5px; color: #14b8a6;">Instant</div>
          </div>
          <div style="background: #070b14; padding: 8px; border-radius: 6px; border: 1px solid #1e293b; text-align: center;">
            <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">DCL TIME</div>
            <div style="font-size: 15px; font-weight: 800; color: #38bdf8;">490 ms</div>
            <div style="font-size: 8.5px; color: #0284c7;">Fast</div>
          </div>
          <div style="background: #070b14; padding: 8px; border-radius: 6px; border: 1px solid #1e293b; text-align: center;">
            <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">PAGE LOAD</div>
            <div style="font-size: 15px; font-weight: 800; color: #a78bfa;">820 ms</div>
            <div style="font-size: 8.5px; color: #8b5cf6;">Optimal</div>
          </div>
        </div>
      </div>

      <div class="c-box">
        <div class="c-row-between">
          <span class="c-tag">DOM Element Count & Parsing Budget</span>
          <span class="c-pill-ok">486 Elements</span>
        </div>
        <div class="meter-bar"><div class="meter-fill-teal" style="width: 32%;"></div></div>
        <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
          486 total DOM elements (Threshold: &lt;1,500 elements for optimal browser parsing velocity).
        </div>
      </div>
    `;

    const html = buildScreenshotHtml({
      badgeTitle: 'Schema & Performance',
      headline: 'Structured <span>JSON-LD Schema</span> & Core Web Vitals',
      subheadline: 'Rich Result Validation, Navigation Timings, and DOM Complexity Profiling',
      activeTabId: 'schema',
      popupBodyHtml: bodyHtml,
      floatingCardsHtml: floatingCallout,
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const out = path.join(outDir, 'screenshot-4-schema-speed.png');
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1280, height: 800 } });
    console.log(`[capture-seo-screenshots-v2] Wrote: ${path.relative(process.cwd(), out)}`);
    await page.close();
  }

  // ==========================================
  // SCREENSHOT 5: ISSUES CHECKLIST & EXPORTS
  // ==========================================
  {
    console.log('[capture-seo-screenshots-v2] Capturing Screenshot 5: Issues & White-Label Export...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

    const floatingCallout = `
      <div class="glass-callout">
        <div class="glass-callout-icon">📋</div>
        <div class="glass-callout-text">
          <strong>Prioritized Issue Triage:</strong> Critical errors, warning alerts, and passed compliance checks.
        </div>
      </div>
      <div class="glass-callout">
        <div class="glass-callout-icon">📤</div>
        <div class="glass-callout-text">
          <strong>1-Click White-Label Exports:</strong> Generate complete client-ready Markdown or JSON audit reports.
        </div>
      </div>
    `;

    const bodyHtml = `
      <div style="display: flex; gap: 8px; align-items: center; justify-content: space-between; background: #070b14; padding: 10px 14px; border-radius: 8px; border: 1px solid #1e293b;">
        <div style="display: flex; gap: 12px; font-size: 12px; font-weight: 700;">
          <span style="color: #fb7185;">1 Critical</span>
          <span style="color: #64748b;">•</span>
          <span style="color: #fbbf24;">2 Warnings</span>
          <span style="color: #64748b;">•</span>
          <span style="color: #34d399;">18 Passed</span>
        </div>
        <div style="display: flex; gap: 6px;">
          <button style="background: rgba(20, 184, 166, 0.2); border: 1px solid rgba(20, 184, 166, 0.45); color: #2dd4bf; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
            Export Markdown
          </button>
          <button style="background: rgba(56, 189, 248, 0.2); border: 1px solid rgba(56, 189, 248, 0.45); color: #38bdf8; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
            Export JSON
          </button>
        </div>
      </div>

      <div class="c-box" style="border-left: 3px solid #f43f5e;">
        <div class="c-row-between">
          <span class="c-pill-crit">CRITICAL</span>
          <span style="font-size: 10.5px; color: #64748b; font-family: 'JetBrains Mono', monospace;">Image A11y & SEO</span>
        </div>
        <div style="font-size: 12.5px; font-weight: 700; color: #f8fafc;">
          1 image is missing an alt text attribute
        </div>
        <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
          Add descriptive alternative text to <code>hero-diagram.png</code> to ensure accessibility and Google Images indexing.
        </div>
      </div>

      <div class="c-box" style="border-left: 3px solid #f59e0b;">
        <div class="c-row-between">
          <span class="c-pill-warn">WARNING</span>
          <span style="font-size: 10.5px; color: #64748b; font-family: 'JetBrains Mono', monospace;">Cumulative Layout Shift (CLS)</span>
        </div>
        <div style="font-size: 12.5px; font-weight: 700; color: #f8fafc;">
          1 image lacks explicit width and height dimensions
        </div>
        <div style="font-size: 11px; color: #94a3b8; line-height: 1.4;">
          Missing dimension attributes on image tags trigger layout reflow shifts during page render.
        </div>
      </div>

      <div class="c-box" style="border-left: 3px solid #10b981;">
        <div class="c-row-between">
          <span class="c-pill-ok">PASSED (18 Rules)</span>
          <span style="font-size: 10.5px; color: #34d399; font-weight: 700;">100% Compliant</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: #cbd5e1;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #10b981; font-weight: 800;">✓</span> Single unique H1 tag correctly detected at page root
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #10b981; font-weight: 800;">✓</span> Canonical URL correctly configured with self-referencing target
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #10b981; font-weight: 800;">✓</span> Valid JSON-LD Schema.org structured data syntax verified
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #10b981; font-weight: 800;">✓</span> Zero insecure mixed-content HTTP links detected
          </div>
        </div>
      </div>
    `;

    const html = buildScreenshotHtml({
      badgeTitle: 'Audit & Reporting',
      headline: 'Prioritized <span>Issue Triage</span> & 1-Click Client Export',
      subheadline: 'Actionable Critical/Warning Diagnostics + White-Label Markdown & JSON Deliverables',
      activeTabId: 'issues',
      popupBodyHtml: bodyHtml,
      floatingCardsHtml: floatingCallout,
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const out = path.join(outDir, 'screenshot-5-issues-export.png');
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1280, height: 800 } });
    console.log(`[capture-seo-screenshots-v2] Wrote: ${path.relative(process.cwd(), out)}`);
    await page.close();
  }

  await browser.close();
  console.log('✅ [capture-seo-screenshots-v2] All 5 store screenshots captured successfully!');
}

captureScreenshots().catch((err) => {
  console.error('[capture-seo-screenshots-v2] Error:', err);
  process.exit(1);
});
