# Chrome Web Store Listing: SEO Inspector

## Extension Metadata

- **Name**: SEO Inspector - On-Page Technical Diagnostics
- **Short Name**: SEO Inspector
- **Category**: Developer Tools / Productivity
- **Version**: 1.0.0
- **Language**: English

---

## Short Description (Max 132 characters)

> Instant on-page technical SEO diagnostics: Title, Meta, Headings, Links, Hreflangs, Images, JSON-LD Schema & Web Vitals in one click.

---

## Detailed Description

SEO Inspector is a modern, lightweight developer extension designed for SEO specialists, web developers, content creators, and marketing professionals who need instant, clear, and actionable technical on-page diagnostics.

Unlike bloated tools that require slow third-party API calls, SEO Inspector runs **100% locally and privately in your browser** to parse the current page DOM and Navigation Timings immediately.

### 🌟 9 Comprehensive Diagnostic Tabs

1. **Overview**: Inspect Title and Meta Description character lengths with live status indicators, Canonical URL validation (self-canonical vs mismatch/cross-domain), Meta Robots directives (`index/noindex`, `follow/nofollow`, `max-snippet`), HTTP response status, charset, and OpenGraph/Twitter social cards.
2. **Content**: Complete H1-H6 heading hierarchy visualizer. Identifies skipped heading levels, multiple H1s, and empty headings. Shows clean word count, estimated reading time, text-to-code ratio, and 1-word/2-word/3-word keyword density tables.
3. **Links**: Breakdown of internal vs. external links, nofollow, sponsored, UGC, and follow link ratios. Highlights insecure (HTTP) links on HTTPS sites and empty anchor text. Features a **Copy All Links** action and CSV export.
4. **Hreflangs**: International SEO verification. Inspects `<link rel="alternate" hreflang="...">` tags, checks for `x-default` fallbacks, verifies ISO 639-1 language codes, and confirms self-referencing return tags.
5. **Images**: Immediate visual audit of all images on page. Detects missing alt tags, empty alt attributes, broken images (`naturalWidth === 0`), and missing explicit dimensions (`width`/`height` attributes to prevent Cumulative Layout Shifts). Includes format breakdown badges (WebP, AVIF, SVG, PNG, JPG).
6. **Structured Data**: Extracts and validates all `<script type="application/ld+json">` schemas. Identifies Schema.org entities (Article, Organization, WebSite, Product, Breadcrumbs, etc.) and catches JSON syntax errors. Direct test links to Google's Rich Results Test and Schema.org Validator.
7. **PageSpeed & Web Vitals**: Real browser Navigation Timing metrics: Time to First Byte (TTFB), DNS lookup time, TCP/TLS handshake duration, DOM Content Loaded, and full page load timing. Resource request breakdown by type and transfer size with direct link to Google PageSpeed Insights.
8. **GSC & GA4 Tracking**: Instant detection of Google Analytics 4 (`G-XXXXX`), Universal Analytics (`UA-XXXXX`), Google Tag Manager (`GTM-XXXXX`), Google Search Console site verification meta tags, Meta Pixels, and Bing Webmaster tags. Direct shortcuts to GSC URL Inspection and GA4 console.
9. **Consolidated Issues**: Rule-based automated diagnostic engine aggregating all findings into Critical (Red), Warnings (Amber), and Passed (Green) checks. Each issue includes actionable developer guidance. Export complete audit findings into client-ready Markdown or JSON format.

---

## Single Purpose & Permissions Disclosure

### Single Purpose
The single purpose of SEO Inspector is to analyze and display on-page technical SEO diagnostics, markup structure, and performance timing for the currently active tab.

### Permissions Justification
- `activeTab`: Used solely to access the DOM and performance metrics of the currently active tab when the user clicks the extension popup icon.
- `scripting`: Used to inject the client-side DOM extractor script into the active tab to read headings, links, schemas, and images without external server calls.
- `storage`: Used solely to store local extension preferences (such as preferred default tab or filter choices) locally within the user's browser profile.

---

## Privacy Policy Summary

SEO Inspector does **not** collect, store, transmit, or sell any user data or browsing activity. All DOM inspection and metric calculations take place entirely within the user's local browser instance. No data is sent to external analytics or third-party servers.
