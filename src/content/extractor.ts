import type {
  ContentData,
  HeadingItem,
  HreflangItem,
  HreflangsData,
  ImageItem,
  ImagesData,
  KeywordDensityItem,
  LinkItem,
  LinksData,
  OverviewData,
  PageSpeedData,
  SchemaBlock,
  StructuredDataInfo,
  TrackingData,
  RawSeoExtractedData,
} from '../types/seo';

// Common English stopwords for keyword density filtering
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t',
  'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each',
  'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here',
  'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s',
  'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these',
  'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up',
  'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when',
  'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Extracts comprehensive Overview data (meta, canonical, robots, status)
 */
function extractOverview(): OverviewData {
  const url = window.location.href;
  const domain = window.location.hostname;
  const protocol = window.location.protocol.replace(':', '');

  // HTTP Status from Navigation Timing
  let httpStatus = 200;
  let httpStatusText = 'OK';
  let navProtocol = protocol;

  try {
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navEntries && navEntries.length > 0) {
      const nav = navEntries[0];
      if (nav.responseStatus && nav.responseStatus > 0) {
        httpStatus = nav.responseStatus;
        if (httpStatus >= 200 && httpStatus < 300) httpStatusText = 'OK';
        else if (httpStatus === 301 || httpStatus === 302 || httpStatus === 307 || httpStatus === 308) httpStatusText = 'Redirect';
        else if (httpStatus === 404) httpStatusText = 'Not Found';
        else if (httpStatus >= 400 && httpStatus < 500) httpStatusText = 'Client Error';
        else if (httpStatus >= 500) httpStatusText = 'Server Error';
      }
      if (nav.nextHopProtocol) {
        navProtocol = nav.nextHopProtocol;
      }
    }
  } catch (e) {
    // fallback
  }

  // Title
  const title = (document.title || '').replace(/\s+/g, ' ').trim();
  const titleLength = title.length;
  let titleStatus: OverviewData['titleStatus'] = 'optimal';
  if (titleLength === 0) titleStatus = 'missing';
  else if (titleLength < 30) titleStatus = 'too-short';
  else if (titleLength > 65) titleStatus = 'too-long';

  // Description
  const metaDescEl = document.querySelector('meta[name="description" i]') ||
                     document.querySelector('meta[property="og:description" i]');
  const description = metaDescEl ? (metaDescEl.getAttribute('content') || '').replace(/\s+/g, ' ').trim() : '';
  const descriptionLength = description.length;
  let descriptionStatus: OverviewData['descriptionStatus'] = 'optimal';
  if (descriptionLength === 0) descriptionStatus = 'missing';
  else if (descriptionLength < 70) descriptionStatus = 'too-short';
  else if (descriptionLength > 165) descriptionStatus = 'too-long';

  // Canonical
  const canonicalEl = document.querySelector('link[rel="canonical" i]');
  const canonicalUrl = canonicalEl ? (canonicalEl.getAttribute('href') || '').trim() : '';
  let canonicalStatus: OverviewData['canonicalStatus'] = 'self';

  if (!canonicalUrl) {
    canonicalStatus = 'missing';
  } else if (!canonicalUrl.startsWith('http://') && !canonicalUrl.startsWith('https://')) {
    canonicalStatus = 'relative';
  } else {
    try {
      const parsedCanonical = new URL(canonicalUrl, window.location.href);
      const parsedCurrent = new URL(window.location.href);
      if (parsedCanonical.hostname !== parsedCurrent.hostname) {
        canonicalStatus = 'cross-domain';
      } else if (parsedCanonical.pathname.replace(/\/$/, '') === parsedCurrent.pathname.replace(/\/$/, '')) {
        canonicalStatus = 'self';
      } else {
        canonicalStatus = 'mismatch';
      }
    } catch {
      canonicalStatus = 'mismatch';
    }
  }

  // Robots
  const robotsMetaEl = document.querySelector('meta[name="robots" i]');
  const robotsMeta = robotsMetaEl ? (robotsMetaEl.getAttribute('content') || '').toLowerCase().trim() : '';

  const googlebotEl = document.querySelector('meta[name="googlebot" i]');
  const googlebotMeta = googlebotEl ? (googlebotEl.getAttribute('content') || '').toLowerCase().trim() : undefined;

  const robotsDirectives = {
    noindex: robotsMeta.includes('noindex'),
    nofollow: robotsMeta.includes('nofollow'),
    noarchive: robotsMeta.includes('noarchive'),
    nosnippet: robotsMeta.includes('nosnippet'),
    noimageindex: robotsMeta.includes('noimageindex'),
    maxSnippet: robotsMeta.match(/max-snippet:(-?\d+)/)?.[1],
  };

  // Charset
  const charsetEl = document.querySelector('meta[charset]') || document.querySelector('meta[http-equiv="Content-Type" i]');
  const charset = charsetEl?.getAttribute('charset') || document.characterSet || 'UTF-8';

  // Viewport
  const viewportEl = document.querySelector('meta[name="viewport" i]');
  const viewport = viewportEl ? (viewportEl.getAttribute('content') || '').trim() : '';

  // Favicon
  const faviconEl = document.querySelector('link[rel~="icon" i]');
  const favicon = faviconEl ? (faviconEl.getAttribute('href') || '') : undefined;

  // Open Graph
  const ogTitle = document.querySelector('meta[property="og:title" i]')?.getAttribute('content') || undefined;
  const ogDesc = document.querySelector('meta[property="og:description" i]')?.getAttribute('content') || undefined;
  const ogImage = document.querySelector('meta[property="og:image" i]')?.getAttribute('content') || undefined;
  const ogType = document.querySelector('meta[property="og:type" i]')?.getAttribute('content') || undefined;
  const ogUrl = document.querySelector('meta[property="og:url" i]')?.getAttribute('content') || undefined;
  const ogSiteName = document.querySelector('meta[property="og:site_name" i]')?.getAttribute('content') || undefined;

  // Twitter Card
  const twitterCard = document.querySelector('meta[name="twitter:card" i]')?.getAttribute('content') ||
                      document.querySelector('meta[property="twitter:card" i]')?.getAttribute('content') || undefined;
  const twitterTitle = document.querySelector('meta[name="twitter:title" i]')?.getAttribute('content') ||
                       document.querySelector('meta[property="twitter:title" i]')?.getAttribute('content') || undefined;
  const twitterDesc = document.querySelector('meta[name="twitter:description" i]')?.getAttribute('content') ||
                      document.querySelector('meta[property="twitter:description" i]')?.getAttribute('content') || undefined;
  const twitterImage = document.querySelector('meta[name="twitter:image" i]')?.getAttribute('content') ||
                       document.querySelector('meta[property="twitter:image" i]')?.getAttribute('content') || undefined;

  return {
    url,
    domain,
    protocol: navProtocol,
    httpStatus,
    httpStatusText,
    title,
    titleLength,
    titleStatus,
    description,
    descriptionLength,
    descriptionStatus,
    canonicalUrl,
    canonicalStatus,
    robotsMeta: robotsMeta || 'index, follow (default)',
    robotsDirectives,
    googlebotMeta,
    charset,
    viewport,
    favicon,
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      image: ogImage,
      type: ogType,
      url: ogUrl,
      siteName: ogSiteName,
    },
    twitterCard: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDesc,
      image: twitterImage,
    },
  };
}

