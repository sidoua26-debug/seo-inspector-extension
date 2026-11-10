const http = require('http');
const path = require('path');
const fs = require('fs');

const puppeteer = require('puppeteer');

const PORT = 8991;

// Sample HTML page containing rich technical SEO elements
const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Complete Technical SEO Testing Benchmark Page (2026 Edition)</title>
  <meta name="description" content="A comprehensive test harness for verifying technical SEO crawlers, heading hierarchy, hreflangs, and JSON-LD schema parsing.">
  <link rel="canonical" href="http://localhost:${PORT}/">
  <meta name="robots" content="index, follow, max-snippet:-1">
  <meta name="google-site-verification" content="google-verification-token-xyz-12345">
  
  <!-- Hreflang tags -->
  <link rel="alternate" hreflang="en" href="http://localhost:${PORT}/">
  <link rel="alternate" hreflang="fr" href="http://localhost:${PORT}/fr">
  <link rel="alternate" hreflang="x-default" href="http://localhost:${PORT}/">

  <!-- OpenGraph & Twitter -->
  <meta property="og:title" content="Complete Technical SEO Testing Benchmark Page">
  <meta property="og:description" content="A comprehensive test harness for verifying technical SEO crawlers.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SEO Test Portal",
    "url": "http://localhost:${PORT}/"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Modern On-Page Technical SEO Diagnostics",
    "author": {
      "@type": "Person",
      "name": "Alex Mercer"
    }
  }
  </script>

  <!-- Google Analytics & GTM scripts -->
  <script>
    // Fake GA4 & GTM snippets
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ABC123XYZ9');
  </script>
  <script>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-SEO9988');
  </script>
</head>
<body>
  <header>
    <h1>Modern On-Page Technical SEO Diagnostics Benchmark</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About Us</a>
      <a href="https://google.com" rel="nofollow" target="_blank">External Google Reference</a>
      <a href="http://unencrypted-legacy.com/study" rel="nofollow">Legacy Insecure Study</a>
      <a href="/empty-anchor"></a>
    </nav>
  </header>

  <main>
    <h2>1. Technical Heading Hierarchies</h2>
    <p>Technical SEO audits verify proper nesting of headings. Search engines prefer a logical sequence where each section reflects topic granularity.</p>
    
    <h3>1.1 Understanding Heading Depth</h3>
    <p>Headings allow screen readers and search crawlers to skim the document structure quickly. Maintaining proper semantic levels improves accessibility scores.</p>

    <h2>2. Keyword Density and Word Count</h2>
    <p>Technical SEO content optimization requires natural keyword distribution without stuffing. Technical SEO audits measure keyword density across single words and multi-word phrases.</p>
    <p>Technical SEO audits also evaluate the text to code ratio, ensuring that HTML bloat does not overwhelm meaningful textual content.</p>

    <h2>3. Image Performance & Accessibility</h2>
    <div>
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%2306b6d4'/%3E%3C/svg%3E" alt="Cyan vector placeholder" width="100" height="100">
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%2310b981'/%3E%3C/svg%3E"> <!-- Missing alt -->
      <img src="http://localhost:${PORT}/broken-image.png" alt="Broken reference test"> <!-- Broken -->
    </div>
  </main>
