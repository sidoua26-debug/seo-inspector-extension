import {
  AuditIssue,
  ContentData,
  HreflangsData,
  ImagesData,
  LinksData,
  OverviewData,
  PageSpeedData,
  StructuredDataInfo,
  TrackingData,
} from '../types/seo';

export interface AuditEngineInput {
  overview: OverviewData;
  content: ContentData;
  links: LinksData;
  hreflangs: HreflangsData;
  images: ImagesData;
  schema: StructuredDataInfo;
  pagespeed: PageSpeedData;
  tracking: TrackingData;
}

export interface AuditEngineResult {
  score: number;
  issues: AuditIssue[];
  scoreBreakdown: {
    critical: number;
    warning: number;
    pass: number;
  };
}

export function runAuditEngine(input: AuditEngineInput): AuditEngineResult {
  const issues: AuditIssue[] = [];
  const { overview, content, links, hreflangs, images, schema, pagespeed, tracking } = input;

  let deduction = 0;

  // 1. Overview: Title Check
  if (!overview.title || overview.title.length === 0) {
    issues.push({
      id: 'missing-title',
      category: 'Overview',
      severity: 'critical',
      title: 'Missing <title> tag',
      description: 'The page has no title tag defined.',
      recommendation: 'Add a descriptive <title> tag between 50 and 60 characters containing your primary target keywords.',
      value: 0,
    });
    deduction += 15;
  } else if (overview.titleLength < 30) {
    issues.push({
      id: 'short-title',
      category: 'Overview',
      severity: 'warning',
      title: 'Title tag is too short',
      description: `Current title is ${overview.titleLength} characters. Titles under 30 characters often underutilize search snippet real estate.`,
      recommendation: 'Expand title to 50-60 characters with secondary keywords or brand name.',
      value: `${overview.titleLength} chars`,
    });
    deduction += 5;
  } else if (overview.titleLength > 65) {
    issues.push({
      id: 'long-title',
      category: 'Overview',
      severity: 'warning',
      title: 'Title tag may truncate in search results',
      description: `Current title is ${overview.titleLength} characters. Search engines typically truncate titles longer than 60-65 characters.`,
      recommendation: 'Shorten title to 50-60 characters so it remains intact in SERPs.',
      value: `${overview.titleLength} chars`,
    });
    deduction += 4;
  } else {
    issues.push({
      id: 'optimal-title',
      category: 'Overview',
      severity: 'pass',
      title: 'Optimal Title tag length',
      description: `Title length is ${overview.titleLength} characters, within the recommended 30-65 character range.`,
      recommendation: 'Keep title clear and keyword-focused.',
      value: `${overview.titleLength} chars`,
    });
  }

  // 2. Overview: Meta Description
  if (!overview.description) {
    issues.push({
      id: 'missing-description',
      category: 'Overview',
      severity: 'warning',
      title: 'Missing Meta Description',
      description: 'The page does not specify a meta description tag.',
      recommendation: 'Add a compelling meta description between 120 and 160 characters to improve organic click-through rates (CTR).',
      value: 'Missing',
    });
    deduction += 8;
  } else if (overview.descriptionLength < 70) {
    issues.push({
      id: 'short-description',
      category: 'Overview',
      severity: 'warning',
      title: 'Meta Description is too short',
      description: `Meta description is only ${overview.descriptionLength} characters.`,
      recommendation: 'Expand description to 120-160 characters with a clear call to action.',
      value: `${overview.descriptionLength} chars`,
    });
    deduction += 3;
  } else if (overview.descriptionLength > 165) {
    issues.push({
      id: 'long-description',
      category: 'Overview',
      severity: 'warning',
      title: 'Meta Description may truncate',
      description: `Meta description is ${overview.descriptionLength} characters, which exceeds the typical 160-character desktop snippet limit.`,
      recommendation: 'Keep meta description around 140-160 characters to avoid truncation.',
      value: `${overview.descriptionLength} chars`,
    });
    deduction += 3;
  } else {
    issues.push({
      id: 'optimal-description',
      category: 'Overview',
      severity: 'pass',
      title: 'Optimal Meta Description length',
      description: `Meta description is ${overview.descriptionLength} characters, nicely sized for SERP snippets.`,
      recommendation: 'Ensure your description contains an enticing proposition.',
      value: `${overview.descriptionLength} chars`,
    });
  }

  // 3. Overview: Canonical
  if (overview.canonicalStatus === 'missing') {
    issues.push({
      id: 'missing-canonical',
      category: 'Overview',
      severity: 'warning',
      title: 'Missing Canonical URL',
      description: 'No <link rel="canonical"> tag was detected on this page.',
      recommendation: 'Add a self-referencing canonical tag to prevent duplicate content indexing issues.',
      value: 'None',
    });
    deduction += 6;
  } else if (overview.canonicalStatus === 'relative') {
    issues.push({
      id: 'relative-canonical',
      category: 'Overview',
      severity: 'warning',
      title: 'Canonical URL uses relative path',
      description: `Canonical tag specifies a relative path (${overview.canonicalUrl}) rather than an absolute URL.`,
      recommendation: 'Always use absolute URLs (e.g. https://example.com/page) in canonical tags.',
      value: overview.canonicalUrl,
    });
    deduction += 4;
  } else {
    issues.push({
      id: 'valid-canonical',
      category: 'Overview',
      severity: 'pass',
      title: 'Valid Canonical tag present',
      description: `Canonical points to ${overview.canonicalUrl}.`,
      recommendation: 'Maintains canonical authority.',
      value: overview.canonicalUrl,
    });
  }

  // 4. Overview: Robots Directives
  if (overview.robotsDirectives.noindex) {
    issues.push({
      id: 'robots-noindex',
      category: 'Overview',
      severity: 'critical',
      title: 'Page has "noindex" directive',
      description: 'The robots meta tag includes "noindex", preventing search engines from indexing this page.',
      recommendation: 'If this page is intended for public organic search, remove the "noindex" directive immediately.',
      value: overview.robotsMeta,
    });
    deduction += 20;
  } else {
    issues.push({
      id: 'robots-indexable',
      category: 'Overview',
      severity: 'pass',
      title: 'Page is indexable',
      description: 'No "noindex" directive detected in robots meta.',
      recommendation: 'Search engines are allowed to index this page.',
      value: 'Indexable',
    });
  }

  // 5. Content: H1 Tag
  if (content.headingCounts.h1 === 0) {
    issues.push({
      id: 'missing-h1',
      category: 'Content',
      severity: 'critical',
      title: 'Missing <h1> tag',
      description: 'The page has no <h1> heading element.',
      recommendation: 'Add a clear, unique <h1> tag representing the main topic of this page.',
      value: 0,
    });
    deduction += 15;
  } else if (content.headingCounts.h1 > 1) {
    issues.push({
      id: 'multiple-h1',
      category: 'Content',
      severity: 'warning',
      title: 'Multiple <h1> tags detected',
      description: `Found ${content.headingCounts.h1} <h1> headings on the page.`,
      recommendation: 'While HTML5 permits multiple H1s, maintaining a single distinct <h1> per page clarifies page hierarchy for search engines and screen readers.',
      value: content.headingCounts.h1,
    });
    deduction += 5;
  } else {
    issues.push({
      id: 'optimal-h1',
      category: 'Content',
      severity: 'pass',
      title: 'Single <h1> tag present',
      description: `Found 1 <h1>: "${content.headings.find(h => h.tag === 'H1')?.text.slice(0, 50)}..."`,
      recommendation: 'Ensure your H1 aligns closely with your primary search query.',
      value: 1,
    });
  }

  // 6. Content: Heading Hierarchy (Skipped levels)
  const skippedLevelIssue = content.headingIssues.find(i => i.type === 'skipped_level');
  if (skippedLevelIssue) {
    issues.push({
      id: 'heading-skipped-levels',
      category: 'Content',
      severity: 'warning',
      title: 'Heading levels skipped in hierarchy',
      description: skippedLevelIssue.message,
      recommendation: 'Structure headings sequentially (H1 -> H2 -> H3) without skipping levels for accessibility and SEO semantics.',
    });
    deduction += 3;
  }

  // 7. Content: Word Count & Text to Code
  if (content.wordCount < 150) {
    issues.push({
      id: 'thin-content',
      category: 'Content',
      severity: 'warning',
      title: 'Thin content / Low word count',
      description: `The page contains only ${content.wordCount} words of text.`,
      recommendation: 'Expand page content to provide comprehensive value to visitors.',
      value: `${content.wordCount} words`,
    });
    deduction += 6;
  } else {
    issues.push({
      id: 'healthy-word-count',
      category: 'Content',
      severity: 'pass',
      title: 'Substantial content length',
      description: `Page contains ${content.wordCount.toLocaleString()} words (approx ${content.readingTimeMinutes} min read).`,
      recommendation: 'Ensure content remains engaging and addresses user intent.',
      value: `${content.wordCount} words`,
    });
  }

  if (content.textToCodeRatio < 10) {
    issues.push({
      id: 'low-text-code-ratio',
      category: 'Content',
      severity: 'warning',
      title: 'Low Text-to-HTML Code Ratio',
      description: `Text-to-code ratio is ${content.textToCodeRatio}%. Low ratios (< 10%) can indicate excessive inline code, bloated markup, or sparse text.`,
      recommendation: 'Clean up unnecessary HTML elements, externalize inline CSS/JS, and enrich textual content.',
      value: `${content.textToCodeRatio}%`,
    });
    deduction += 4;
  } else {
    issues.push({
      id: 'good-text-code-ratio',
      category: 'Content',
      severity: 'pass',
      title: 'Healthy Text-to-Code Ratio',
      description: `Text-to-code ratio is ${content.textToCodeRatio}%.`,
      recommendation: 'Markup is well-balanced with content.',
      value: `${content.textToCodeRatio}%`,
    });
  }

  // 8. Links: Internal, Insecure, and Empty Anchors
  if (links.insecureCount > 0) {
    issues.push({
      id: 'insecure-links',
      category: 'Links',
      severity: 'warning',
      title: 'Insecure HTTP links on HTTPS page',
      description: `Found ${links.insecureCount} link(s) linking to unencrypted "http://" URLs.`,
      recommendation: 'Update all links to use secure HTTPS protocols.',
      value: links.insecureCount,
    });
    deduction += 5;
  }

  if (links.emptyAnchorCount > 0) {
    issues.push({
      id: 'empty-anchors',
      category: 'Links',
      severity: 'warning',
      title: 'Links with empty anchor text',
      description: `Found ${links.emptyAnchorCount} link(s) without discernible anchor text or image alt.`,
      recommendation: 'Provide meaningful anchor text describing the destination for users, search engines, and screen readers.',
      value: links.emptyAnchorCount,
    });
    deduction += 4;
  }

  // 9. Hreflang Issues
  hreflangs.issues.forEach((iss, idx) => {
    issues.push({
      id: `hreflang-issue-${idx}`,
      category: 'Hreflang',
      severity: 'warning',
      title: iss.type.replace(/_/g, ' ').toUpperCase(),
      description: iss.message,
      recommendation: 'Configure hreflang attributes correctly with language, country code, and x-default fallback.',
    });
    deduction += 3;
  });

  if (hreflangs.htmlLang) {
    issues.push({
      id: 'html-lang-valid',
      category: 'Hreflang',
      severity: 'pass',
      title: 'HTML lang attribute declared',
      description: `Page declares lang="${hreflangs.htmlLang}".`,
      recommendation: 'Enables correct browser text rendering and search indexing.',
      value: hreflangs.htmlLang,
    });
  }

  // 10. Images: Missing Alt, Broken, Missing Dimensions
  if (images.brokenCount > 0) {
    issues.push({
      id: 'broken-images',
      category: 'Images',
      severity: 'critical',
      title: 'Broken image(s) detected',
      description: `Found ${images.brokenCount} broken image(s) that failed to load or have 0 natural width.`,
      recommendation: 'Repair or replace broken image sources immediately.',
      value: images.brokenCount,
    });
    deduction += 10;
  }

  if (images.missingAltCount > 0) {
    const severity = images.missingAltCount > 5 ? 'critical' : 'warning';
    issues.push({
      id: 'missing-alt-tags',
      category: 'Images',
      severity,
      title: 'Images missing alt attributes',
      description: `${images.missingAltCount} out of ${images.totalImages} images lack an "alt" attribute.`,
      recommendation: 'Add descriptive alt attributes to all non-decorative images for accessibility and image search indexing.',
      value: `${images.missingAltCount} / ${images.totalImages}`,
    });
    deduction += severity === 'critical' ? 8 : 4;
  } else if (images.totalImages > 0) {
    issues.push({
      id: 'all-images-have-alt',
      category: 'Images',
      severity: 'pass',
      title: 'All images have alt attributes',
      description: `All ${images.totalImages} images on the page have an alt attribute defined.`,
      recommendation: 'Great job maintaining accessible images.',
      value: `${images.totalImages} images`,
    });
  }

  if (images.missingDimensionsCount > 0) {
    issues.push({
      id: 'missing-image-dimensions',
      category: 'Images',
      severity: 'warning',
      title: 'Images missing explicit width/height (CLS Risk)',
      description: `Found ${images.missingDimensionsCount} image(s) without explicit width and height attributes in HTML.`,
      recommendation: 'Specify width and height attributes or CSS aspect-ratio on images to prevent Cumulative Layout Shifts (CLS).',
      value: images.missingDimensionsCount,
    });
    deduction += 4;
  }

  // 11. Structured Data: Schema
  if (schema.totalSchemas === 0 && schema.microdataCount === 0) {
    issues.push({
      id: 'missing-schema',
      category: 'Schema',
      severity: 'warning',
      title: 'No structured data detected',
      description: 'No JSON-LD schema or Microdata tags were found on the page.',
      recommendation: 'Implement JSON-LD structured data (such as Article, WebSite, Organization, BreadcrumbList) to qualify for rich SERP features.',
      value: 0,
    });
    deduction += 6;
  } else {
    const invalidBlock = schema.rawBlocks.find(b => !b.isValid);
    if (invalidBlock) {
      issues.push({
        id: 'invalid-schema-json',
        category: 'Schema',
        severity: 'critical',
        title: 'Syntax error in JSON-LD schema',
        description: invalidBlock.errorMessage || 'Invalid JSON syntax in application/ld+json script.',
        recommendation: 'Fix the JSON syntax error in your structured data script.',
      });
      deduction += 10;
    } else {
      issues.push({
        id: 'valid-schema',
        category: 'Schema',
        severity: 'pass',
        title: 'Structured Data detected',
        description: `Found ${schema.totalSchemas} JSON-LD block(s) defining: ${schema.detectedTypes.join(', ') || 'Entities'}.`,
        recommendation: 'Verify in Google Rich Results Test to confirm rich snippet eligibility.',
        value: `${schema.totalSchemas} blocks`,
      });
    }
  }

  // 12. Performance: TTFB
  if (pagespeed.ttfb > 1200) {
    issues.push({
      id: 'high-ttfb',
      category: 'Performance',
      severity: 'warning',
      title: 'Slow Server Response (TTFB)',
      description: `Time to First Byte was ${pagespeed.ttfb}ms, exceeding the recommended 800ms threshold.`,
      recommendation: 'Investigate backend database queries, implement server-side page caching, or enable CDN edge caching.',
      value: `${pagespeed.ttfb}ms`,
    });
    deduction += 6;
  } else if (pagespeed.ttfb > 0) {
    issues.push({
      id: 'good-ttfb',
      category: 'Performance',
      severity: 'pass',
      title: 'Fast Server Response (TTFB)',
      description: `Time to First Byte was ${pagespeed.ttfb}ms, delivering quick initial response.`,
      recommendation: 'Server responds within good performance bounds.',
      value: `${pagespeed.ttfb}ms`,
    });
  }

  // 13. Tracking: GSC & GA4
  if (tracking.ga4Ids.length === 0 && tracking.gtmIds.length === 0) {
    issues.push({
      id: 'missing-analytics',
      category: 'Tracking',
      severity: 'warning',
      title: 'No GA4 or GTM container detected',
      description: 'Could not detect an active Google Analytics 4 (G-XXXXX) or Google Tag Manager (GTM-XXXXX) tag in page scripts.',
      recommendation: 'Ensure Google Analytics 4 or Google Tag Manager is installed to measure organic search performance and user behavior.',
      value: 'None',
    });
    deduction += 4;
  } else {
    issues.push({
      id: 'analytics-detected',
      category: 'Tracking',
      severity: 'pass',
      title: 'Analytics tracking active',
      description: `Detected: ${[...tracking.ga4Ids, ...tracking.gtmIds].join(', ')}`,
      recommendation: 'Tracking measurement is active.',
      value: 'Active',
    });
  }

  // Calculate final score: 0 to 100
  const score = Math.max(0, Math.min(100, Math.round(100 - deduction)));

  const scoreBreakdown = {
    critical: issues.filter(i => i.severity === 'critical').length,
    warning: issues.filter(i => i.severity === 'warning').length,
    pass: issues.filter(i => i.severity === 'pass').length,
  };

  return {
    score,
    issues,
    scoreBreakdown,
  };
}