/**
 * Extracts Content data (H1-H6 tree, word count, text-to-code ratio, keyword density)
 */
function extractContent(): ContentData {
  const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const headings: HeadingItem[] = [];
  const headingCounts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };

  headingElements.forEach((el, index) => {
    const tagName = el.tagName.toUpperCase() as 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';
    const level = parseInt(tagName.charAt(1), 10);
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    
    if (tagName === 'H1') headingCounts.h1++;
    else if (tagName === 'H2') headingCounts.h2++;
    else if (tagName === 'H3') headingCounts.h3++;
    else if (tagName === 'H4') headingCounts.h4++;
    else if (tagName === 'H5') headingCounts.h5++;
    else if (tagName === 'H6') headingCounts.h6++;

    headings.push({
      id: el.id || `h-${index}`,
      level,
      tag: tagName,
      text: text || '[Empty Heading]',
      charCount: text.length,
    });
  });

  const headingIssues: ContentData['headingIssues'] = [];
  if (headingCounts.h1 === 0) {
    headingIssues.push({
      type: 'missing_h1',
      message: 'Page is missing a top-level <h1> heading tag.',
    });
  } else if (headingCounts.h1 > 1) {
    headingIssues.push({
      type: 'multiple_h1',
      message: `Found ${headingCounts.h1} <h1> headings. Best practice is to have exactly 1 <h1> per page.`,
    });
  }

  let prevLevel = 0;
  for (const h of headings) {
    if (prevLevel > 0 && h.level > prevLevel + 1) {
      headingIssues.push({
        type: 'skipped_level',
        message: `Skipped heading level: <h${prevLevel}> followed directly by <h${h.level}> ("${h.text.slice(0, 40)}...").`,
      });
      break;
    }
    prevLevel = h.level;
  }

  const emptyHeadings = headings.filter(h => h.text === '[Empty Heading]' || h.charCount === 0);
  if (emptyHeadings.length > 0) {
    headingIssues.push({
      type: 'empty_heading',
      message: `Found ${emptyHeadings.length} heading tag(s) with no text content.`,
    });
  }

  const clone = document.body ? (document.body.cloneNode(true) as HTMLElement) : null;
  let cleanText = '';
  if (clone) {
    const nonContent = clone.querySelectorAll('script, style, noscript, template, svg, canvas, iframe, [aria-hidden="true"]');
    nonContent.forEach(node => node.remove());
    cleanText = (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim();
  }

  const rawHtml = document.documentElement ? document.documentElement.outerHTML : '';
  const htmlByteLength = new Blob([rawHtml]).size || rawHtml.length;
  const textByteLength = new Blob([cleanText]).size || cleanText.length;
  const textToCodeRatio = htmlByteLength > 0 ? Number(((textByteLength / htmlByteLength) * 100).toFixed(2)) : 0;

  const words = cleanText.toLowerCase().match(/\b[a-z0-9]{2,}\b/g) || [];
  const wordCount = words.length;
  const charCount = cleanText.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const singleFreq = new Map<string, number>();
  const twoFreq = new Map<string, number>();
  const threeFreq = new Map<string, number>();

  for (let i = 0; i < words.length; i++) {
    const w1 = words[i];
    if (!STOP_WORDS.has(w1) && isNaN(Number(w1)) && w1.length > 2) {
      singleFreq.set(w1, (singleFreq.get(w1) || 0) + 1);
    }

    if (i < words.length - 1) {
      const w2 = words[i + 1];
      if ((!STOP_WORDS.has(w1) || !STOP_WORDS.has(w2)) && w1.length > 2 && w2.length > 2) {
        const bigram = `${w1} ${w2}`;
        twoFreq.set(bigram, (twoFreq.get(bigram) || 0) + 1);
      }
    }

    if (i < words.length - 2) {
      const w2 = words[i + 1];
      const w3 = words[i + 2];
      if ((!STOP_WORDS.has(w1) || !STOP_WORDS.has(w3)) && w1.length > 2 && w3.length > 2) {
        const trigram = `${w1} ${w2} ${w3}`;
        threeFreq.set(trigram, (threeFreq.get(trigram) || 0) + 1);
      }
    }
  }

  const mapToTopKeywords = (map: Map<string, number>, limit: number): KeywordDensityItem[] => {
    return Array.from(map.entries())
      .filter(([_, count]) => count > 1 || wordCount < 50)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([keyword, count]) => ({
        keyword,
        count,
        density: Number(((count / (wordCount || 1)) * 100).toFixed(2)),
      }));
  };

  return {
    headings,
    headingCounts,
    headingIssues,
    wordCount,
    charCount,
    textByteLength,
    htmlByteLength,
    textToCodeRatio,
    readingTimeMinutes,
    topSingleWords: mapToTopKeywords(singleFreq, 10),
    topTwoWords: mapToTopKeywords(twoFreq, 8),
    topThreeWords: mapToTopKeywords(threeFreq, 5),
  };
}

