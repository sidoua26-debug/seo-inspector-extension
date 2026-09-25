import React from 'react';
import { OverviewData } from '../../../types/seo';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import { ExternalLink, Globe, ShieldCheck, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface OverviewTabProps {
  overview: OverviewData;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ overview }) => {
  const getStatusBadge = (status: 'optimal' | 'too-short' | 'too-long' | 'missing', length: number, recommended: string) => {
    switch (status) {
      case 'optimal':
        return <Badge variant="pass" icon>{length} chars (Optimal)</Badge>;
      case 'too-short':
        return <Badge variant="warning" icon>{length} chars (Too short, rec: {recommended})</Badge>;
      case 'too-long':
        return <Badge variant="warning" icon>{length} chars (May truncate, rec: {recommended})</Badge>;
      case 'missing':
        return <Badge variant="critical" icon>Missing (rec: {recommended})</Badge>;
    }
  };

  const getCanonicalBadge = () => {
    switch (overview.canonicalStatus) {
      case 'self':
        return <Badge variant="pass" icon>Self-Canonical</Badge>;
      case 'cross-domain':
        return <Badge variant="warning" icon>Cross-Domain</Badge>;
      case 'relative':
        return <Badge variant="warning" icon>Relative URL</Badge>;
      case 'missing':
        return <Badge variant="critical" icon>Missing</Badge>;
      case 'mismatch':
        return <Badge variant="warning" icon>Points to different URL</Badge>;
    }
  };

  return (
    <div className="space-y-3 pb-3">
      {/* Quick Status Bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${overview.httpStatus === 200 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <Globe className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Status Code</div>
            <div className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <span>{overview.httpStatus}</span>
              <span className="text-xs font-normal text-slate-400">{overview.httpStatusText}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${overview.robotsDirectives.noindex ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Indexing</div>
            <div className="text-sm font-semibold text-slate-100 truncate">
              {overview.robotsDirectives.noindex ? 'Blocked (Noindex)' : 'Indexable'}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Globe className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Protocol</div>
            <div className="text-sm font-semibold text-slate-100 uppercase">
              {overview.protocol}
            </div>
          </div>
        </div>
      </div>

      {/* Title Tag */}
      <Card
        title="Title Tag"
        badge={getStatusBadge(overview.titleStatus, overview.titleLength, '50-60 chars')}
        action={overview.title && <CopyButton textToCopy={overview.title} />}
      >
        <div className="text-sm text-slate-200 leading-relaxed font-medium">
          {overview.title || <span className="text-rose-400 italic">No &lt;title&gt; tag found</span>}
        </div>
        {/* Progress meter */}
        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
          <div className="flex-1 h-1.5 bg-slate-700/80 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                overview.titleStatus === 'optimal'
                  ? 'bg-emerald-500'
                  : overview.titleStatus === 'too-short'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, (overview.titleLength / 65) * 100)}%` }}
            />
          </div>
          <span className="font-mono">{overview.titleLength}/60 chars</span>
        </div>
      </Card>

      {/* Meta Description */}
      <Card
        title="Meta Description"
        badge={getStatusBadge(overview.descriptionStatus, overview.descriptionLength, '120-160 chars')}
        action={overview.description && <CopyButton textToCopy={overview.description} />}
      >
        <div className="text-xs text-slate-300 leading-relaxed">
          {overview.description || <span className="text-amber-400 italic">No meta description found</span>}
        </div>
        {/* Progress meter */}
        <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
          <div className="flex-1 h-1.5 bg-slate-700/80 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                overview.descriptionStatus === 'optimal'
                  ? 'bg-emerald-500'
                  : overview.descriptionStatus === 'too-short'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, (overview.descriptionLength / 160) * 100)}%` }}
            />
          </div>
          <span className="font-mono">{overview.descriptionLength}/160 chars</span>
        </div>
      </Card>

      {/* Canonical URL */}
      <Card
        title="Canonical URL"
        badge={getCanonicalBadge()}
        action={overview.canonicalUrl && <CopyButton textToCopy={overview.canonicalUrl} />}
      >
        <div className="text-xs font-mono text-cyan-300/90 break-all bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
          {overview.canonicalUrl || <span className="text-amber-400 italic">Missing canonical tag</span>}
        </div>
      </Card>

      {/* Robots Directives */}
      <Card title="Robots Directives & Crawl Tags">
        <div className="space-y-2">
          <div className="text-xs font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-700/50 text-slate-300">
            {overview.robotsMeta}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant={overview.robotsDirectives.noindex ? 'critical' : 'pass'} icon>
              {overview.robotsDirectives.noindex ? 'noindex' : 'index'}
            </Badge>
            <Badge variant={overview.robotsDirectives.nofollow ? 'warning' : 'pass'} icon>
              {overview.robotsDirectives.nofollow ? 'nofollow' : 'follow'}
            </Badge>
            {overview.robotsDirectives.noarchive && <Badge variant="neutral">noarchive</Badge>}
            {overview.robotsDirectives.nosnippet && <Badge variant="neutral">nosnippet</Badge>}
            {overview.robotsDirectives.maxSnippet && (
              <Badge variant="neutral">max-snippet:{overview.robotsDirectives.maxSnippet}</Badge>
            )}
            {overview.googlebotMeta && (
              <Badge variant="accent">googlebot: {overview.googlebotMeta}</Badge>
            )}
          </div>
        </div>
      </Card>

      {/* Technical Meta & Social Cards */}
      <div className="grid grid-cols-2 gap-2">
        <Card title="Technical Specs">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Charset:</span>
              <span className="font-mono text-slate-200">{overview.charset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Viewport:</span>
              <span className="font-mono text-slate-200 text-[11px] truncate max-w-[150px]" title={overview.viewport}>
                {overview.viewport || 'Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">OpenGraph:</span>
              <span className="text-slate-200">{overview.openGraph.title ? 'Configured' : 'Missing'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Twitter Card:</span>
              <span className="text-slate-200">{overview.twitterCard.card || 'Missing'}</span>
            </div>
          </div>
        </Card>

        <Card title="SERP Snippet Preview">
          <div className="bg-white text-slate-900 p-2.5 rounded-lg text-left shadow-sm space-y-0.5">
            <div className="text-[10px] text-slate-500 truncate">{overview.domain}</div>
            <div className="text-xs font-semibold text-blue-700 truncate hover:underline cursor-pointer">
              {overview.title || 'Page Title'}
            </div>
            <div className="text-[11px] text-slate-600 line-clamp-2 leading-tight">
              {overview.description || 'Provide a compelling description for this search result snippet.'}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
