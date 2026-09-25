import { SeoInspectorData } from '../types/seo';

/**
 * Formats full SEO Inspector data into a clean, client-ready Markdown audit report
 */
export function generateMarkdownReport(data: SeoInspectorData): string {
  const { overview, content, links, hreflangs, images, schema, pagespeed, tracking, issues, healthScore, scoreBreakdown } = data;

  const dateStr = new Date(data.timestamp).toLocaleString();

  let md = `# Technical SEO Audit Report: ${overview.domain}\n\n`;
  md += `- **Target URL**: [${overview.url}](${overview.url})\n`;
  md += `- **Audit Date**: ${dateStr}\n`;
  md += `- **SEO Health Score**: **${healthScore}/100**\n`;
  md += `- **Issues Summary**: 🔴 ${scoreBreakdown.critical} Critical | 🟡 ${scoreBreakdown.warning} Warnings | 🟢 ${scoreBreakdown.pass} Passed\n\n`;

  md += `## 1. Overview & Meta Tags\n\n`;
  md += `| Item | Value | Status |\n`;
  md += `|---|---|---|\n`;
  md += `| **HTTP Status** | \`${overview.httpStatus} ${overview.httpStatusText}\` (${overview.protocol}) | ${overview.httpStatus === 200 ? '✅ 200 OK' : '⚠️ ' + overview.httpStatus} |\n`;
  md += `| **Title** | ${overview.title || '*None*'} (${overview.titleLength} chars) | ${overview.titleStatus === 'optimal' ? '✅ Optimal' : '⚠️ ' + overview.titleStatus} |\n`;
  md += `| **Meta Description** | ${overview.description || '*None*'} (${overview.descriptionLength} chars) | ${overview.descriptionStatus === 'optimal' ? '✅ Optimal' : '⚠️ ' + overview.descriptionStatus} |\n`;
  md += `| **Canonical URL** | \`${overview.canonicalUrl || 'Missing'}\` | ${overview.canonicalStatus === 'self' ? '✅ Self-canonical' : '⚠️ ' + overview.canonicalStatus} |\n`;
  md += `| **Robots Meta** | \`${overview.robotsMeta}\` | ${overview.robotsDirectives.noindex ? '🔴 Noindex' : '✅ Indexable'} |\n`;
  md += `| **Open Graph Title** | ${overview.openGraph.title || '*Not set*'} | - |\n`;
  md += `| **Twitter Card** | ${overview.twitterCard.card || '*Not set*'} | - |\n\n`;

  md += `## 2. Content & Heading Structure\n\n`;
  md += `- **Word Count**: ${content.wordCount.toLocaleString()} words (approx ${content.readingTimeMinutes} min read)\n`;
  md += `- **Text-to-Code Ratio**: ${content.textToCodeRatio}%\n`;
  md += `- **Heading Breakdown**: H1: ${content.headingCounts.h1} | H2: ${content.headingCounts.h2} | H3: ${content.headingCounts.h3} | H4: ${content.headingCounts.h4} | H5: ${content.headingCounts.h5} | H6: ${content.headingCounts.h6}\n\n`;

  if (content.headings.length > 0) {
    md += `### Heading Hierarchy (H1-H6 Tree)\n\n`;
    content.headings.slice(0, 30).forEach(h => {
      const indent = '  '.repeat(h.level - 1);
      md += `${indent}- **<${h.tag}>**: ${h.text}\n`;
    });
    if (content.headings.length > 30) {
      md += `\n*... and ${content.headings.length - 30} more headings.*\n`;
    }
    md += `\n`;
  }

  if (content.topSingleWords.length > 0) {
    md += `### Top Keywords Density\n\n`;
    md += `| Keyword | Occurrences | Density |\n`;
    md += `|---|---|---|\n`;
    content.topSingleWords.slice(0, 5).forEach(kw => {
      md += `| **${kw.keyword}** | ${kw.count} | ${kw.density}% |\n`;
    });
    md += `\n`;
  }

  md += `## 3. Links Analysis\n\n`;
  md += `- **Total Links**: ${links.totalLinks}\n`;
  md += `- **Internal Links**: ${links.internalCount} (${links.totalLinks > 0 ? ((links.internalCount / links.totalLinks) * 100).toFixed(1) : 0}%)\n`;
  md += `- **External Links**: ${links.externalCount}\n`;
  md += `- **Nofollow Links**: ${links.nofollowCount} | **Dofollow**: ${links.dofollowCount}\n`;
  md += `- **Insecure (HTTP) Links**: ${links.insecureCount}\n`;
  md += `- **Empty Anchor Text**: ${links.emptyAnchorCount}\n\n`;

  md += `## 4. Hreflang & Internationalization\n\n`;
  md += `- **HTML Lang**: \`${hreflangs.htmlLang || 'Missing'}\`\n`;
  md += `- **Hreflang Tags**: ${hreflangs.totalHreflangs} detected\n`;
  md += `- **x-default Present**: ${hreflangs.hasXDefault ? '✅ Yes' : '❌ No'}\n`;
  md += `- **Self-Referencing Tag**: ${hreflangs.hasSelfReference ? '✅ Yes' : '⚠️ Missing'}\n\n`;

  md += `## 5. Image Optimization\n\n`;
  md += `- **Total Images**: ${images.totalImages}\n`;
  md += `- **Missing Alt Attributes**: ${images.missingAltCount} (${images.totalImages > 0 ? ((images.missingAltCount / images.totalImages) * 100).toFixed(1) : 0}%)\n`;
  md += `- **Broken Images**: ${images.brokenCount}\n`;
  md += `- **Missing Dimensions (CLS risk)**: ${images.missingDimensionsCount}\n\n`;

  md += `## 6. Structured Data (Schema.org)\n\n`;
  md += `- **JSON-LD Blocks**: ${schema.totalSchemas}\n`;
  md += `- **Detected Types**: ${schema.detectedTypes.length > 0 ? schema.detectedTypes.join(', ') : 'None'}\n`;
  md += `- **Microdata Items**: ${schema.microdataCount}\n\n`;

  md += `## 7. Performance & Web Vitals (Navigation API)\n\n`;
  md += `- **TTFB (Time to First Byte)**: ${pagespeed.ttfb} ms\n`;
  md += `- **DOM Content Loaded**: ${pagespeed.domContentLoaded} ms\n`;
  md += `- **Full Page Load Time**: ${pagespeed.loadTime} ms\n`;
  md += `- **Total Resources**: ${pagespeed.totalResources} (${pagespeed.totalTransferSizeKb} KB transfer)\n\n`;

  md += `## 8. Analytics & Tracking\n\n`;
  md += `- **GA4 IDs**: ${tracking.ga4Ids.length > 0 ? tracking.ga4Ids.join(', ') : 'None'}\n`;
  md += `- **GTM Containers**: ${tracking.gtmIds.length > 0 ? tracking.gtmIds.join(', ') : 'None'}\n`;
  md += `- **GSC Verification**: ${tracking.gscVerificationTags.length > 0 ? '✅ Detected' : 'None'}\n\n`;

  md += `## 9. Consolidated Diagnostic Issues & Recommendations\n\n`;
  issues.forEach((iss, index) => {
    const icon = iss.severity === 'critical' ? '🔴' : iss.severity === 'warning' ? '🟡' : '🟢';
    md += `### ${index + 1}. ${icon} [${iss.category}] ${iss.title}\n\n`;
    md += `- **Issue**: ${iss.description}\n`;
    md += `- **Fix Recommendation**: ${iss.recommendation}\n\n`;
  });

  md += `---\n*Generated by SEO Inspector Chrome Extension*\n`;
  return md;
}

/**
 * Downloads a file to the user's browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
