const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const puppeteerPath = '/home/sid/.gemini/antigravity/scratch/auditpilot/backend/node_modules/puppeteer';
const ffmpegPath = '/home/sid/.gemini/antigravity/scratch/auditpilot/backend/node_modules/ffmpeg-static/ffmpeg';

const puppeteer = require(puppeteerPath);

async function recordWalkthrough() {
  console.log('[record-demo-walkthrough] Starting automated video walkthrough recording (1280x800, 30s)...');
  
  const outDir = path.resolve('store-assets');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const framesDir = '/tmp/seo-demo-frames';
  if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  const mp4Path = path.join(outDir, 'seo-inspector-demo.mp4');
  const webmPath = path.join(outDir, 'seo-inspector-demo.webm');

  const logoSvg = fs.readFileSync(path.resolve('store-assets/seo-inspector-logo.svg'), 'utf8');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--force-color-profile=srgb',
      '--disable-web-security',
      '--font-render-hinting=none',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  const html = `
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
            background: #06090e;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #f8fafc;
            position: relative;
            user-select: none;
          }

          /* Browser Window Chrome */
          .browser-chrome {
            height: 48px;
            background: #080d16;
            border-bottom: 1px solid #1e293b;
            display: flex;
            align-items: center;
            padding: 0 16px;
            gap: 16px;
            position: relative;
            z-index: 50;
          }
          .window-controls { display: flex; gap: 7px; }
          .w-dot { width: 11px; height: 11px; border-radius: 50%; }
          .w-red { background: #ef4444; }
          .w-yellow { background: #f59e0b; }
          .w-green { background: #10b981; }

          .url-bar {
            flex: 1;
            max-width: 720px;
            height: 32px;
            background: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 8px;
            display: flex;
            align-items: center;
            padding: 0 12px;
            gap: 8px;
            font-size: 12px;
            color: #94a3b8;
            font-family: 'JetBrains Mono', monospace;
          }
          .url-bar .secure { color: #10b981; }
          .url-bar .domain { color: #f8fafc; font-weight: 600; }
          .url-bar .path { color: #64748b; }

          .toolbar {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-left: auto;
          }
          .ext-icon-btn {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: #0f172a;
            border: 1px solid #334155;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
          }
          .ext-icon-btn.active {
            background: rgba(20, 184, 166, 0.2);
            border-color: #14b8a6;
            box-shadow: 0 0 16px rgba(20, 184, 166, 0.6);
          }
          .ext-icon-btn svg { width: 20px; height: 20px; }

          /* Underneath Webpage Viewport */
          .viewport {
            height: 752px;
            background: #070b13;
            padding: 48px 64px;
            position: relative;
            overflow: hidden;
          }
          .page-hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid #1e293b;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            color: #38bdf8;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 16px;
          }
          .page-h1 {
            font-size: 38px;
            font-weight: 900;
            line-height: 1.2;
            color: #ffffff;
            margin-bottom: 16px;
            max-width: 680px;
          }
          .page-lead {
            font-size: 15px;
            color: #94a3b8;
            line-height: 1.6;
            max-width: 620px;
            margin-bottom: 28px;
          }
          .page-card {
            background: #0d1424;
            border: 1px solid #1e293b;
            border-radius: 12px;
            padding: 20px 24px;
            max-width: 580px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .page-h2 {
            font-size: 18px;
            font-weight: 700;
            color: #f1f5f9;
          }
          .page-p {
            font-size: 13px;
            color: #64748b;
            line-height: 1.5;
          }

          /* SEO Inspector Popup Modal */
          .popup-container {
            position: absolute;
            top: 56px;
            right: 24px;
            width: 550px;
            height: 670px;
            background: #090e19;
            border: 1px solid #1e293b;
            border-radius: 14px;
            box-shadow: 
              0 25px 60px -15px rgba(0, 0, 0, 0.9),
              0 0 35px rgba(20, 184, 166, 0.25);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 100;
            opacity: 0;
            transform: translateY(-12px) scale(0.98);
            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .popup-container.open {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          /* Popup Header */
          .pop-header {
            height: 54px;
            background: #070c16;
            border-bottom: 1px solid #1e293b;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
          }
          .pop-brand {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .pop-brand-title {
            font-size: 14px;
            font-weight: 800;
            color: #f8fafc;
          }
          .pop-brand-title span { color: #2dd4bf; }
          .pop-score-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid rgba(16, 185, 129, 0.4);
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 800;
            color: #34d399;
          }
          .score-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #10b981;
            box-shadow: 0 0 8px #10b981;
          }

          /* 9 Tabs Navigation Bar */
          .pop-tabs-nav {
            height: 40px;
            background: #080d18;
            border-bottom: 1px solid #1e293b;
            display: flex;
            align-items: center;
            padding: 0 8px;
            gap: 4px;
            overflow-x: hidden;
          }
          .nav-tab {
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            border: 1px solid transparent;
            transition: all 0.2s;
          }
          .nav-tab.active {
            background: rgba(20, 184, 166, 0.2);
            color: #2dd4bf;
            border-color: rgba(20, 184, 166, 0.4);
            font-weight: 700;
          }
          .nav-tab-badge {
            font-family: 'JetBrains Mono', monospace;
            font-size: 9px;
            font-weight: 700;
            background: rgba(244, 63, 94, 0.2);
            color: #fb7185;
            border: 1px solid rgba(244, 63, 94, 0.4);
            padding: 1px 5px;
            border-radius: 9999px;
          }

          /* Scrollable Popup Body */
          .pop-body {
            flex: 1;
            overflow: hidden;
            position: relative;
            background: #090e19;
          }
          .tab-panel {
            position: absolute;
            inset: 0;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
          }
          .tab-panel.active {
            opacity: 1;
            pointer-events: auto;
          }

          /* Cards inside popup */
          .ui-card {
            background: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 10px;
            padding: 12px 14px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .ui-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .ui-label {
            font-size: 11px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }
          .ui-val {
            font-size: 13px;
            font-weight: 600;
            color: #f1f5f9;
          }
          .badge-ok {
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.35);
            font-size: 10.5px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 5px;
          }
          .badge-warn {
            background: rgba(245, 158, 11, 0.15);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.35);
            font-size: 10.5px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 5px;
          }
          .badge-crit {
            background: rgba(244, 63, 94, 0.15);
            color: #fb7185;
            border: 1px solid rgba(244, 63, 94, 0.35);
            font-size: 10.5px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 5px;
          }

          /* Progress Gauges */
          .gauge-bar {
            height: 6px;
            background: #1e293b;
            border-radius: 3px;
            overflow: hidden;
          }
          .gauge-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #2dd4bf);
            border-radius: 3px;
            transition: width 0.4s ease;
          }

          /* Animated Heading Tree */
          .heading-tree-box {
            background: #070b14;
            border: 1px solid #1e293b;
            border-radius: 8px;
            padding: 12px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .ht-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .ht-tag {
            padding: 1px 6px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 10px;
          }
          .ht-h1 { background: rgba(45, 212, 191, 0.2); color: #2dd4bf; border-left: 3px solid #2dd4bf; }
          .ht-h2 { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border-left: 3px solid #38bdf8; }
          .ht-h3 { background: rgba(148, 163, 184, 0.2); color: #94a3b8; border-left: 3px solid #94a3b8; }

          /* Export Toast */
          .export-toast {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: #064e3b;
            border: 1px solid #10b981;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
            color: #ecfdf5;
            padding: 8px 18px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 200;
          }
          .export-toast.visible {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }

          /* Mouse Pointer & Click Wave */
          .mouse-cursor {
            position: absolute;
            width: 20px;
            height: 20px;
            pointer-events: none;
            z-index: 999;
            transform: translate(-2px, -2px);
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8));
          }
          .click-ripple {
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid #2dd4bf;
            background: rgba(45, 212, 191, 0.3);
            pointer-events: none;
            z-index: 998;
            opacity: 0;
            transform: translate(-16px, -16px) scale(0);
            transition: all 0.3s ease-out;
          }

          #contentScroll {
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }
        </style>
      </head>
      <body>
        <div class="browser-chrome">
          <div class="window-controls">
            <div class="w-dot w-red"></div>
            <div class="w-dot w-yellow"></div>
            <div class="w-dot w-green"></div>
          </div>

          <div class="url-bar">
            <span class="secure">https://</span>
            <span class="domain">acme.dev</span>
            <span class="path">/blog/modern-onpage-technical-seo-guide</span>
          </div>

          <div class="toolbar">
            <div id="extBtn" class="ext-icon-btn">
              ${logoSvg}
            </div>
          </div>
        </div>

        <div class="viewport">
          <div class="page-hero-badge">Technical SEO Engineering</div>
          <h1 class="page-h1">Modern On-Page Technical SEO: Complete 2026 Diagnostics</h1>
          <p class="page-lead">
            A high-velocity benchmark for inspecting DOM depth, heading hierarchy trees, hreflang cluster parity, JSON-LD Schema.org entities, and browser navigation metrics.
          </p>
          <div class="page-card">
            <div class="page-h2">1. Automated Heading & DOM Inspection</div>
            <div class="page-p">
              Semantic HTML structures guide both assistive technologies and search engine algorithms. Validating single H1 roots and logical sub-heading nesting prevents crawl anomalies.
            </div>
          </div>
        </div>

        <div id="popupModal" class="popup-container">
          <div class="pop-header">
            <div class="pop-brand">
              <div style="width: 22px; height: 22px;">${logoSvg}</div>
              <div class="pop-brand-title">SEO <span>Inspector</span></div>
            </div>
            <div class="pop-score-badge">
              <div class="score-dot"></div>
              <span id="scoreText">SEO Health: 0/100</span>
            </div>
          </div>

          <div class="pop-tabs-nav">
            <div id="tabOverview" class="nav-tab active">Overview</div>
            <div id="tabContent" class="nav-tab">Content (H1-H6)</div>
            <div id="tabLinks" class="nav-tab">Links</div>
            <div id="tabSchema" class="nav-tab">Schema.org</div>
            <div id="tabIssues" class="nav-tab">Issues <span class="nav-tab-badge">3</span></div>
          </div>

          <div class="pop-body">
            <!-- 1. OVERVIEW TAB -->
            <div id="panelOverview" class="tab-panel active">
              <div class="ui-card">
                <div class="ui-row">
                  <span class="ui-label">Page Title</span>
                  <span class="badge-ok">Optimal (61 chars)</span>
                </div>
                <div class="ui-val">Modern On-Page Technical SEO: Complete 2026 Diagnostics Blueprint</div>
                <div class="gauge-bar"><div id="gaugeTitle" class="gauge-fill" style="width: 0%;"></div></div>
                <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
                  <span>0 chars</span><span>Optimal: 50–60</span><span>Max: 70</span>
                </div>
              </div>

              <div class="ui-card">
                <div class="ui-row">
                  <span class="ui-label">Meta Description</span>
                  <span class="badge-ok">Optimal (148 chars)</span>
                </div>
                <div class="ui-val" style="font-size: 12px; color: #cbd5e1;">
                  A high-velocity benchmark for inspecting DOM depth, heading hierarchy trees, hreflang cluster parity, and JSON-LD schema parsing.
                </div>
                <div class="gauge-bar"><div id="gaugeDesc" class="gauge-fill" style="width: 0%;"></div></div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div class="ui-card">
                  <div class="ui-row">
                    <span class="ui-label">Canonical URL</span>
                    <span class="badge-ok">Self-Ref</span>
                  </div>
                  <div style="font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #94a3b8; word-break: break-all;">
                    https://acme.dev/blog/modern-onpage-technical-seo-guide
                  </div>
                </div>

                <div class="ui-card">
                  <div class="ui-row">
                    <span class="ui-label">HTTP Status</span>
                    <span class="badge-ok">200 OK</span>
                  </div>
                  <div style="font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #34d399;">
                    Protocol: HTTP/2 (SSL Active)
                  </div>
                </div>
              </div>

              <div class="ui-card">
                <div class="ui-row">
                  <span class="ui-label">Robots Directives</span>
                  <span class="badge-ok">Indexable</span>
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">index</span>
                  <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 4px;">follow</span>
                  <span style="background: #1e293b; color: #94a3b8; font-size: 10.5px; font-weight: 600; padding: 2px 7px; border-radius: 4px;">max-snippet:-1</span>
                  <span style="background: #1e293b; color: #94a3b8; font-size: 10.5px; font-weight: 600; padding: 2px 7px; border-radius: 4px;">max-image-preview:large</span>
                </div>
              </div>
            </div>

            <!-- 2. CONTENT TAB -->
            <div id="panelContent" class="tab-panel">
              <div id="contentScroll" style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
                  <div class="ui-card" style="padding: 8px 10px; text-align: center;">
                    <span class="ui-label" style="font-size: 9px;">Word Count</span>
                    <span style="font-size: 16px; font-weight: 800; color: #2dd4bf;">1,842</span>
                  </div>
                  <div class="ui-card" style="padding: 8px 10px; text-align: center;">
                    <span class="ui-label" style="font-size: 9px;">Text/Code</span>
                    <span style="font-size: 16px; font-weight: 800; color: #34d399;">24.8%</span>
                  </div>
                  <div class="ui-card" style="padding: 8px 10px; text-align: center;">
                    <span class="ui-label" style="font-size: 9px;">Reading Time</span>
                    <span style="font-size: 16px; font-weight: 800; color: #38bdf8;">7.4 min</span>
                  </div>
                  <div class="ui-card" style="padding: 8px 10px; text-align: center;">
                    <span class="ui-label" style="font-size: 9px;">Headings</span>
                    <span style="font-size: 16px; font-weight: 800; color: #10b981;">H1=1 (Valid)</span>
                  </div>
                </div>

                <div class="ui-card">
                  <div class="ui-row">
                    <span class="ui-label">Visual Heading Hierarchy Tree (14 Headings)</span>
                    <span class="badge-ok">Clean Nesting</span>
                  </div>
                  <div class="heading-tree-box">
                    <div class="ht-item">
                      <span class="ht-tag ht-h1">H1</span>
                      <span style="color: #f1f5f9; font-weight: 600;">Modern On-Page Technical SEO: Complete 2026 Diagnostics</span>
                    </div>
                    <div class="ht-item" style="margin-left: 14px;">
                      <span class="ht-tag ht-h2">H2</span>
                      <span style="color: #cbd5e1;">1. Automated Heading & DOM Inspection Fundamentals</span>
                    </div>
                    <div class="ht-item" style="margin-left: 28px;">
                      <span class="ht-tag ht-h3">H3</span>
                      <span style="color: #94a3b8;">Critical Rendering Path & Tree Depth</span>
                    </div>
                    <div class="ht-item" style="margin-left: 28px;">
                      <span class="ht-tag ht-h3">H3</span>
                      <span style="color: #94a3b8;">Semantic Header Tags for Assistive Technology</span>
                    </div>
                    <div class="ht-item" style="margin-left: 14px;">
                      <span class="ht-tag ht-h2">H2</span>
                      <span style="color: #cbd5e1;">2. Schema.org Entity Graph Alignment</span>
                    </div>
                    <div class="ht-item" style="margin-left: 14px;">
                      <span class="ht-tag ht-h2">H2</span>
                      <span style="color: #cbd5e1;">3. Core Web Vitals & Resource Budgets</span>
                    </div>
                  </div>
                </div>

                <div class="ui-card">
                  <div class="ui-row">
                    <span class="ui-label">Top 2-Word Keywords & Density</span>
                    <span style="font-size: 10px; color: #64748b;">42 unique phrases</span>
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
              </div>
            </div>

            <!-- 3. LINKS TAB -->
            <div id="panelLinks" class="tab-panel">
              <div class="ui-card">
                <div class="ui-row">
                  <span class="ui-label">Links Audit Overview (68 Total)</span>
                  <span class="badge-ok">0 Broken Links</span>
                </div>
                <div style="display: flex; gap: 10px; font-size: 12px; margin-top: 2px;">
                  <span style="color: #2dd4bf; font-weight: 700;">52 Internal (76.5%)</span>
                  <span style="color: #64748b;">•</span>
                  <span style="color: #38bdf8; font-weight: 700;">16 External (23.5%)</span>
                  <span style="color: #64748b;">•</span>
                  <span style="color: #fbbf24; font-weight: 700;">6 Nofollow</span>
                </div>
              </div>

              <div class="ui-card">
                <div class="ui-row">
                  <span class="ui-label">Detailed Link Records</span>
                  <span style="font-size: 10px; color: #64748b;">Filter: All Links</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px;">
                  <div style="background: #090e1a; padding: 6px 8px; border-radius: 5px; border: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #f1f5f9;">/docs/getting-started</span>
                    <span class="badge-ok">200 Internal</span>
                  </div>
                  <div style="background: #090e1a; padding: 6px 8px; border-radius: 5px; border: 1px solid rgba(245, 158, 11, 0.4); display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #f1f5f9;">https://schema.org/TechArticle</span>
                    <span class="badge-warn">External • rel="nofollow"</span>
                  </div>
                  <div style="background: #090e1a; padding: 6px 8px; border-radius: 5px; border: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #f1f5f9;">/features/dom-diagnostics</span>
                    <span class="badge-ok">200 Internal</span>
                  </div>
                </div>
              </div>

              <div class="ui-card">
                <div class="ui-row">
                  <span class="ui-label">Protocol Security Verification</span>
                  <span class="badge-ok">100% HTTPS</span>
                </div>
                <div style="font-size: 11.5px; color: #94a3b8;">
                  All 68 links resolve via encrypted HTTPS. Zero insecure HTTP or mixed-content assets flagged.
                </div>
              </div>
            </div>

            <!-- 4. SCHEMA TAB -->
            <div id="panelSchema" class="tab-panel">
              <div class="ui-card">
                <div class="ui-row">
                  <span class="ui-label">Structured Data Entities (3 Detected)</span>
                  <span class="badge-ok">Google Rich Result Ready</span>
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <span style="background: rgba(34, 211, 238, 0.15); color: #22d3ee; border: 1px solid rgba(34, 211, 238, 0.35); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 5px;">@type: TechArticle</span>
                  <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.35); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 5px;">@type: BreadcrumbList</span>
                  <span style="background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.35); font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 5px;">@type: Organization</span>
                </div>
              </div>

              <div class="ui-card">
                <div class="ui-row">
                  <span class="ui-label">JSON-LD Syntax Tree & Properties</span>
                  <span style="font-size: 10px; color: #64748b;">Script #1 (application/ld+json)</span>
                </div>
                <div style="background: #070b13; border: 1px solid #1e293b; border-radius: 6px; padding: 10px 12px; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: #a5f3fc; line-height: 1.5;">
                  <span style="color: #64748b;">// Validated Schema.org Model</span><br>
                  {<br>
                  &nbsp;&nbsp;<span style="color: #38bdf8;">"@context"</span>: <span style="color: #34d399;">"https://schema.org"</span>,<br>
                  &nbsp;&nbsp;<span style="color: #38bdf8;">"@type"</span>: <span style="color: #2dd4bf;">"TechArticle"</span>,<br>
                  &nbsp;&nbsp;<span style="color: #38bdf8;">"headline"</span>: <span style="color: #f1f5f9;">"Modern On-Page Technical SEO: Complete 2026 Diagnostics"</span>,<br>
                  &nbsp;&nbsp;<span style="color: #38bdf8;">"author"</span>: { <span style="color: #38bdf8;">"@type"</span>: <span style="color: #2dd4bf;">"Person"</span>, <span style="color: #38bdf8;">"name"</span>: <span style="color: #f1f5f9;">"Alex Mercer"</span> },<br>
                  &nbsp;&nbsp;<span style="color: #38bdf8;">"publisher"</span>: { <span style="color: #38bdf8;">"@type"</span>: <span style="color: #2dd4bf;">"Organization"</span>, <span style="color: #38bdf8;">"name"</span>: <span style="color: #f1f5f9;">"Acme Inc."</span> }<br>
                  }
                </div>
              </div>
            </div>

            <!-- 5. ISSUES TAB -->
            <div id="panelIssues" class="tab-panel">
              <div style="display: flex; gap: 8px; align-items: center; justify-content: space-between; background: #080d18; padding: 10px 14px; border-radius: 8px; border: 1px solid #1e293b;">
                <div style="display: flex; gap: 10px; font-size: 12px; font-weight: 700;">
                  <span style="color: #fb7185;">1 Critical</span>
                  <span style="color: #64748b;">•</span>
                  <span style="color: #fbbf24;">2 Warnings</span>
                  <span style="color: #64748b;">•</span>
                  <span style="color: #34d399;">18 Passed</span>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button id="btnExportMd" style="background: rgba(20, 184, 166, 0.2); border: 1px solid rgba(20, 184, 166, 0.4); color: #2dd4bf; padding: 5px 12px; border-radius: 6px; font-size: 11.5px; font-weight: 700; cursor: pointer; transition: all 0.2s;">
                    Export MD Report
                  </button>
                  <button style="background: rgba(56, 189, 248, 0.2); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; padding: 5px 12px; border-radius: 6px; font-size: 11.5px; font-weight: 700; cursor: pointer;">
                    Export JSON
                  </button>
                </div>
              </div>

              <div class="ui-card" style="border-left: 3px solid #f43f5e;">
                <div class="ui-row">
                  <span class="badge-crit">CRITICAL</span>
                  <span style="font-size: 10.5px; color: #64748b;">Image SEO & A11y</span>
                </div>
                <div style="font-size: 12.5px; font-weight: 700; color: #f8fafc;">
                  1 image is missing an alt text attribute
                </div>
                <div style="font-size: 11px; color: #94a3b8;">
                  Add descriptive alternative text to <code>hero-diagram.png</code> to ensure accessibility and search indexing.
                </div>
              </div>

              <div class="ui-card" style="border-left: 3px solid #f59e0b;">
                <div class="ui-row">
                  <span class="badge-warn">WARNING</span>
                  <span style="font-size: 10.5px; color: #64748b;">Cumulative Layout Shift</span>
                </div>
                <div style="font-size: 12.5px; font-weight: 700; color: #f8fafc;">
                  1 image lacks explicit width and height dimensions
                </div>
                <div style="font-size: 11px; color: #94a3b8;">
                  Missing dimensional attributes on images can trigger layout reflow shifts during rendering.
                </div>
              </div>

              <div class="ui-card" style="border-left: 3px solid #10b981;">
                <div class="ui-row">
                  <span class="badge-ok">PASSED (18 Rules)</span>
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
                </div>
              </div>
            </div>
          </div>

          <div id="exportToast" class="export-toast">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Markdown Audit Report Exported Successfully!</span>
          </div>
        </div>

        <svg id="mouseCursor" class="mouse-cursor" viewBox="0 0 24 24" fill="#ffffff" stroke="#000000" stroke-width="1.5">
          <polygon points="3 3 10 21 13 14 20 11 3 3"></polygon>
        </svg>

        <div id="clickRipple" class="click-ripple"></div>

        <script>
          window.renderFrame = function(frameIndex, totalFrames, fps) {
            const time = frameIndex / fps;

            const cursor = document.getElementById('mouseCursor');
            const ripple = document.getElementById('clickRipple');
            const extBtn = document.getElementById('extBtn');
            const popup = document.getElementById('popupModal');
            const scoreText = document.getElementById('scoreText');
            const gaugeTitle = document.getElementById('gaugeTitle');
            const gaugeDesc = document.getElementById('gaugeDesc');
            const exportToast = document.getElementById('exportToast');
            const btnExport = document.getElementById('btnExportMd');
            const contentScroll = document.getElementById('contentScroll');

            const tabOverview = document.getElementById('tabOverview');
            const tabContent = document.getElementById('tabContent');
            const tabLinks = document.getElementById('tabLinks');
            const tabSchema = document.getElementById('tabSchema');
            const tabIssues = document.getElementById('tabIssues');

            const pOverview = document.getElementById('panelOverview');
            const pContent = document.getElementById('panelContent');
            const pLinks = document.getElementById('panelLinks');
            const pSchema = document.getElementById('panelSchema');
            const pIssues = document.getElementById('panelIssues');

            function setActiveTab(tabEl, panelEl) {
              [tabOverview, tabContent, tabLinks, tabSchema, tabIssues].forEach(t => t.classList.remove('active'));
              [pOverview, pContent, pLinks, pSchema, pIssues].forEach(p => p.classList.remove('active'));
              tabEl.classList.add('active');
              panelEl.classList.add('active');
            }

            let cx = 600;
            let cy = 350;
            let click = false;

            // Phase 1: 0:00 - 0:05 (Launch & UI Open)
            if (time < 2.2) {
              const p = time / 2.2;
              const ease = p * p * (3 - 2 * p);
              cx = 500 + (1240 - 500) * ease;
              cy = 400 + (24 - 400) * ease;
              popup.classList.remove('open');
              extBtn.classList.remove('active');
              setActiveTab(tabOverview, pOverview);
            } else if (time < 2.8) {
              cx = 1240;
              cy = 24;
              click = true;
              extBtn.classList.add('active');
              popup.classList.add('open');
              setActiveTab(tabOverview, pOverview);
            } else if (time < 5.0) {
              extBtn.classList.add('active');
              popup.classList.add('open');
              setActiveTab(tabOverview, pOverview);

              const p = (time - 2.8) / 2.2;
              const currentScore = Math.min(92, Math.round(p * 92));
              scoreText.textContent = 'SEO Health: ' + currentScore + '/100';

              cx = 1240 - (1240 - 950) * p;
              cy = 24 + (180 - 24) * p;
            }

            // Phase 2: 0:05 - 0:10 (Overview & Metadata Gauges)
            else if (time < 10.0) {
              extBtn.classList.add('active');
              popup.classList.add('open');
              scoreText.textContent = 'SEO Health: 92/100';
              setActiveTab(tabOverview, pOverview);

              const p = (time - 5.0) / 5.0;
              gaugeTitle.style.width = Math.min(88, Math.round(p * 88)) + '%';
              gaugeDesc.style.width = Math.min(92, Math.round(p * 92)) + '%';

              if (time < 8.0) {
                cx = 950 + Math.sin((time - 5.0) * 1.5) * 40;
                cy = 220 + Math.cos((time - 5.0) * 1.5) * 20;
              } else {
                const p2 = (time - 8.0) / 2.0;
                cx = 950 + (840 - 950) * p2;
                cy = 220 + (75 - 220) * p2;
              }
            }

            // Phase 3: 0:10 - 0:17 (Content & Headings Tree)
            else if (time < 10.6) {
              extBtn.classList.add('active');
              popup.classList.add('open');
              scoreText.textContent = 'SEO Health: 92/100';
              cx = 840;
              cy = 75;
              click = true;
              setActiveTab(tabContent, pContent);
              contentScroll.style.transform = 'translateY(0px)';
            } else if (time < 17.0) {
              extBtn.classList.add('active');
              popup.classList.add('open');
              setActiveTab(tabContent, pContent);

              const p = (time - 10.6) / 6.4;
              if (time > 12.0) {
                const scrollP = (time - 12.0) / 5.0;
                contentScroll.style.transform = 'translateY(-' + Math.min(90, scrollP * 90) + 'px)';
              }

              if (time < 15.0) {
                cx = 960 + Math.sin(p * 4) * 50;
                cy = 340 + Math.cos(p * 4) * 30;
              } else {
                const p3 = (time - 15.0) / 2.0;
                cx = 960 + (925 - 960) * p3;
                cy = 340 + (75 - 340) * p3;
              }
            }

            // Phase 4: 0:17 - 0:25 (Links & Schema Validation)
            else if (time < 17.6) {
              extBtn.classList.add('active');
              popup.classList.add('open');
              cx = 925;
              cy = 75;
              click = true;
              setActiveTab(tabLinks, pLinks);
            } else if (time < 21.0) {
              extBtn.classList.add('active');
              popup.classList.add('open');
              setActiveTab(tabLinks, pLinks);

              if (time < 19.5) {
                cx = 1000;
                cy = 280;
              } else {
                const p4 = (time - 19.5) / 1.5;
                cx = 1000 + (995 - 1000) * p4;
                cy = 280 + (75 - 280) * p4;
              }
            } else if (time < 21.6) {
              extBtn.classList.add('active');
              popup.classList.add('open');
              cx = 995;
              cy = 75;
              click = true;
              setActiveTab(tabSchema, pSchema);
            } else if (time < 25.0) {
              extBtn.classList.add('active');
              popup.classList.add('open');
              setActiveTab(tabSchema, pSchema);

              if (time < 23.5) {
                cx = 980;
                cy = 320;
              } else {
                const p5 = (time - 23.5) / 1.5;
                cx = 980 + (1075 - 980) * p5;
                cy = 320 + (75 - 320) * p5;
              }
            }

            // Phase 5: 0:25 - 0:30 (Issues Checklist & Export Action)
            else if (time < 25.6) {
              extBtn.classList.add('active');
              popup.classList.add('open');
              cx = 1075;
              cy = 75;
              click = true;
              setActiveTab(tabIssues, pIssues);
            } else if (time < 27.6) {
              extBtn.classList.add('active');
              popup.classList.add('open');
              setActiveTab(tabIssues, pIssues);

              const p = (time - 25.6) / 2.0;
              cx = 1075 + (1140 - 1075) * p;
              cy = 75 + (115 - 75) * p;
            } else if (time < 28.2) {
              extBtn.classList.add('active');
              popup.classList.add('open');
              setActiveTab(tabIssues, pIssues);
              cx = 1140;
              cy = 115;
              click = true;
              btnExport.style.background = 'rgba(20, 184, 166, 0.6)';
              exportToast.classList.add('visible');
            } else {
              extBtn.classList.add('active');
              popup.classList.add('open');
              setActiveTab(tabIssues, pIssues);
              exportToast.classList.add('visible');
              btnExport.style.background = 'rgba(20, 184, 166, 0.2)';
              cx = 1140;
              cy = 160;
            }

            cursor.style.left = cx + 'px';
            cursor.style.top = cy + 'px';

            if (click) {
              ripple.style.left = cx + 'px';
              ripple.style.top = cy + 'px';
              ripple.style.opacity = '1';
              ripple.style.transform = 'translate(-16px, -16px) scale(1.6)';
            } else {
              ripple.style.opacity = '0';
              ripple.style.transform = 'translate(-16px, -16px) scale(0)';
            }
          };
        </script>
      </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const fps = 20;
  const durationSec = 30;
  const totalFrames = fps * durationSec; // 600 frames

  console.log(`[record-demo-walkthrough] Rendering ${totalFrames} frames into ${framesDir}...`);

  for (let frame = 0; frame < totalFrames; frame++) {
    await page.evaluate((f, tf, rate) => {
      window.renderFrame(f, tf, rate);
    }, frame, totalFrames, fps);

    const frameFile = path.join(framesDir, `frame-${String(frame).padStart(4, '0')}.png`);
    await page.screenshot({ path: frameFile, type: 'png' });

    if (frame % 100 === 0 || frame === totalFrames - 1) {
      console.log(`[record-demo-walkthrough] Captured frame ${frame + 1}/${totalFrames} (${Math.round(((frame + 1) / totalFrames) * 100)}%)`);
    }
  }

  await browser.close();
  console.log('[record-demo-walkthrough] All frames captured to disk! Encoding MP4 with FFmpeg...');

  // Encode MP4 from frame files
  const cmdMp4 = `"${ffmpegPath}" -y -framerate ${fps} -i "${path.join(framesDir, 'frame-%04d.png')}" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 20 "${mp4Path}"`;
  execSync(cmdMp4, { stdio: 'inherit' });

  const statsMp4 = fs.statSync(mp4Path);
  console.log(`\n✅ [record-demo-walkthrough] Successfully created MP4: ${path.relative(process.cwd(), mp4Path)}`);
  console.log(`   Size: ${(statsMp4.size / (1024 * 1024)).toFixed(2)} MB`);

  // Transcode WebM
  console.log('[record-demo-walkthrough] Transcoding WebM version...');
  const cmdWebm = `"${ffmpegPath}" -y -i "${mp4Path}" -c:v libvpx-vp9 -b:v 1500k -crf 30 "${webmPath}"`;
  execSync(cmdWebm, { stdio: 'inherit' });

  const statsWebm = fs.statSync(webmPath);
  console.log(`✅ [record-demo-walkthrough] Successfully created WebM: ${path.relative(process.cwd(), webmPath)}`);
  console.log(`   Size: ${(statsWebm.size / (1024 * 1024)).toFixed(2)} MB`);

  // Clean up temporary frames
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log('[record-demo-walkthrough] Cleaned up temporary frame files.');
  console.log('🎉 [record-demo-walkthrough] Video walkthrough complete!');
}

recordWalkthrough().catch((err) => {
  console.error('[record-demo-walkthrough] Fatal error:', err);
  process.exit(1);
});