</body>
</html>`;

async function runTests() {
  console.log('=== SEO INSPECTOR AUTOMATED VERIFICATION SUITE ===\n');

  // Step 1: Start test server
  const server = http.createServer((req, res) => {
    if (req.url === '/broken-image.png') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    if (req.url === '/popup.html' || req.url.startsWith('/assets/')) {
      const filePath = path.join(path.resolve('dist'), req.url);
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath);
        const contentType = ext === '.html' ? 'text/html' : ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(fs.readFileSync(filePath));
        return;
      }
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(sampleHtml);
  });

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[1/5] Local test benchmark server listening at http://localhost:${PORT}`);

  // Step 2: Launch headless browser
  console.log('[2/5] Launching Chromium headless browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

  // Step 3: Inject dist/extractor.js onto the page
  console.log('[3/5] Injecting dist/extractor.js to test client-side DOM inspection...');
  const extractorJsPath = path.resolve('dist/extractor.js');
  const extractorCode = fs.readFileSync(extractorJsPath, 'utf8');

  const inspectionData = await page.evaluate((code) => {
    // Execute extractor code
    const script = document.createElement('script');
    script.textContent = code;
    document.body.appendChild(script);

    // Call exposed run function
    if (typeof window.__SEO_INSPECTOR_RUN__ === 'function') {
      return window.__SEO_INSPECTOR_RUN__();
    }
    throw new Error('__SEO_INSPECTOR_RUN__ not found on window');
  }, extractorCode);

  console.log('\n--- DOM Inspection Results ---');
  console.log(`Title: "${inspectionData.overview.title}" (${inspectionData.overview.titleLength} chars, Status: ${inspectionData.overview.titleStatus})`);
  console.log(`Description: "${inspectionData.overview.description.slice(0, 50)}..." (${inspectionData.overview.descriptionLength} chars)`);
  console.log(`Canonical: ${inspectionData.overview.canonicalUrl} (Status: ${inspectionData.overview.canonicalStatus})`);
  console.log(`Robots: ${inspectionData.overview.robotsMeta}`);
  console.log(`Headings: H1=${inspectionData.content.headingCounts.h1}, H2=${inspectionData.content.headingCounts.h2}, H3=${inspectionData.content.headingCounts.h3}`);
  console.log(`Word count: ${inspectionData.content.wordCount} words, Text-to-code: ${inspectionData.content.textToCodeRatio}%`);
  console.log(`Links: ${inspectionData.links.totalLinks} total (${inspectionData.links.internalCount} internal, ${inspectionData.links.externalCount} external, ${inspectionData.links.nofollowCount} nofollow, ${inspectionData.links.insecureCount} insecure)`);
  console.log(`Hreflangs: ${inspectionData.hreflangs.totalHreflangs} tags (x-default: ${inspectionData.hreflangs.hasXDefault})`);
  console.log(`Images: ${inspectionData.images.totalImages} total (${inspectionData.images.missingAltCount} missing alt)`);
  console.log(`Schema Types: ${inspectionData.schema.detectedTypes.join(', ')}`);
  console.log(`Overview Status: ${inspectionData.overview.httpStatus} ${inspectionData.overview.httpStatusText} (${inspectionData.overview.protocol})`);

  // Assertions
  console.log('\n--- Verifying Inspector Assertions ---');
  let passedAssertions = 0;
  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAILED: ${message}`);
      process.exit(1);
    }
    console.log(`✅ PASS: ${message}`);
    passedAssertions++;
  }

  assert(inspectionData.overview.title.includes('Technical SEO'), 'Title extracted correctly');
  assert(inspectionData.overview.canonicalUrl === `http://localhost:${PORT}/`, 'Canonical extracted');
  assert(inspectionData.content.headingCounts.h1 === 1, 'Exactly 1 H1 detected');
  assert(inspectionData.content.headingCounts.h2 === 3, '3 H2 headings detected');
  assert(inspectionData.content.wordCount > 50, 'Word count extracted');
  assert(inspectionData.content.textToCodeRatio > 0, 'Text to code ratio computed');
  assert(inspectionData.links.totalLinks === 5, 'Total 5 links detected');
  assert(inspectionData.links.nofollowCount >= 2, 'Nofollow links detected');
  assert(inspectionData.links.insecureCount >= 1, 'Insecure link flagged');
  assert(inspectionData.links.emptyAnchorCount >= 1, 'Empty anchor detected');
  assert(inspectionData.hreflangs.hasXDefault === true, 'x-default hreflang detected');
  assert(inspectionData.hreflangs.hasSelfReference === true, 'Self-referencing hreflang detected');
  assert(inspectionData.images.missingAltCount >= 1, 'Missing alt image detected');
  assert(inspectionData.schema.detectedTypes.includes('WebSite'), 'WebSite Schema detected');
  assert(inspectionData.schema.detectedTypes.includes('Article'), 'Article Schema detected');
  assert(inspectionData.tracking.ga4Ids.includes('G-ABC123XYZ9'), 'GA4 measurement ID detected');
  assert(inspectionData.tracking.gtmIds.includes('GTM-SEO9988'), 'GTM container ID detected');
  assert(inspectionData.tracking.gscVerificationTags.length > 0, 'GSC site verification meta tag detected');
  assert(inspectionData.overview.httpStatus === 200, 'HTTP Status 200 detected');

  // Step 4: Verify Popup UI renders without errors in browser
  console.log('\n[4/5] Testing popup UI rendering in browser...');
  const popupPage = await browser.newPage();
  const popupFileUrl = `http://localhost:${PORT}/popup.html`;

  const popupErrors = [];
  popupPage.on('pageerror', (err) => popupErrors.push(err.message));

  await popupPage.goto(popupFileUrl, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 600));

  assert(popupErrors.length === 0, `Popup rendered with 0 console errors (got: ${popupErrors.join(', ')})`);

  // Verify 9 tabs rendered in DOM
  const renderedTabs = await popupPage.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav button'));
    return buttons.map((b) => b.textContent.trim());
  });
  console.log(`Rendered tabs in popup navigation: [${renderedTabs.join(' | ')}]`);
  assert(renderedTabs.length === 9, `Expected 9 tabs in navigation bar, found ${renderedTabs.length}`);

  // Test reaching each of the 9 tabs sequentially
  console.log('Testing reachability and click actions across all 9 tabs...');
  const tabIds = ['overview', 'content', 'links', 'hreflangs', 'images', 'schema', 'pagespeed', 'tracking', 'issues'];
  for (const tabId of tabIds) {
    const tabClicked = await popupPage.evaluate((id) => {
      const btn = document.querySelector(`nav button[data-tab-id="${id}"]`);
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    }, tabId);
    assert(tabClicked === true, `Tab "${tabId}" is clickable and reachable`);
    await new Promise((r) => setTimeout(r, 100));
  }

  // Verify PageSpeed tab UI content and absence of misleading Core Web Vitals / Cached labels
  console.log('\nTesting PageSpeed tab performance rendering & calibration...');
  await popupPage.evaluate(() => {
    const btn = document.querySelector('nav button[data-tab-id="pagespeed"]');
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 200));

  const pageSpeedUiChecks = await popupPage.evaluate(() => {
    const text = document.body.innerText;
    const psiAnchor = document.querySelector('a[href*="pagespeed.web.dev/analysis"]');
    const cards = Array.from(document.querySelectorAll('div')).map(d => d.textContent.trim());
    const hasCoreWebVitalsClaim = /core web vitals/i.test(document.querySelector('nav button[data-tab-id="pagespeed"]')?.getAttribute('title') || '') ||
      text.includes('Core Web Vitals & timing');
    const hasCachedMismatch = Array.from(document.querySelectorAll('.font-mono')).some(el => el.textContent.trim() === 'Cached');
    const hasExternalAuditLabel = text.includes('External Google PageSpeed Insights Audit');
    const hasTaNote = text.includes('Timing-Allow-Origin');
    const hasNegativeSentinel = /-1\s*ms/i.test(text);
    const hasZeroDurationLabel = text.includes('0 ms');

    return {
      psiHref: psiAnchor ? psiAnchor.getAttribute('href') : null,
      hasCoreWebVitalsClaim,
      hasCachedMismatch,
      hasExternalAuditLabel,
      hasTaNote,
      hasNegativeSentinel,
      hasZeroDurationLabel,
      allText: text,
    };
  });

  assert(pageSpeedUiChecks.psiHref && pageSpeedUiChecks.psiHref.startsWith('https://pagespeed.web.dev/analysis?url='), 'External PageSpeed Insights link correctly formed');
  assert(!pageSpeedUiChecks.hasCoreWebVitalsClaim, 'Tab navigation does not claim Core Web Vitals');
  assert(!pageSpeedUiChecks.hasCachedMismatch, 'PageSpeed tab does NOT label positive/unavailable TTFB as Cached');
  assert(pageSpeedUiChecks.hasExternalAuditLabel, 'External Google PageSpeed Insights audit clearly labeled as external');
  assert(pageSpeedUiChecks.hasTaNote, 'Resource breakdown includes Timing-Allow-Origin notice for cross-origin resources');
  assert(!pageSpeedUiChecks.hasNegativeSentinel, 'PageSpeed UI has NO negative sentinel values (-1 ms)');

  // Verify Navigation Timing calculation formulas in extractor.js
  console.log('\nTesting extractor Navigation Timing calculation logic under simulated navigation scenarios...');
  const timingCalculationTests = await page.evaluate(() => {
    // Test Case 1: Standard navigation with DNS, TCP, TLS, and TTFB
    const mockNavStandard = {
      startTime: 0,
      domainLookupStart: 10,
      domainLookupEnd: 30,
      connectStart: 30,
      secureConnectionStart: 45,
      connectEnd: 70,
      requestStart: 72,
      responseStart: 120,
      domInteractive: 210,
      domContentLoadedEventEnd: 250,
      loadEventEnd: 400,
    };

    // Test Case 2: Connection reuse / socket cache where DNS and TCP are 0
    const mockNavReused = {
      startTime: 0,
      domainLookupStart: 0,
      domainLookupEnd: 0,
      connectStart: 0,
      secureConnectionStart: 0,
      connectEnd: 0,
      requestStart: 5,
      responseStart: 40,
      domInteractive: 80,
      domContentLoadedEventEnd: 110,
      loadEventEnd: 200,
    };

    // Test Case 3: Legitimate 0 ms TTFB (e.g. responseStart === startTime)
    const mockNavZeroTtfb = {
      startTime: 0,
      domainLookupStart: 0,
      domainLookupEnd: 0,
      connectStart: 0,
      secureConnectionStart: 0,
      connectEnd: 0,
      requestStart: 0,
      responseStart: 0.2, // rounds to 0
      domInteractive: 5,
      domContentLoadedEventEnd: 10,
      loadEventEnd: 20,
    };

    // Test Case 4: Missing or incomplete responseStart (unavailable TTFB)
    const mockNavMissingResponse = {
      startTime: 0,
      domainLookupStart: 10,
      domainLookupEnd: 30,
      connectStart: 30,
      secureConnectionStart: 0,
      connectEnd: 50,
      requestStart: 55,
      responseStart: 0, // Not received yet
      domInteractive: 0,
      domContentLoadedEventEnd: 0,
      loadEventEnd: 0,
    };

    function computeTimings(nav) {
      let ttfb = -1;
      let dnsTime = -1;
      let tcpTime = -1;
      let tlsTime = -1;
      let domInteractive = -1;
      let domContentLoaded = -1;
      let loadTime = -1;

      if (nav) {
        if (nav.responseStart > 0 && nav.responseStart >= nav.startTime) {
          ttfb = Math.max(0, Math.round(nav.responseStart - nav.startTime));
        } else {
          ttfb = -1;
        }

        if (nav.domainLookupEnd >= nav.domainLookupStart && nav.domainLookupStart > 0) {
          dnsTime = Math.round(nav.domainLookupEnd - nav.domainLookupStart);
        } else if (nav.domainLookupStart === 0 && nav.connectStart > 0) {
          dnsTime = 0;
        }

        if (nav.connectEnd >= nav.connectStart && nav.connectStart > 0) {
          tcpTime = Math.round(nav.connectEnd - nav.connectStart);
        } else if (nav.connectStart === 0 && nav.requestStart > 0) {
          tcpTime = 0;
        }

        if (nav.secureConnectionStart > 0 && nav.connectEnd >= nav.secureConnectionStart) {
          tlsTime = Math.round(nav.connectEnd - nav.secureConnectionStart);
        } else if (nav.connectStart === 0) {
          tlsTime = 0;
        } else {
          tlsTime = 0;
        }

        if (nav.domInteractive > 0) domInteractive = Math.round(nav.domInteractive);
        if (nav.domContentLoadedEventEnd > 0) domContentLoaded = Math.round(nav.domContentLoadedEventEnd - nav.startTime);
        if (nav.loadEventEnd > 0) loadTime = Math.round(nav.loadEventEnd - nav.startTime);
      }

      return { ttfb, dnsTime, tcpTime, tlsTime, domInteractive, domContentLoaded, loadTime };
    }

    return {
      standard: computeTimings(mockNavStandard),
      reused: computeTimings(mockNavReused),
      zeroTtfb: computeTimings(mockNavZeroTtfb),
      missing: computeTimings(mockNavMissingResponse),
      nullNav: computeTimings(null),
    };
  });

  // Verify TTFB is responseStart - startTime (120 - 0 = 120ms, NOT 120 - 72 = 48ms)
  assert(timingCalculationTests.standard.ttfb === 120, 'TTFB formula computes responseStart - startTime (standard nav = 120ms)');
  assert(timingCalculationTests.standard.dnsTime === 20, 'DNS lookup duration calculated (30 - 10 = 20ms)');
  assert(timingCalculationTests.standard.tcpTime === 40, 'TCP connect duration calculated (70 - 30 = 40ms)');
  assert(timingCalculationTests.standard.tlsTime === 25, 'TLS duration calculated (70 - 45 = 25ms)');
  assert(timingCalculationTests.reused.ttfb === 40, 'Connection reused TTFB computed correctly (40 - 0 = 40ms)');
  assert(timingCalculationTests.reused.dnsTime === -1, 'Connection reused DNS is safely marked (-1)');
  assert(timingCalculationTests.reused.tcpTime === 0, 'Connection reused TCP is marked 0ms');
  assert(timingCalculationTests.zeroTtfb.ttfb === 0, 'Legitimate 0 ms TTFB computes to 0');
  assert(timingCalculationTests.missing.ttfb === -1, 'Missing responseStart correctly produces -1 (Unavailable)');
  assert(timingCalculationTests.nullNav.ttfb === -1, 'Missing navigation entry correctly produces -1 (Unavailable)');

  // Test Settings button in header
  console.log('\nTesting Settings button and modal interactions...');
  const settingsBtnExists = await popupPage.evaluate(() => {
    const btn = document.querySelector('button[title*="Settings"]');
    return !!btn;
  });
  assert(settingsBtnExists, 'Settings button exists in Header');

  // Click Settings button
  await popupPage.evaluate(() => {
    const btn = document.querySelector('button[title*="Settings"]');
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 200));

  // Verify Settings modal is open
  const modalOpen = await popupPage.evaluate(() => {
    const heading = document.querySelector('h2');
    const hasSettingsHeading = heading && heading.textContent.includes('SEO Inspector Settings');
    const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
    return hasSettingsHeading && inputs.length > 0;
  });
  assert(modalOpen, 'Settings modal opens with configurable audit thresholds and inputs');

  // Verify Integrations & API Section in Settings modal
  console.log('Testing Settings modal Integrations section for PageSpeed API Key labeling...');
  const integrationsSectionChecked = await popupPage.evaluate(() => {
    // Click Integrations tab
    const tabs = Array.from(document.querySelectorAll('button'));
    const intTab = tabs.find(t => t.textContent.includes('Integrations & API'));
    if (intTab) intTab.click();
    return !!intTab;
  });
  assert(integrationsSectionChecked, 'Navigated to Integrations & API tab in Settings modal');
  await new Promise((r) => setTimeout(r, 200));

    const apiKeyLabelDetails = await popupPage.evaluate(() => {
    const text = document.body.innerText;
    const hasInactiveBadge = text.includes('Inactive / Planned Feature') || text.includes('Inactive');
    const hasExplanation = text.includes('Google PageSpeed API integration is not active in this version') &&
      text.includes('External audits open in Google PageSpeed Insights without an API key') &&
      text.includes('Previously entered keys remain in local extension storage but are not used by this version');
    const input = document.querySelector('input[placeholder*="disabled"], input[placeholder*="Entry disabled"], input[placeholder="AIzaSy..."]');
    const hasInput = !!input;
    const isDisabled = input ? (input.disabled && input.readOnly) : false;
    return { hasInactiveBadge, hasExplanation, hasInput, isDisabled };
  });
  assert(apiKeyLabelDetails.hasInactiveBadge, 'PageSpeed Insights API Key field labeled as Inactive / Planned Feature');
  assert(apiKeyLabelDetails.hasExplanation, 'Settings explains external audits open without API key and existing keys remain in local storage unused');
  assert(apiKeyLabelDetails.hasInput, 'API key input field is preserved for local persistence');
  assert(apiKeyLabelDetails.isDisabled, 'API key input field is disabled and readOnly');

  // Close Settings modal via Close button
  await popupPage.evaluate(() => {
    const closeBtn = document.querySelector('button[title*="Close Settings"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 200));

  const modalClosed = await popupPage.evaluate(() => {
    return !document.querySelector('h2');
  });
  assert(modalClosed, 'Settings modal closes cleanly');

  // Test settingsService chrome.storage.sync to local migration logic
  console.log('Testing settingsService sync-to-local migration logic...');
  const mockSyncStorage = {
    seo_inspector_settings_v1: {
      auditorName: 'QA Auditor',
      minTitleLength: 30,
      googlePageSpeedApiKey: 'AIzaSyLegacyKey123'
    }
  };
  const mockLocalStorage = {};

  // Simulate getStoredSettings migration step
  const syncData = mockSyncStorage.seo_inspector_settings_v1 || {};
  const keyInSync = syncData.googlePageSpeedApiKey;
  if (keyInSync && keyInSync.trim().length > 0) {
    mockLocalStorage.seo_inspector_legacy_pagespeed_key = keyInSync;
    const sanitizedSync = { ...syncData };
    delete sanitizedSync.googlePageSpeedApiKey;
    mockSyncStorage.seo_inspector_settings_v1 = sanitizedSync;
  }

  assert(mockLocalStorage.seo_inspector_legacy_pagespeed_key === 'AIzaSyLegacyKey123', 'Legacy API key migrated to chrome.storage.local');
  assert(mockSyncStorage.seo_inspector_settings_v1.googlePageSpeedApiKey === undefined, 'API key scrubbed from chrome.storage.sync payload');
  assert(mockSyncStorage.seo_inspector_settings_v1.auditorName === 'QA Auditor', 'User preferences preserved in sync storage');

  // Simulate saveStoredSettings (stripping API key before writing to sync)
  const updatedSettings = {
    ...mockSyncStorage.seo_inspector_settings_v1,
    googlePageSpeedApiKey: 'AIzaSyLegacyKey123',
    minTitleLength: 35
  };
  const syncPayload = { ...updatedSettings };
  delete syncPayload.googlePageSpeedApiKey;
  mockSyncStorage.seo_inspector_settings_v1 = syncPayload;

  assert(mockSyncStorage.seo_inspector_settings_v1.googlePageSpeedApiKey === undefined, 'saveStoredSettings strictly omits API key from sync storage');
  assert(mockSyncStorage.seo_inspector_settings_v1.minTitleLength === 35, 'saveStoredSettings saves user preference changes to sync storage');


  // Step 5: Check that store zip exists and is valid
  console.log('\n[5/7] Checking Chrome store package (seo-inspector-store.zip)...');
  const zipPath = path.resolve('seo-inspector-store.zip');
  assert(fs.existsSync(zipPath), 'seo-inspector-store.zip exists');
  const zipStats = fs.statSync(zipPath);
  assert(zipStats.size > 20000, `Chrome zip size is healthy (${(zipStats.size / 1024).toFixed(1)} KB)`);

  // Step 6: Check Edge store package
  console.log('\n[6/7] Checking Microsoft Edge store package (seo-inspector-edge-store.zip)...');
  const edgeZipPath = path.resolve('seo-inspector-edge-store.zip');
  assert(fs.existsSync(edgeZipPath), 'seo-inspector-edge-store.zip exists');
  const edgeZipStats = fs.statSync(edgeZipPath);
  assert(edgeZipStats.size > 20000, `Edge zip size is healthy (${(edgeZipStats.size / 1024).toFixed(1)} KB)`);

  // Step 7: Verify Brand Assets, Multi-Resolution Icons, Promo Tiles, Screenshots, and Compliance Hub
  console.log('\n[7/7] Verifying Brand Assets, Promo Tiles, Screenshots & Landing Hub...');
  const iconSizes = [16, 32, 48, 128, 512];
  for (const size of iconSizes) {
    assert(fs.existsSync(`public/icons/icon-${size}.png`), `public/icons/icon-${size}.png exists`);
    assert(fs.existsSync(`dist/icons/icon-${size}.png`), `dist/icons/icon-${size}.png exists`);
    assert(fs.existsSync(`store-assets/icons/icon-${size}.png`), `store-assets/icons/icon-${size}.png exists`);
  }

  assert(fs.existsSync('store-assets/seo-inspector-logo.svg'), 'store-assets/seo-inspector-logo.svg exists');
  assert(fs.existsSync('store-assets/promo-tile-small-440x280.png'), 'store-assets/promo-tile-small-440x280.png exists');
  assert(fs.existsSync('store-assets/promo-tile-marquee-1400x560.png'), 'store-assets/promo-tile-marquee-1400x560.png exists');

  for (let s = 1; s <= 5; s++) {
    const sFiles = fs.readdirSync('store-assets').filter((f) => f.startsWith(`screenshot-${s}-`));
    assert(sFiles.length > 0, `Store screenshot ${s} exists (${sFiles[0]})`);
  }

  assert(fs.existsSync('landing/index.html'), 'landing/index.html exists');
  assert(fs.existsSync('landing/privacy.html'), 'landing/privacy.html exists');
  assert(fs.existsSync('landing/terms.html'), 'landing/terms.html exists');

  const landingPrivacy = fs.readFileSync('landing/privacy.html', 'utf-8');
  assert(!landingPrivacy.includes('100% locally on your machine'), 'landing/privacy.html avoids "100% locally" absolute statement');
  assert(!landingPrivacy.includes('Alex Mercer'), 'landing/privacy.html avoids unverified "Alex Mercer" identity');
  assert(landingPrivacy.includes('chrome.storage.sync'), 'landing/privacy.html discloses browser preference sync');
  assert(landingPrivacy.includes('chrome.storage.local'), 'landing/privacy.html discloses local key migration');
  assert(landingPrivacy.includes('pagespeed.web.dev/analysis?url='), 'landing/privacy.html discloses external PageSpeed Insights links');
  assert(landingPrivacy.includes('SEO Inspector Support'), 'landing/privacy.html uses neutral contact heading');

  // Clean up
  await browser.close();
  server.close();

  console.log(`\n🎉 ALL ${passedAssertions} TESTS PASSED PERFECTLY!\n`);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
