import React from 'react';
import { TrackingData } from '../../../types/seo';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import { BarChart3, Search, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

interface GscGa4TabProps {
  tracking: TrackingData;
  url: string;
}

export const GscGa4Tab: React.FC<GscGa4TabProps> = ({ tracking, url }) => {
  const gscInspectUrl = `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(url)}`;
  const gscPerformanceUrl = `https://search.google.com/search-console/performance/search-analytics`;

  return (
    <div className="space-y-3 pb-3">
      {/* Quick Launch Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href={gscInspectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400" />
            <span>GSC URL Inspection</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
        </a>

        <a
          href={gscPerformanceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 transition-all group"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>GSC Performance</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400" />
        </a>
      </div>

      {/* Google Analytics 4 (GA4) */}
      <Card
        title="Google Analytics 4 (GA4)"
        badge={
          tracking.ga4Ids.length > 0 ? (
            <Badge variant="pass" icon>Active</Badge>
          ) : (
            <Badge variant="warning" icon>Not Found</Badge>
          )
        }
      >
        {tracking.ga4Ids.length === 0 ? (
          <div className="text-xs text-slate-400 italic">No GA4 Measurement IDs (G-XXXXX) detected in page scripts.</div>
        ) : (
          <div className="space-y-1.5">
            {tracking.ga4Ids.map((id) => (
              <div key={id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                <span className="font-mono font-bold text-cyan-400">{id}</span>
                <CopyButton textToCopy={id} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Google Tag Manager (GTM) */}
      <Card
        title="Google Tag Manager (GTM)"
        badge={
          tracking.gtmIds.length > 0 ? (
            <Badge variant="pass" icon>Active</Badge>
          ) : (
            <Badge variant="neutral">Not Found</Badge>
          )
        }
      >
        {tracking.gtmIds.length === 0 ? (
          <div className="text-xs text-slate-400 italic">No GTM container IDs (GTM-XXXXX) detected.</div>
        ) : (
          <div className="space-y-1.5">
            {tracking.gtmIds.map((id) => (
              <div key={id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                <span className="font-mono font-bold text-indigo-400">{id}</span>
                <CopyButton textToCopy={id} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Search Console Verification Tags */}
      <Card
        title="Google Search Console Verification"
        badge={
          tracking.gscVerificationTags.length > 0 ? (
            <Badge variant="pass" icon>Verified</Badge>
          ) : (
            <Badge variant="neutral">No Meta Tag</Badge>
          )
        }
      >
        {tracking.gscVerificationTags.length === 0 ? (
          <div className="text-xs text-slate-400 italic">
            No &lt;meta name="google-site-verification"&gt; tag found (site may be verified via DNS or Google Analytics).
          </div>
        ) : (
          <div className="space-y-1.5">
            {tracking.gscVerificationTags.map((tag, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                <span className="font-mono text-slate-300 truncate max-w-[340px]">{tag}</span>
                <CopyButton textToCopy={tag} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Other Tracking Pixels */}
      <Card title="Other Analytics & Conversion Tags">
        <div className="space-y-2 text-xs">
          {tracking.bingVerification && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Bing Webmaster:</span>
              <span className="font-mono text-slate-200">{tracking.bingVerification}</span>
            </div>
          )}
          {tracking.metaPixelIds.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Meta Pixel:</span>
              <span className="font-mono text-cyan-300">{tracking.metaPixelIds.join(', ')}</span>
            </div>
          )}
          {tracking.otherTrackers.length > 0 ? (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-slate-400 mr-1">Other Tools:</span>
              {tracking.otherTrackers.map((t) => (
                <Badge key={t} variant="accent" size="sm">{t}</Badge>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 italic">No additional marketing trackers identified.</div>
          )}
        </div>
      </Card>
    </div>
  );
};
