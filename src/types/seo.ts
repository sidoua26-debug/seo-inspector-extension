export type TabId = 
  | 'overview' 
  | 'content' 
  | 'links' 
  | 'hreflangs' 
  | 'images' 
  | 'schema' 
  | 'pagespeed' 
  | 'tracking' 
  | 'issues';

export type IssueSeverity = 'critical' | 'warning' | 'pass';

export interface AuditIssue {
  id: string;
  category: 'Overview' | 'Content' | 'Links' | 'Hreflang' | 'Images' | 'Schema' | 'Performance' | 'Tracking';
  severity: IssueSeverity;
  title: string;
  description: string;
  recommendation: string;
  value?: string | number;
}

export interface OverviewData {
  url: string;
  domain: string;
  protocol: string;
  httpStatus: number;
  httpStatusText: string;
  title: string;
  titleLength: number;
  titleStatus: 'optimal' | 'too-short' | 'too-long' | 'missing';
  description: string;
  descriptionLength: number;
  descriptionStatus: 'optimal' | 'too-short' | 'too-long' | 'missing';
  canonicalUrl: string;
  canonicalStatus: 'self' | 'cross-domain' | 'missing' | 'relative' | 'mismatch';
  robotsMeta: string;
  robotsDirectives: {
    noindex: boolean;
    nofollow: boolean;
    noarchive: boolean;
    nosnippet: boolean;
    noimageindex: boolean;
    maxSnippet?: string;
  };
  googlebotMeta?: string;
  xRobotsTag?: string;
  charset: string;
  viewport: string;
  favicon?: string;
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    url?: string;
    siteName?: string;
  };
  twitterCard: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

export interface HeadingItem {
  id: string;
  level: number;
  tag: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';
  text: string;
  charCount: number;
}

export interface KeywordDensityItem {
  keyword: string;
  count: number;
  density: number; // percentage e.g. 2.4%
}

export interface ContentData {
  headings: HeadingItem[];
  headingCounts: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  headingIssues: Array<{
    type: 'missing_h1' | 'multiple_h1' | 'skipped_level' | 'empty_heading';
    message: string;
  }>;
  wordCount: number;
  charCount: number;
  textByteLength: number;
  htmlByteLength: number;
  textToCodeRatio: number; // percentage e.g. 15.2
  readingTimeMinutes: number;
  topSingleWords: KeywordDensityItem[];
  topTwoWords: KeywordDensityItem[];
  topThreeWords: KeywordDensityItem[];
}

export interface LinkItem {
  href: string;
  rawHref: string;
  text: string;
  isInternal: boolean;
  isExternal: boolean;
  rel: string;
  isNofollow: boolean;
  isSponsored: boolean;
  isUgc: boolean;
  target: string;
  isBlankWithoutNoopener: boolean;
  isSecure: boolean;
  hasAnchorText: boolean;
  isHash: boolean;
}

export interface LinksData {
  totalLinks: number;
  internalCount: number;
  externalCount: number;
  nofollowCount: number;
  dofollowCount: number;
  sponsoredCount: number;
  ugcCount: number;
  secureCount: number;
  insecureCount: number;
  emptyAnchorCount: number;
  links: LinkItem[];
}

export interface HreflangItem {
  lang: string;
  href: string;
  isValidLang: boolean;
  isSelf: boolean;
  isXDefault: boolean;
}

export interface HreflangsData {
  htmlLang: string;
  totalHreflangs: number;
  hasXDefault: boolean;
  hasSelfReference: boolean;
  items: HreflangItem[];
  issues: Array<{
    type: string;
    message: string;
  }>;
}

export interface ImageItem {
  src: string;
  currentSrc: string;
  alt: string;
  hasAlt: boolean;
  isAltEmpty: boolean;
  naturalWidth: number;
  naturalHeight: number;
  renderedWidth: number;
  renderedHeight: number;
  missingDimensions: boolean;
  isBroken: boolean;
  format: string;
  loading: string;
}

export interface ImagesData {
  totalImages: number;
  missingAltCount: number;
  emptyAltCount: number;
  brokenCount: number;
  missingDimensionsCount: number;
  formatCounts: Record<string, number>;
  items: ImageItem[];
}

export interface SchemaBlock {
  index: number;
  types: string[];
  rawJson: string;
  parsed: any;
  isValid: boolean;
  errorMessage?: string;
}

export interface StructuredDataInfo {
  totalSchemas: number;
  rawBlocks: SchemaBlock[];
  detectedTypes: string[];
  validationIssues: Array<{
    schemaType: string;
    issue: string;
    severity: 'critical' | 'warning';
  }>;
  microdataCount: number;
}

export interface PageSpeedData {
  ttfb: number;
  dnsTime: number;
  tcpTime: number;
  tlsTime: number;
  domInteractive: number;
  domContentLoaded: number;
  loadTime: number;
  totalResources: number;
  totalTransferSizeKb: number;
  resourceBreakdown: Array<{
    type: string;
    count: number;
    sizeKb: number;
  }>;
  coreWebVitals: {
    lcp?: number;
    cls?: number;
    fcp?: number;
  };
}

export interface TrackingData {
  ga4Ids: string[];
  uaIds: string[];
  gtmIds: string[];
  gscVerificationTags: string[];
  bingVerification?: string;
  metaPixelIds: string[];
  otherTrackers: string[];
}

export interface RawSeoExtractedData {
  timestamp: string;
  overview: OverviewData;
  content: ContentData;
  links: LinksData;
  hreflangs: HreflangsData;
  images: ImagesData;
  schema: StructuredDataInfo;
  pagespeed: PageSpeedData;
  tracking: TrackingData;
}

export interface SeoInspectorData extends RawSeoExtractedData {
  issues: AuditIssue[];
  healthScore: number;
  scoreBreakdown: {
    critical: number;
    warning: number;
    pass: number;
  };
}

export interface SeoInspectorSettings {
  minTitleLength: number;
  maxTitleLength: number;
  minDescLength: number;
  maxDescLength: number;
  minTextToCodeRatio: number;
  maxImageSizeKb: number;
  flagMissingAlt: boolean;
  flagMissingDimensions: boolean;
  strictHeadingOrder: boolean;
  defaultExportFormat: 'markdown' | 'json';
  auditorName: string;
  agencyName: string;
  includePassingChecks: boolean;
  googlePageSpeedApiKey?: string;
  autoInspectOnOpen: boolean;
}

export const DEFAULT_SETTINGS: SeoInspectorSettings = {
  minTitleLength: 30,
  maxTitleLength: 60,
  minDescLength: 70,
  maxDescLength: 160,
  minTextToCodeRatio: 15,
  maxImageSizeKb: 150,
  flagMissingAlt: true,
  flagMissingDimensions: true,
  strictHeadingOrder: true,
  defaultExportFormat: 'markdown',
  auditorName: '',
  agencyName: '',
  includePassingChecks: true,
  googlePageSpeedApiKey: '',
  autoInspectOnOpen: true,
};