/**
 * Extracts Links data (Internal vs external count, nofollow, target, secure/insecure)
 */
function extractLinks(): LinksData {
  const anchorEls = Array.from(document.querySelectorAll('a[href]'));
  const currentOrigin = window.location.origin;
  const currentHostname = window.location.hostname;
  const isCurrentHttps = window.location.protocol === 'https:';

  let internalCount = 0;
  let externalCount = 0;
  let nofollowCount = 0;
  let dofollowCount = 0;
  let sponsoredCount = 0;
  let ugcCount = 0;
  let secureCount = 0;
  let insecureCount = 0;
  let emptyAnchorCount = 0;

  const links: LinkItem[] = [];

  anchorEls.forEach((el) => {
    const rawHref = el.getAttribute('href') || '';
    let resolvedHref = rawHref;
    let isInternal = true;
    let isExternal = false;
    let isSecure = true;

    try {
      const parsed = new URL(rawHref, window.location.href);
      resolvedHref = parsed.href;
      isInternal = parsed.hostname === currentHostname || parsed.origin === currentOrigin;
      isExternal = !isInternal && !rawHref.startsWith('#') && !rawHref.startsWith('javascript:');
      isSecure = parsed.protocol === 'https:' || rawHref.startsWith('#');
    } catch {
      isInternal = true;
      isExternal = false;
    }

    const rel = (el.getAttribute('rel') || '').toLowerCase();
    const isNofollow = rel.includes('nofollow');
    const isSponsored = rel.includes('sponsored');
    const isUgc = rel.includes('ugc');
    const target = el.getAttribute('target') || '';
    const isBlankWithoutNoopener = target === '_blank' && !rel.includes('noopener') && !rel.includes('noreferrer');

    let text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) {
      const img = el.querySelector('img[alt]');
      if (img) {
        text = `[IMG: ${img.getAttribute('alt') || 'No Alt'}]`;
      }
    }
    const hasAnchorText = text.length > 0;
    const isHash = rawHref.startsWith('#');

    if (isExternal) externalCount++;
    else internalCount++;

    if (isNofollow) nofollowCount++;
    else dofollowCount++;

    if (isSponsored) sponsoredCount++;
    if (isUgc) ugcCount++;

    if (!isSecure && !isHash && !rawHref.startsWith('mailto:') && !rawHref.startsWith('tel:')) {
      insecureCount++;
    } else {
      secureCount++;
    }

    if (!hasAnchorText && !isHash) emptyAnchorCount++;

    if (links.length < 300) {
      links.push({
        href: resolvedHref,
        rawHref,
        text: text || '[Empty Anchor]',
        isInternal,
        isExternal,
        rel,
        isNofollow,
        isSponsored,
        isUgc,
        target,
        isBlankWithoutNoopener,
        isSecure,
        hasAnchorText,
        isHash,
      });
    }
  });

  return {
    totalLinks: anchorEls.length,
    internalCount,
    externalCount,
    nofollowCount,
    dofollowCount,
    sponsoredCount,
    ugcCount,
    secureCount,
    insecureCount,
    emptyAnchorCount,
    links,
  };
}

