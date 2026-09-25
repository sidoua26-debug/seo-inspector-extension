const fs = require('fs');
const path = require('path');

const puppeteerPath = '/home/sid/.gemini/antigravity/scratch/auditpilot/backend/node_modules/puppeteer';
const puppeteer = require(puppeteerPath);

async function captureScreenshots() {
  console.log('[capture-seo-screenshots] Launching browser to capture store screenshots...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'],
  });

  const outDir = path.resolve(__dirname, '../store-assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const logoSvg = fs.readFileSync(path.resolve(__dirname, '../store-assets/seo-inspector-logo.svg'), 'utf8');

  // Helper for generating realistic browser chrome frame + web page background + extension popup
  function buildScreenshotHtml({ title, subtitle, activeTabId, popupBodyHtml }) {
    const tabs = [
      { id: 'overview', label: 'Overview' },
      { id: 'content', label: 'Content' },
      { id: 'links', label: 'Links' },
      { id: 'images', label: 'Images' },
      { id: 'schema', label: 'Structured Data' },
      { id: 'speed', label: 'PageSpeed' },
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
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              width: 1280px;
              height: 800px;
              overflow: hidden;
              background: #04070c;
              font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
              color: #f8fafc;
              display: flex;
              flex-direction: column;
              position: relative;
            }
            /* Ambient background glows */
            .bg-glow-1 {
              position: absolute;
              top: -100px;
              right: 15%;
              width: 600px;
              height: 600px;
              background: radial-gradient(circle, rgba(20, 184, 166, 0.18) 0%, transparent 70%);
              filter: blur(50px);
              pointer-events: none;
            }
            .bg-glow-2 {
              position: absolute;
              bottom: -150px;
              left: 5%;
              width: 700px;
              height: 700px;
              background: radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, transparent 70%);
              filter: blur(60px);
              pointer-events: none;
            }

            /* Top Title Banner */
            .banner-bar {
              height: 52px;
              background: #080d16;
              border-bottom: 1px solid #1e293b;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 28px;
              z-index: 20;
            }
            .banner-left {
              display: flex;
              align-items: center;
              gap: 12px;
            }
            .banner-logo {
              width: 28px;
              height: 28px;
            }
            .banner-title {
              font-size: 15px;
              font-weight: 800;
              letter-spacing: -0.02em;
              color: #ffffff;
            }
            .banner-tag {
              font-size: 11px;
              font-weight: 700;
              background: rgba(20, 184, 166, 0.15);
              color: #2dd4bf;
              border: 1px solid rgba(20, 184, 166, 0.35);
              padding: 2px 8px;
              border-radius: 9999px;
            }
            .banner-right {
              font-size: 13px;
              font-weight: 600;
              color: #94a3b8;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .banner-right span {
              color: #2dd4bf;
              font-weight: 700;
            }

            /* Browser Chrome Frame */
            .browser-frame {
              margin: 14px 24px 20px 24px;
              flex: 1;
              background: #0b111e;
              border: 1px solid #1e293b;
              border-radius: 12px;
              box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.85);
              display: flex;
              flex-direction: column;
              overflow: hidden;
              z-index: 10;
            }
            .browser-nav-bar {
              height: 42px;
              background: #080d18;
              border-bottom: 1px solid #1e293b;
              display: flex;
              align-items: center;
              padding: 0 16px;
              gap: 14px;
            }
            .traffic-lights {
              display: flex;
              gap: 6px;
            }
            .traffic-dot {
              width: 10px;
              height: 10px;
              border-radius: 50%;
            }
            .dot-red { background: #ef4444; }
            .dot-yellow { background: #f59e0b; }
            .dot-green { background: #10b981; }

            .url-bar {
              flex: 1;
              max-width: 680px;
              height: 28px;
              background: #0f172a;
              border: 1px solid #1e293b;
              border-radius: 6px;
              display: flex;
              align-items: center;
              padding: 0 10px;
              gap: 8px;
              font-family: 'JetBrains Mono', monospace;
              font-size: 11.5px;
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
            .extension-badge {
              display: flex;
              align-items: center;
              gap: 6px;
              background: rgba(13, 148, 136, 0.25);
              border: 1px solid rgba(20, 184, 166, 0.5);
              padding: 3px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 700;
              color: #2dd4bf;
            }

            /* Viewport Canvas */
            .viewport-content {
              flex: 1;
              background: #090e1a;
              display: flex;
              position: relative;
              overflow: hidden;
            }

            /* Background Web Page Mockup */
            .webpage-mock {
              width: 48%;
              padding: 32px 36px;
              display: flex;
              flex-direction: column;
              gap: 18px;
              border-right: 1px solid #1e293b;
              background: #080c16;
            }
            .webpage-badge {
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              font-weight: 700;
              color: #38bdf8;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .webpage-h1 {
              font-size: 24px;
              font-weight: 900;
              line-height: 1.25;
              color: #ffffff;
            }
            .webpage-lead {
              font-size: 13.5px;
              color: #94a3b8;
              line-height: 1.6;
            }
            .webpage-article-block {
              background: #0f172a;
              border: 1px solid #1e293b;
              border-radius: 8px;
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .webpage-h2 {
              font-size: 14px;
              font-weight: 700;
              color: #e2e8f0;
            }
            .webpage-p {
              font-size: 12px;
              color: #64748b;
              line-height: 1.5;
            }

            /* Floating Extension Popup Container */
            .popup-wrapper {
              flex: 1;
              padding: 18px 24px 20px 24px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .popup-box {
              width: 100%;
              max-width: 600px;
              height: 590px;
              background: #0b111e;
              border: 1px solid #1e293b;
              border-radius: 14px;
              box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.7), 0 0 25px rgba(20, 184, 166, 0.15);
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }

            /* Popup Header */
            .popup-header {
              height: 52px;
              background: #080d18;
              border-bottom: 1px solid #1e293b;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 16px;
            }
            .popup-header-brand {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .popup-header-brand-title {
              font-size: 13.5px;
              font-weight: 800;
              color: #f8fafc;
            }
            .popup-header-brand-title span {
              color: #2dd4bf;
            }
            .health-score-pill {
              display: flex;
              align-items: center;
              gap: 6px;
              background: rgba(16, 185, 129, 0.15);
              border: 1px solid rgba(16, 185, 129, 0.4);
              padding: 4px 10px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 800;
              color: #34d399;
            }
            .score-circle {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #10b981;
              box-shadow: 0 0 8px #10b981;
            }

            /* Popup Tabs */
            .popup-tabs-nav {
              height: 38px;
              background: #090e1a;
              border-bottom: 1px solid #1e293b;
              display: flex;
              align-items: center;
              padding: 0 8px;
              gap: 4px;
              overflow-x: auto;
            }
            .popup-tab {
              padding: 5px 10px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              color: #64748b;
              display: flex;
              align-items: center;
              gap: 4px;
              cursor: pointer;
              white-space: nowrap;
            }
            .popup-tab.active {
              background: rgba(20, 184, 166, 0.15);
              color: #2dd4bf;
              border: 1px solid rgba(20, 184, 166, 0.35);
              font-weight: 700;
            }
            .tab-badge {
              font-family: 'JetBrains Mono', monospace;
              font-size: 9.5px;
              font-weight: 700;
              background: rgba(244, 63, 94, 0.2);
              color: #fb7185;
              border: 1px solid rgba(244, 63, 94, 0.4);
              padding: 1px 5px;
              border-radius: 9999px;
            }

            /* Popup Body Content */
            .popup-body {
              flex: 1;
              overflow-y: auto;
              padding: 16px;
              display: flex;
              flex-direction: column;
              gap: 12px;
              background: #0b111e;
            }

            /* Common Card Styles */
            .c-card {
              background: #0f172a;
              border: 1px solid #1e293b;
              border-radius: 10px;
              padding: 12px 14px;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .c-card-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .c-label {
              font-size: 11px;
              font-weight: 700;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.04em;
            }
            .c-badge-ok {
              background: rgba(16, 185, 129, 0.15);
              color: #34d399;
              border: 1px solid rgba(16, 185, 129, 0.35);
              font-size: 10.5px;
              font-weight: 700;
              padding: 2px 7px;
              border-radius: 5px;
            }
            .c-badge-warn {
              background: rgba(245, 158, 11, 0.15);
              color: #fbbf24;
              border: 1px solid rgba(245, 158, 11, 0.35);
              font-size: 10.5px;
              font-weight: 700;
              padding: 2px 7px;
              border-radius: 5px;
            }
            .c-badge-crit {
              background: rgba(244, 63, 94, 0.15);
              color: #fb7185;
              border: 1px solid rgba(244, 63, 94, 0.35);
              font-size: 10.5px;
              font-weight: 700;
              padding: 2px 7px;
              border-radius: 5px;
            }
            .c-text-primary {
              font-size: 13px;
              font-weight: 600;
              color: #f1f5f9;
              line-height: 1.4;
            }
            .c-text-mono {
              font-family: 'JetBrains Mono', monospace;
              font-size: 11.5px;
              color: #94a3b8;
              word-break: break-all;
            }

            /* Progress Bar Gauge */
            .gauge-wrap {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }
            .gauge-bar {
              height: 6px;
              background: #1e293b;
              border-radius: 3px;
              overflow: hidden;
            }
            .gauge-fill-ok {
              height: 100%;
              background: linear-gradient(90deg, #10b981, #2dd4bf);
              border-radius: 3px;
            }
            .gauge-fill-warn {
              height: 100%;
              background: linear-gradient(90deg, #f59e0b, #fbbf24);
              border-radius: 3px;
            }
          </style>
        </head>
        <body>
          <div class="bg-glow-1"></div>
          <div class="bg-glow-2"></div>

          <!-- Top Banner -->
          <div class="banner-bar">
            <div class="banner-left">
              <div class="banner-logo">${logoSvg}</div>
              <div class="banner-title">SEO Inspector</div>
              <div class="banner-tag">${title}</div>
            </div>
            <div class="banner-right">
              Feature Showcase: <span>${subtitle}</span>
            </div>
          </div>

          <!-- Browser Chrome Frame -->
          <div class="browser-frame">
            <div class="browser-nav-bar">
              <div class="traffic-lights">
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
                <div class="extension-badge">
                  <div style="width: 14px; height: 14px;">${logoSvg}</div>
                  <span>SEO Inspector Active</span>
                </div>
              </div>
            </div>

            <!-- Web Page Viewport with Floating Extension Popup -->
            <div class="viewport-content">
              <!-- Left: Target Webpage Sample Content -->
              <div class="webpage-mock">
                <div class="webpage-badge">Technical SEO Engineering</div>
                <div class="webpage-h1">Modern On-Page Technical SEO: Complete 2026 Diagnostics</div>
                <div class="webpage-lead">
                  A high-velocity benchmark for inspecting DOM depth, heading hierarchy trees, hreflang cluster parity, JSON-LD Schema.org entities, and browser navigation metrics.
                </div>
                <div class="webpage-article-block">
                  <div class="webpage-h2">1. Automated Heading & DOM Inspection</div>
                  <div class="webpage-p">
                    Semantic HTML structures guide both assistive technologies and search engine algorithms. Validating single H1 roots and logical sub-heading nesting prevents crawl anomalies.
                  </div>
                </div>
                <div class="webpage-article-block">
                  <div class="webpage-h2">2. Schema.org Entity Graph Alignment</div>
                  <div class="webpage-p">
                    Embedding structured TechArticle and BreadcrumbList JSON-LD allows search engines to construct rich interactive knowledge panels and enhanced carousel snippets.
                  </div>
                </div>
              </div>

              <!-- Right: Real-time Extension Popup Box -->
              <div class="popup-wrapper">
                <div class="popup-box">
                  <div class="popup-header">
                    <div class="popup-header-brand">
                      <div style="width: 22px; height: 22px;">${logoSvg}</div>
                      <div class="popup-header-brand-title">SEO <span>Inspector</span></div>
                    </div>
                    <div class="health-score-pill">
                      <div class="score-circle"></div>
                      <span>SEO Health: 92/100</span>
                    </div>
                  </div>

                  <div class="popup-tabs-nav">
                    ${tabNavHtml}
                  </div>

                  <div class="popup-body">
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
  // SCREENSHOT 1: OVERVIEW TAB
  // ==========================================
  {
    console.log('[capture-seo-screenshots] Capturing Screenshot 1: Overview Tab...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

    const bodyHtml = `
      <div class="c-card">
        <div class="c-card-row">
          <span class="c-label">Page Title</span>
          <span class="c-badge-ok">Optimal (61 chars)</span>
        </div>
        <div class="c-text-primary">Modern On-Page Technical SEO: Complete 2026 Diagnostics Blueprint</div>
        <div class="gauge-wrap">
          <div class="gauge-bar"><div class="gauge-fill-ok" style="width: 85%;"></div></div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
            <span>0</span><span>Optimal: 50–60</span><span>Max: 70</span>
          </div>
        </div>
      </div>

      <div class="c-card">
        <div class="c-card-row">
          <span class="c-label">Meta Description</span>
          <span class="c-badge-ok">Optimal (148 chars)</span>
        </div>
        <div class="c-text-primary" style="font-size: 12px; color: #cbd5e1;">
          A high-velocity benchmark for inspecting DOM depth, heading hierarchy trees, hreflang cluster parity, JSON-LD Schema.org entities, and browser navigation metrics.
        </div>
        <div class="gauge-wrap">
          <div class="gauge-bar"><div class="gauge-fill-ok" style="width: 90%;"></div></div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="c-card">
          <div class="c-card-row">
            <span class="c-label">Canonical URL</span>
            <span class="c-badge-ok">Self-Ref</span>
          </div>
          <div class="c-text-mono" style="font-size: 10.5px;">https://acme.dev/blog/modern-onpage-technical-seo-guide</div>
        </div>
        <div class="c-card">
          <div class="c-card-row">
            <span class="c-label">HTTP Status</span>
            <span class="c-badge-ok">200 OK</span>
          </div>
          <div class="c-text-mono" style="font-size: 10.5px; color: #34d399;">Protocol: HTTP/2 (SSL Active)</div>
        </div>
      </div>

      <div class="c-card">
        <div class="c-card-row">
          <span class="c-label">Robots Directives & Indexability</span>
          <span class="c-badge-ok">Indexable</span>
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 10.5px; font-weight: 700; padding: 3px 8px; border-radius: 4px;">index</span>
          <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 10.5px; font-weight: 700; padding: 3px 8px; border-radius: 4px;">follow</span>
          <span style="background: #1e293b; color: #94a3b8; font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 4px;">max-snippet:-1</span>
          <span style="background: #1e293b; color: #94a3b8; font-size: 10.5px; font-weight: 600; padding: 3px 8px; border-radius: 4px;">max-image-preview:large</span>
        </div>
      </div>
    `;

    const html = buildScreenshotHtml({
      title: 'Overview & Metadata Analysis',
      subtitle: 'Title/Meta Gauges, Canonical, Robots & Status',
      activeTabId: 'overview',
      popupBodyHtml: bodyHtml,
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buf = await page.screenshot({ type: 'png' });
    const out = path.join(outDir, 'screenshot-1-overview.png');
    fs.writeFileSync(out, buf);
    console.log(`[capture-seo-screenshots] Wrote: ${path.relative(process.cwd(), out)} (${buf.length} bytes)`);
    await page.close();
  }

  // ==========================================
  // SCREENSHOT 2: CONTENT & HEADING TREE
  // ==========================================
  {
    console.log('[capture-seo-screenshots] Capturing Screenshot 2: Content & Heading Tree...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

    const bodyHtml = `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
        <div class="c-card" style="padding: 8px 10px; text-align: center;">
          <span class="c-label" style="font-size: 9.5px;">Word Count</span>
          <span style="font-size: 16px; font-weight: 800; color: #2dd4bf;">1,842</span>
        </div>
        <div class="c-card" style="padding: 8px 10px; text-align: center;">
          <span class="c-label" style="font-size: 9.5px;">Text/Code</span>
          <span style="font-size: 16px; font-weight: 800; color: #34d399;">24.8%</span>
        </div>
        <div class="c-card" style="padding: 8px 10px; text-align: center;">
          <span class="c-label" style="font-size: 9.5px;">Reading Time</span>
          <span style="font-size: 16px; font-weight: 800; color: #38bdf8;">7.4 min</span>
        </div>
        <div class="c-card" style="padding: 8px 10px; text-align: center;">
          <span class="c-label" style="font-size: 9.5px;">Heading Hierarchy</span>
          <span style="font-size: 16px; font-weight: 800; color: #10b981;">Valid (H1=1)</span>
        </div>
      </div>

      <div class="c-card">
        <div class="c-card-row">
          <span class="c-label">Visual Heading Hierarchy Tree (14 Headings)</span>
          <span class="c-badge-ok">Clean Nesting</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="background: rgba(45, 212, 191, 0.2); color: #2dd4bf; border-left: 3px solid #2dd4bf; padding: 2px 6px; border-radius: 3px; font-weight: 700;">H1</span>
            <span style="color: #f1f5f9; font-weight: 600;">Modern On-Page Technical SEO: Complete 2026 Diagnostics</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-left: 16px;">
            <span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border-left: 3px solid #38bdf8; padding: 2px 6px; border-radius: 3px; font-weight: 700;">H2</span>
            <span style="color: #cbd5e1;">1. Automated Heading & DOM Inspection Fundamentals</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-left: 32px;">
            <span style="background: rgba(148, 163, 184, 0.2); color: #94a3b8; border-left: 3px solid #94a3b8; padding: 2px 6px; border-radius: 3px; font-weight: 700;">H3</span>
            <span style="color: #94a3b8;">DOM Depth & Critical Rendering Path Impact</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-left: 32px;">
            <span style="background: rgba(148, 163, 184, 0.2); color: #94a3b8; border-left: 3px solid #94a3b8; padding: 2px 6px; border-radius: 3px; font-weight: 700;">H3</span>
            <span style="color: #94a3b8;">Semantic Header Tags for Assistive Technology</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-left: 16px;">
            <span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border-left: 3px solid #38bdf8; padding: 2px 6px; border-radius: 3px; font-weight: 700;">H2</span>
            <span style="color: #cbd5e1;">2. Schema.org Entity Graph Alignment</span>
          </div>
        </div>
      </div>

      <div class="c-card">
        <div class="c-card-row">
          <span class="c-label">Top 2-Word Keywords & Density</span>
          <span style="font-size: 10px; color: #64748b;">Total unique phrases: 42</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; font-size: 11px;">
          <div style="background: #090e1a; padding: 6px 8px; border-radius: 5px; border: 1px solid #1e293b; display: flex; justify-content: space-between;">
            <span style="color: #cbd5e1;">technical seo</span><span style="color: #2dd4bf; font-weight: 700;">3.2% (18x)</span>
          </div>
          <div style="background: #090e1a; padding: 6px 8px; border-radius: 5px; border: 1px solid #1e293b; display: flex; justify-content: space-between;">
            <span style="color: #cbd5e1;">dom inspection</span><span style="color: #2dd4bf; font-weight: 700;">2.4% (14x)</span>
          </div>
          <div style="background: #090e1a; padding: 6px 8px; border-radius: 5px; border: 1px solid #1e293b; display: flex; justify-content: space-between;">
            <span style="color: #cbd5e1;">structured data</span><span style="color: #2dd4bf; font-weight: 700;">1.8% (10x)</span>
          </div>
        </div>
      </div>
    `;

    const html = buildScreenshotHtml({
      title: 'Content & Heading Structure',
      subtitle: 'Visualized H1-H6 Hierarchy, Word Count & Density',
      activeTabId: 'content',
      popupBodyHtml: bodyHtml,
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buf = await page.screenshot({ type: 'png' });
    const out = path.join(outDir, 'screenshot-2-content.png');
    fs.writeFileSync(out, buf);
    console.log(`[capture-seo-screenshots] Wrote: ${path.relative(process.cwd(), out)} (${buf.length} bytes)`);
    await page.close();
  }

  // ==========================================
  // SCREENSHOT 3: LINKS & IMAGES
  // ==========================================
  {
    console.log('[capture-seo-screenshots] Capturing Screenshot 3: Links & Images...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

    const bodyHtml = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="c-card">
          <div class="c-card-row">
            <span class="c-label">Links Audit (68 Total)</span>
            <span class="c-badge-ok">0 Broken</span>
          </div>
          <div style="display: flex; gap: 8px; font-size: 11px;">
            <span style="color: #2dd4bf; font-weight: 700;">52 Internal</span>
            <span style="color: #64748b;">•</span>
            <span style="color: #38bdf8; font-weight: 700;">16 External</span>
            <span style="color: #64748b;">•</span>
            <span style="color: #fbbf24; font-weight: 700;">6 Nofollow</span>
          </div>
          <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px;">
            <div style="background: #090e1a; padding: 4px 6px; border-radius: 4px; display: flex; justify-content: space-between;">
              <span style="color: #f1f5f9; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;">/docs/getting-started</span>
              <span style="color: #34d399;">200 OK</span>
            </div>
            <div style="background: #090e1a; padding: 4px 6px; border-radius: 4px; display: flex; justify-content: space-between;">
              <span style="color: #f1f5f9; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;">https://schema.org/TechArticle</span>
              <span style="color: #fbbf24;">rel=nofollow</span>
            </div>
          </div>
        </div>

        <div class="c-card">
          <div class="c-card-row">
            <span class="c-label">Images Audit (18 Total)</span>
            <span class="c-badge-crit">1 Missing Alt</span>
          </div>
          <div style="display: flex; gap: 8px; font-size: 11px;">
            <span style="color: #34d399; font-weight: 700;">17 Alt Present</span>
            <span style="color: #64748b;">•</span>
            <span style="color: #fb7185; font-weight: 700;">1 Missing Alt</span>
          </div>
          <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px;">
            <div style="background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.3); padding: 4px 6px; border-radius: 4px; display: flex; justify-content: space-between;">
              <span style="color: #fb7185;">hero-diagram.png</span>
              <span style="color: #f43f5e; font-weight: 700;">NO ALT</span>
            </div>
            <div style="background: #090e1a; padding: 4px 6px; border-radius: 4px; display: flex; justify-content: space-between;">
              <span style="color: #f1f5f9;">schema-preview.webp</span>
              <span style="color: #34d399;">1200x630</span>
            </div>
          </div>
        </div>
      </div>

      <div class="c-card">
        <div class="c-card-row">
          <span class="c-label">Image Formats & CLS Dimension Health</span>
          <span class="c-badge-warn">1 CLS Warning</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #cbd5e1;">
          <span>Modern Next-Gen WebP/AVIF: <b style="color: #2dd4bf;">14 / 18 (78%)</b></span>
          <span>Explicit Width & Height: <b style="color: #fbbf24;">17 / 18 (1 Warning)</b></span>
        </div>
        <div class="gauge-bar" style="margin-top: 4px;"><div class="gauge-fill-ok" style="width: 88%;"></div></div>
      </div>

      <div class="c-card">
        <div class="c-card-row">
          <span class="c-label">Security Protocol Verification</span>
          <span class="c-badge-ok">100% Secure HTTPS</span>
        </div>
        <div style="font-size: 11.5px; color: #94a3b8;">
          All 68 links and 18 media assets resolve through HTTPS. Zero insecure HTTP or mixed-content assets flagged.
        </div>
      </div>
    `;

    const html = buildScreenshotHtml({
      title: 'Links & Images Diagnostics',
      subtitle: 'Internal/External Links, Missing Alt Tags & CLS Warnings',
      activeTabId: 'links',
      popupBodyHtml: bodyHtml,
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buf = await page.screenshot({ type: 'png' });
    const out = path.join(outDir, 'screenshot-3-links-images.png');
    fs.writeFileSync(out, buf);
    console.log(`[capture-seo-screenshots] Wrote: ${path.relative(process.cwd(), out)} (${buf.length} bytes)`);
    await page.close();
  }

  // ==========================================
  // SCREENSHOT 4: STRUCTURED DATA & SPEED
  // ==========================================
  {
    console.log('[capture-seo-screenshots] Capturing Screenshot 4: Structured Data & Speed...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

    const bodyHtml = `
      <div class="c-card">
        <div class="c-card-row">
          <span class="c-label">JSON-LD Schema.org Entities (3 Valid Schemas)</span>
          <span class="c-badge-ok">Google Rich Result Ready</span>
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

      <div class="c-card">
        <div class="c-card-row">
          <span class="c-label">Core Web Vitals & Navigation Timings</span>
          <span class="c-badge-ok">High Speed</span>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 4px;">
          <div style="background: #090e1a; padding: 8px; border-radius: 6px; border: 1px solid #1e293b; text-align: center;">
            <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">TTFB</div>
            <div style="font-size: 15px; font-weight: 800; color: #34d399;">108 ms</div>
            <div style="font-size: 8.5px; color: #10b981;">Good (&lt;800ms)</div>
          </div>
          <div style="background: #090e1a; padding: 8px; border-radius: 6px; border: 1px solid #1e293b; text-align: center;">
            <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">DOM INTERACTIVE</div>
            <div style="font-size: 15px; font-weight: 800; color: #2dd4bf;">340 ms</div>
            <div style="font-size: 8.5px; color: #14b8a6;">Instant</div>
          </div>
          <div style="background: #090e1a; padding: 8px; border-radius: 6px; border: 1px solid #1e293b; text-align: center;">
            <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">DCL TIME</div>
            <div style="font-size: 15px; font-weight: 800; color: #38bdf8;">490 ms</div>
            <div style="font-size: 8.5px; color: #0284c7;">Optimal</div>
          </div>
          <div style="background: #090e1a; padding: 8px; border-radius: 6px; border: 1px solid #1e293b; text-align: center;">
            <div style="font-size: 9px; color: #94a3b8; font-weight: 700;">PAGE LOAD</div>
            <div style="font-size: 15px; font-weight: 800; color: #a78bfa;">820 ms</div>
            <div style="font-size: 8.5px; color: #8b5cf6;">Fast</div>
          </div>
        </div>
      </div>

      <div class="c-card">
        <div class="c-card-row">
          <span class="c-label">DOM Node Count Budget</span>
          <span class="c-badge-ok">486 Nodes</span>
        </div>
        <div class="gauge-bar"><div class="gauge-fill-ok" style="width: 32%;"></div></div>
        <div style="font-size: 10px; color: #64748b; margin-top: 2px;">
          486 total DOM elements (Threshold: &lt;1,500 elements for optimal parsing velocity).
        </div>
      </div>
    `;

    const html = buildScreenshotHtml({
      title: 'Structured Data & Performance',
      subtitle: 'JSON-LD Schema.org Validator + Navigation Timing Vitals',
      activeTabId: 'schema',
      popupBodyHtml: bodyHtml,
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buf = await page.screenshot({ type: 'png' });
    const out = path.join(outDir, 'screenshot-4-schema-speed.png');
    fs.writeFileSync(out, buf);
    console.log(`[capture-seo-screenshots] Wrote: ${path.relative(process.cwd(), out)} (${buf.length} bytes)`);
    await page.close();
  }

  // ==========================================
  // SCREENSHOT 5: ISSUES CHECKLIST & EXPORT
  // ==========================================
  {
    console.log('[capture-seo-screenshots] Capturing Screenshot 5: Issues Checklist & Export...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

    const bodyHtml = `
      <div style="display: flex; gap: 8px; align-items: center; justify-content: space-between; background: #080d18; padding: 10px 14px; border-radius: 8px; border: 1px solid #1e293b;">
        <div style="display: flex; gap: 12px; font-size: 12px; font-weight: 700;">
          <span style="color: #fb7185;">1 Critical</span>
          <span style="color: #64748b;">•</span>
          <span style="color: #fbbf24;">2 Warnings</span>
          <span style="color: #64748b;">•</span>
          <span style="color: #34d399;">18 Passed</span>
        </div>
        <div style="display: flex; gap: 6px;">
          <button style="background: rgba(20, 184, 166, 0.2); border: 1px solid rgba(20, 184, 166, 0.4); color: #2dd4bf; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;">
            Export MD
          </button>
          <button style="background: rgba(56, 189, 248, 0.2); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;">
            Export JSON
          </button>
        </div>
      </div>

      <div class="c-card" style="border-left: 3px solid #f43f5e;">
        <div class="c-card-row">
          <span class="c-badge-crit">CRITICAL</span>
          <span style="font-size: 10.5px; color: #64748b;">Image SEO & A11y</span>
        </div>
        <div style="font-size: 12.5px; font-weight: 700; color: #f8fafc;">
          1 image is missing an alt text attribute
        </div>
        <div style="font-size: 11px; color: #94a3b8;">
          Add descriptive alternative text to <code>hero-diagram.png</code> to ensure accessibility and search indexing.
        </div>
      </div>

      <div class="c-card" style="border-left: 3px solid #f59e0b;">
        <div class="c-card-row">
          <span class="c-badge-warn">WARNING</span>
          <span style="font-size: 10.5px; color: #64748b;">Cumulative Layout Shift</span>
        </div>
        <div style="font-size: 12.5px; font-weight: 700; color: #f8fafc;">
          1 image lacks explicit width and height dimensions
        </div>
        <div style="font-size: 11px; color: #94a3b8;">
          Missing dimensional attributes on images can trigger layout reflow shifts during rendering.
        </div>
      </div>

      <div class="c-card" style="border-left: 3px solid #10b981;">
        <div class="c-card-row">
          <span class="c-badge-ok">PASSED (18 Rules)</span>
          <span style="font-size: 10.5px; color: #34d399;">100% Compliant</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: #cbd5e1;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #10b981;">✓</span> Single unique H1 tag correctly detected at page root
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #10b981;">✓</span> Canonical URL correctly configured with self-referencing target
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #10b981;">✓</span> Valid JSON-LD Schema.org structured data syntax verified
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="color: #10b981;">✓</span> Zero insecure mixed-content HTTP links detected
          </div>
        </div>
      </div>
    `;

    const html = buildScreenshotHtml({
      title: 'Actionable Issues & 1-Click Export',
      subtitle: 'Critical/Warning Checklist + Markdown & JSON Audit Reports',
      activeTabId: 'issues',
      popupBodyHtml: bodyHtml,
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buf = await page.screenshot({ type: 'png' });
    const out = path.join(outDir, 'screenshot-5-issues-export.png');
    fs.writeFileSync(out, buf);
    console.log(`[capture-seo-screenshots] Wrote: ${path.relative(process.cwd(), out)} (${buf.length} bytes)`);
    await page.close();
  }

  await browser.close();
  console.log('✅ [capture-seo-screenshots] All 5 store screenshots captured successfully!');
}

captureScreenshots().catch((err) => {
  console.error('[capture-seo-screenshots] Error:', err);
  process.exit(1);
});
