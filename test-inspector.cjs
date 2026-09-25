const http = require('http');
const path = require('path');
const fs = require('fs');

// Resolve puppeteer from auditpilot/backend/node_modules
const puppeteerPath = '/home/sid/.gemini/antigravity/scratch/auditpilot/backend/node_modules/puppeteer';
const puppeteer = require(puppeteerPath);

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

  // Clean up
  await browser.close();
  server.close();

  console.log(`\n🎉 ALL ${passedAssertions} TESTS PASSED PERFECTLY!\n`);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
