# SEO Inspector - On-Page Technical SEO Chrome Extension

A fast, lightweight, and modern Chrome Extension (Manifest V3) dedicated to on-page technical SEO diagnostics. Built with **React 18**, **Tailwind CSS**, **TypeScript**, and **Lucide Icons**.

Operates **100% client-side** with zero external tracking servers or third-party data collection.

---

## 🚀 Key Features & 9 Diagnostic Tabs

| Tab | Features & Inspected Signals |
|---|---|
| **1. Overview** | Title tag (length, pixel estimate, optimal/short/long status), Meta Description (length & status), Canonical tag verification (self-canonical vs mismatch/cross-domain), Meta Robots directives (`index/noindex`, `follow/nofollow`, `noarchive`, `nosnippet`, Googlebot), HTTP response status code (`200 OK`, `301`, `404`), charset, viewport, OpenGraph & Twitter Cards summary. |
| **2. Content** | Full H1-H6 heading hierarchy tree, single H1 validation, skipped heading level warnings, empty heading detection, clean text word count, reading time estimate, Text-to-HTML code ratio (%), Keyword density analyzer for 1-word, 2-word, and 3-word n-grams with English stopword filtering. |
| **3. Links** | Total links tally, Internal vs External breakdown, Follow vs Nofollow/Sponsored/UGC distribution, insecure HTTP link warnings, empty anchor detection, filterable and searchable links list, and **Copy All Links** action. |
| **4. Hreflangs** | International language targeting verification: `<link rel="alternate" hreflang="...">` tags, HTML `lang` attribute check, `x-default` fallback verification, ISO 639-1 language and country code syntax checks, and self-referencing return tag detection. |
| **5. Images** | Image inventory audit: missing alt attributes, empty alt tags, broken image flags (`naturalWidth === 0`), missing dimension tags (`width`/`height` attribute checks to mitigate CLS), image format badges (WebP, AVIF, SVG, PNG, JPG), and thumbnail previews. |
| **6. Structured Data** | Extracts and parses all `<script type="application/ld+json">` structured data blocks. Handles multiple scripts and `@graph` entities, validates JSON syntax, identifies schema types (Article, WebSite, Organization, Product, BreadcrumbList, etc.), provides collapsible syntax tree, and 1-click test links to Google Rich Results Test & Schema.org. |
| **7. PageSpeed** | Browser Navigation Timing API metrics: Time to First Byte (TTFB), DNS lookup, TCP connect, TLS handshake, DOM Interactive, DOM Content Loaded (DCL), complete Page Load Time, page resource breakdown by type and transfer size (KB), and direct link to run Google PageSpeed Insights. |
| **8. GSC / GA4** | Detects Google Analytics 4 (`G-XXXXX`), Universal Analytics (`UA-XXXXX`), Google Tag Manager (`GTM-XXXXX`), Google Search Console meta verification tags (`google-site-verification`), Meta Pixel, Bing Webmaster, Microsoft Clarity, and Hotjar. Direct shortcuts to GSC URL Inspection and GA4 console. |
| **9. Issues** | Consolidated diagnostics engine evaluating all checks against standard SEO best practices. Groups findings into Critical (Red), Warnings (Amber), and Passed Checks (Green) with actionable developer fix recommendations. One-click **Export Markdown Report** and **Export JSON Audit**. |

---

## 🛠️ Tech Stack & Architecture

- **Manifest**: Chrome Extension Manifest V3
- **Frontend Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS 3 (modern dark slate technical aesthetic)
- **Icons**: Lucide React
- **Bundler**: Vite 6 (configured for multi-entrypoint extension packaging)
- **Permissions**: `activeTab`, `scripting`, `storage` (minimal least-privilege security model)

---

## 📦 Getting Started & Development

### 1. Installation

```bash
cd /home/sid/.gemini/antigravity/scratch/seo-inspector-extension
npm install
```

### 2. Build for Production

```bash
npm run build
```

This compiles TypeScript and bundles the extension into `dist/`:
- `dist/manifest.json`: Manifest V3 configuration
- `dist/popup.html`: Extension popup entry point with relative asset paths
- `dist/background.js`: Background service worker
- `dist/extractor.js`: Standalone client-side DOM & timing inspection script
- `dist/assets/`: Compiled React application bundle and styles
- `dist/icons/`: High-resolution extension icons (16px, 48px, 128px)

### 3. Package for Chrome Web Store

```bash
npm run package
```

Builds the project and creates `seo-inspector-store.zip` ready for upload to the Chrome Web Store Developer Dashboard.

### 4. Run Automated Verification Tests

```bash
npm test
```

Runs headless Chromium browser tests verifying live DOM inspection, heading extraction, keyword density, links, hreflangs, image checks, JSON-LD schema parsing, and popup UI rendering with 0 errors.

---

## 🧩 Loading the Extension in Google Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle on **Developer mode** in the upper right corner.
3. Click **Load unpacked**.
4. Select the `dist/` directory inside this project:
   `/home/sid/.gemini/antigravity/scratch/seo-inspector-extension/dist`
5. Click on the extension icon in your Chrome toolbar on any webpage to inspect its technical SEO signals in real-time.