/**
 * Extracts Hreflangs data (link alternates, x-default, html lang)
 */
function extractHreflangs(): HreflangsData {
  const htmlLang = (document.documentElement.getAttribute('lang') || '').trim();
  const hreflangEls = Array.from(document.querySelectorAll('link[rel="alternate" i][hreflang]'));
  const currentUrl = window.location.href.split('#')[0];

  let hasXDefault = false;
  let hasSelfReference = false;
  const items: HreflangItem[] = [];
  const issues: HreflangsData['issues'] = [];

  const langRegex = /^[a-zA-Z]{2,3}(-[a-zA-Z]{2,4})?$/;

  hreflangEls.forEach((el) => {
    const lang = (el.getAttribute('hreflang') || '').trim();
    const href = (el.getAttribute('href') || '').trim();
    const isXDefault = lang.toLowerCase() === 'x-default';
    if (isXDefault) hasXDefault = true;

    let resolvedHref = href;
    try {
      resolvedHref = new URL(href, window.location.href).href.split('#')[0];
    } catch {}

    const isSelf = resolvedHref.replace(/\/$/, '') === currentUrl.replace(/\/$/, '');
    if (isSelf) hasSelfReference = true;

    const isValidLang = isXDefault || langRegex.test(lang);

    items.push({
      lang,
      href: resolvedHref,
      isValidLang,
      isSelf,
      isXDefault,
    });
  });

  if (hreflangEls.length > 0) {
    if (!hasXDefault) {
      issues.push({
        type: 'missing_x_default',
        message: 'Hreflang implementation is missing a fallback "x-default" tag.',
      });
    }
    if (!hasSelfReference) {
      issues.push({
        type: 'missing_self_reference',
        message: 'Hreflang tags do not include a self-referencing return tag for the current page.',
      });
    }
  }

  if (!htmlLang) {
    issues.push({
      type: 'missing_html_lang',
      message: 'The <html> tag is missing a "lang" attribute (e.g. <html lang="en">).',
    });
  }

  return {
    htmlLang,
    totalHreflangs: items.length,
    hasXDefault,
    hasSelfReference,
    items,
    issues,
  };
}

