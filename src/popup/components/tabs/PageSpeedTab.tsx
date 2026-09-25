import React from 'react';
import { PageSpeedData } from '../../../types/seo';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Zap, ExternalLink, Activity, Server, Clock, HardDrive } from 'lucide-react';

interface PageSpeedTabProps {
  pagespeed: PageSpeedData;
  url: string;
}

export const PageSpeedTab: React.FC<PageSpeedTabProps> = ({ pagespeed, url }) => {
  const psiUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`;

  const getTtfbStatus = (ttfb: number) => {
    if (ttfb <= 0) return { label: 'Cached', variant: 'pass' as const };
    if (ttfb < 300) return { label: 'Fast (<300ms)', variant: 'pass' as const };
    if (ttfb < 800) return { label: 'Average', variant: 'warning' as const };
    return { label: 'Slow (>800ms)', variant: 'critical' as const };
  };

  const ttfbStatus = getTtfbStatus(pagespeed.ttfb);

  return (
    <div className="space-y-3 pb-3">
      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${ttfbStatus.variant === 'pass' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <Server className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">TTFB</div>
            <div className="text-sm font-semibold text-slate-100 font-mono">
              {pagespeed.ttfb > 0 ? `${pagespeed.ttfb} ms` : 'Cached'}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">DOM Ready</div>
            <div className="text-sm font-semibold text-slate-100 font-mono">
              {pagespeed.domContentLoaded > 0 ? `${pagespeed.domContentLoaded} ms` : 'N/A'}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <HardDrive className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Transfer Size</div>
            <div className="text-sm font-semibold text-slate-100 font-mono">
              {pagespeed.totalTransferSizeKb > 0 ? `${pagespeed.totalTransferSizeKb} KB` : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* External PageSpeed Insights Launcher */}
      <a
        href={psiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-300 text-xs font-semibold shadow-sm transition-all"
      >
        <Zap className="w-4 h-4 text-cyan-400" />
        <span>Run Full Google PageSpeed Insights Audit</span>
        <ExternalLink className="w-3.5 h-3.5 text-cyan-400 ml-1" />
      </a>

      {/* Navigation Timing Waterfall Bars */}
      <Card title="Navigation Timing Breakdown (Browser Performance)">
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">DNS Lookup:</span>
            <span className="font-mono">{pagespeed.dnsTime} ms</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">TCP Handshake:</span>
            <span className="font-mono">{pagespeed.tcpTime} ms</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">TLS Negotiation:</span>
            <span className="font-mono">{pagespeed.tlsTime} ms</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Time to First Byte (TTFB):</span>
            <span className="font-mono font-bold text-cyan-400">{pagespeed.ttfb} ms</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">DOM Interactive:</span>
            <span className="font-mono">{pagespeed.domInteractive} ms</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Complete Load Event:</span>
            <span className="font-mono">{pagespeed.loadTime} ms</span>
          </div>
        </div>
      </Card>

      {/* Resource Breakdown Table */}
      <Card
        title="Page Resources Breakdown"
        badge={<Badge variant="neutral">{pagespeed.totalResources} Requests</Badge>}
      >
        <div className="space-y-2">
          {pagespeed.resourceBreakdown.map((res, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-800 last:border-0">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-slate-200">{res.type}</span>
                <span className="text-[11px] text-slate-400">({res.count} requests)</span>
              </div>
              <span className="font-mono text-cyan-300">{res.sizeKb} KB</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