/**
 * Extracts Images data (missing alt, broken, dimensional checks)
 */
function extractImages(): ImagesData {
  const imgEls = Array.from(document.querySelectorAll('img'));
  let missingAltCount = 0;
  let emptyAltCount = 0;
  let brokenCount = 0;
  let missingDimensionsCount = 0;
  const formatCounts: Record<string, number> = {};

  const items: ImageItem[] = [];

  imgEls.forEach((img) => {
    const src = img.src || img.getAttribute('src') || '';
    const currentSrc = img.currentSrc || src;
    const hasAlt = img.hasAttribute('alt');
    const alt = img.getAttribute('alt') || '';
    const isAltEmpty = hasAlt && alt.trim() === '';

    if (!hasAlt) missingAltCount++;
    else if (isAltEmpty) emptyAltCount++;

    const naturalWidth = img.naturalWidth || 0;
    const naturalHeight = img.naturalHeight || 0;
    const renderedWidth = img.clientWidth || img.width || 0;
    const renderedHeight = img.clientHeight || img.height || 0;

    const hasWidthAttr = img.hasAttribute('width');
    const hasHeightAttr = img.hasAttribute('height');
    const missingDimensions = !hasWidthAttr && !hasHeightAttr;
    if (missingDimensions) missingDimensionsCount++;

    const isBroken = (img.complete && naturalWidth === 0 && src.length > 0) || !src;
    if (isBroken) brokenCount++;

    let format = 'unknown';
    const lowerSrc = (src || '').toLowerCase();
    if (lowerSrc.includes('.webp') || lowerSrc.includes('image/webp')) format = 'webp';
    else if (lowerSrc.includes('.avif') || lowerSrc.includes('image/avif')) format = 'avif';
    else if (lowerSrc.includes('.svg') || lowerSrc.includes('image/svg')) format = 'svg';
    else if (lowerSrc.includes('.png') || lowerSrc.includes('image/png')) format = 'png';
    else if (lowerSrc.includes('.jpg') || lowerSrc.includes('.jpeg') || lowerSrc.includes('image/jpeg')) format = 'jpg';
    else if (lowerSrc.includes('.gif') || lowerSrc.includes('image/gif')) format = 'gif';
    else if (lowerSrc.startsWith('data:image')) format = 'inline';

    formatCounts[format] = (formatCounts[format] || 0) + 1;

    const loading = img.getAttribute('loading') || 'eager';

    if (items.length < 200) {
      items.push({
        src,
        currentSrc,
        alt,
        hasAlt,
        isAltEmpty,
        naturalWidth,
        naturalHeight,
        renderedWidth,
        renderedHeight,
        missingDimensions,
        isBroken,
        format,
        loading,
      });
    }
  });

  return {
    totalImages: imgEls.length,
    missingAltCount,
    emptyAltCount,
    brokenCount,
    missingDimensionsCount,
    formatCounts,
    items,
  };
}

/**
 * Extracts Structured Data (JSON-LD schema verification)
 */
function extractSchema(): StructuredDataInfo {
  const ldScriptEls = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  const rawBlocks: SchemaBlock[] = [];
  const detectedTypesSet = new Set<string>();
  const validationIssues: StructuredDataInfo['validationIssues'] = [];

  function collectTypes(obj: any) {
    if (!obj || typeof obj !== 'object') return;
    if (obj['@type']) {
      if (Array.isArray(obj['@type'])) {
        obj['@type'].forEach((t: string) => detectedTypesSet.add(t));
      } else if (typeof obj['@type'] === 'string') {
        detectedTypesSet.add(obj['@type']);
      }
    }
    if (Array.isArray(obj['@graph'])) {
      obj['@graph'].forEach((item: any) => collectTypes(item));
    }
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        collectTypes(obj[key]);
      }
    }
  }

  ldScriptEls.forEach((el, index) => {
    const rawJson = (el.textContent || '').trim();
    if (!rawJson) return;

    try {
      const parsed = JSON.parse(rawJson);
      const types: string[] = [];

      if (parsed['@type']) {
        if (Array.isArray(parsed['@type'])) types.push(...parsed['@type']);
        else types.push(parsed['@type']);
      }
      if (Array.isArray(parsed['@graph'])) {
        parsed['@graph'].forEach((item: any) => {
          if (item?.['@type']) types.push(item['@type']);
        });
      }

      collectTypes(parsed);

      if (!parsed['@context'] && (!Array.isArray(parsed['@graph']) || !parsed['@context'])) {
        validationIssues.push({
          schemaType: types.join(', ') || 'Unknown',
          issue: 'Missing mandatory "@context": "https://schema.org" property.',
          severity: 'critical',
        });
      }

      rawBlocks.push({
        index: index + 1,
        types: types.length > 0 ? Array.from(new Set(types)) : ['Object'],
        rawJson,
        parsed,
        isValid: true,
      });
    } catch (err: any) {
      validationIssues.push({
        schemaType: 'Syntax Error',
        issue: `JSON parsing error in schema block #${index + 1}: ${err.message}`,
        severity: 'critical',
      });
      rawBlocks.push({
        index: index + 1,
        types: ['Invalid JSON'],
        rawJson,
        parsed: null,
        isValid: false,
        errorMessage: err.message,
      });
    }
  });

  const microdataCount = document.querySelectorAll('[itemscope]').length;

  return {
    totalSchemas: rawBlocks.length,
    rawBlocks,
    detectedTypes: Array.from(detectedTypesSet),
    validationIssues,
    microdataCount,
  };
}

/**
 * Extracts Navigation & Resource Timing for PageSpeed tab
 */
function extractPageSpeed(): PageSpeedData {
  let ttfb = 0;
  let dnsTime = 0;
  let tcpTime = 0;
  let tlsTime = 0;
  let domInteractive = 0;
  let domContentLoaded = 0;
  let loadTime = 0;

  try {
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navEntries && navEntries.length > 0) {
      const nav = navEntries[0];
      ttfb = Math.round(nav.responseStart - nav.requestStart);
      dnsTime = Math.round(nav.domainLookupEnd - nav.domainLookupStart);
      tcpTime = Math.round(nav.connectEnd - nav.connectStart);
      tlsTime = nav.secureConnectionStart > 0 ? Math.round(nav.connectEnd - nav.secureConnectionStart) : 0;
      domInteractive = Math.round(nav.domInteractive);
      domContentLoaded = Math.round(nav.domContentLoadedEventEnd - nav.startTime);
      loadTime = Math.round(nav.loadEventEnd - nav.startTime);
    }
  } catch (e) {}

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  let totalTransferBytes = 0;
  const breakdownMap: Record<string, { count: number; size: number }> = {
    script: { count: 0, size: 0 },
    css: { count: 0, size: 0 },
    img: { count: 0, size: 0 },
    font: { count: 0, size: 0 },
    fetch: { count: 0, size: 0 },
    other: { count: 0, size: 0 },
  };

  resources.forEach((res) => {
    const size = res.transferSize || res.encodedBodySize || 0;
    totalTransferBytes += size;
    const type = res.initiatorType || 'other';

    if (type === 'script') {
      breakdownMap.script.count++;
      breakdownMap.script.size += size;
    } else if (type === 'css' || type === 'link') {
      breakdownMap.css.count++;
      breakdownMap.css.size += size;
    } else if (type === 'img' || type === 'image') {
      breakdownMap.img.count++;
      breakdownMap.img.size += size;
    } else if (type === 'font') {
      breakdownMap.font.count++;
      breakdownMap.font.size += size;
    } else if (type === 'xmlhttprequest' || type === 'fetch') {
      breakdownMap.fetch.count++;
      breakdownMap.fetch.size += size;
    } else {
      breakdownMap.other.count++;
      breakdownMap.other.size += size;
    }
  });

  const resourceBreakdown = Object.entries(breakdownMap).map(([type, data]) => ({
    type: type.toUpperCase(),
    count: data.count,
    sizeKb: Number((data.size / 1024).toFixed(1)),
  }));

  return {
    ttfb: Math.max(0, ttfb),
    dnsTime: Math.max(0, dnsTime),
    tcpTime: Math.max(0, tcpTime),
    tlsTime: Math.max(0, tlsTime),
    domInteractive: Math.max(0, domInteractive),
    domContentLoaded: Math.max(0, domContentLoaded),
    loadTime: Math.max(0, loadTime),
    totalResources: resources.length,
    totalTransferSizeKb: Number((totalTransferBytes / 1024).toFixed(1)),
    resourceBreakdown,
    coreWebVitals: {},
  };
}

/**
 * Extracts GSC, GA4, GTM and other marketing tracker tags
 */
function extractTracking(): TrackingData {
  const ga4Ids = new Set<string>();
  const uaIds = new Set<string>();
  const gtmIds = new Set<string>();
  const gscVerificationTags: string[] = [];
  let bingVerification: string | undefined;
  const metaPixelIds = new Set<string>();
  const otherTrackers = new Set<string>();

  const gscMeta = document.querySelectorAll('meta[name="google-site-verification" i]');
  gscMeta.forEach((m) => {
    const content = m.getAttribute('content');
    if (content) gscVerificationTags.push(content);
  });

  const bingMeta = document.querySelector('meta[name="msvalidate.01" i]');
  if (bingMeta) {
    bingVerification = bingMeta.getAttribute('content') || undefined;
  }

  const scripts = Array.from(document.querySelectorAll('script'));
  const scriptContentAndSrc = scripts.map((s) => (s.src || '') + ' ' + (s.textContent || '')).join('\n');

  const ga4Matches = scriptContentAndSrc.match(/\b(G-[A-Z0-9]{4,12})\b/g);
  if (ga4Matches) ga4Matches.forEach((id) => ga4Ids.add(id));

  const uaMatches = scriptContentAndSrc.match(/\b(UA-\d+-\d+)\b/g);
  if (uaMatches) uaMatches.forEach((id) => uaIds.add(id));

  const gtmMatches = scriptContentAndSrc.match(/\b(GTM-[A-Z0-9]{4,10})\b/g);
  if (gtmMatches) gtmMatches.forEach((id) => gtmIds.add(id));

  const pixelMatches = scriptContentAndSrc.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/g);
  if (pixelMatches) {
    pixelMatches.forEach((m) => {
      const idMatch = m.match(/\d+/);
      if (idMatch) metaPixelIds.add(idMatch[0]);
    });
  }

  if (scriptContentAndSrc.includes('clarity.ms') || (window as any).clarity) {
    otherTrackers.add('Microsoft Clarity');
  }
  if (scriptContentAndSrc.includes('hotjar.com') || (window as any).hj) {
    otherTrackers.add('Hotjar');
  }
  if (scriptContentAndSrc.includes('snap.licdn.com') || scriptContentAndSrc.includes('linkedin.com/insight')) {
    otherTrackers.add('LinkedIn Insight Tag');
  }

  return {
    ga4Ids: Array.from(ga4Ids),
    uaIds: Array.from(uaIds),
    gtmIds: Array.from(gtmIds),
    gscVerificationTags,
    bingVerification,
    metaPixelIds: Array.from(metaPixelIds),
    otherTrackers: Array.from(otherTrackers),
  };
}

/**
 * Main Inspector function running on page (100% self-contained)
 */
export function inspectPage(): RawSeoExtractedData {
  const overview = extractOverview();
  const content = extractContent();
  const links = extractLinks();
  const hreflangs = extractHreflangs();
  const images = extractImages();
  const schema = extractSchema();
  const pagespeed = extractPageSpeed();
  const tracking = extractTracking();

  return {
    timestamp: new Date().toISOString(),
    overview,
    content,
    links,
    hreflangs,
    images,
    schema,
    pagespeed,
    tracking,
  };
}

// In Chrome extension execution context, respond to runtime messages or window events
if (typeof window !== 'undefined') {
  // Listen for message from popup
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      if (request.action === 'RUN_INSPECTION') {
        try {
          const data = inspectPage();
          sendResponse({ success: true, data });
        } catch (err: any) {
          sendResponse({ success: false, error: err.message });
        }
      }
      return true; // Keep channel open for async response
    });
  }

  // Also expose on window for debugging or direct script injection evaluation
  (window as any).__SEO_INSPECTOR_RUN__ = inspectPage;
}
