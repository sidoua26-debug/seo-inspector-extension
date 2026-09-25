import React from 'react';
import { RefreshCw, Download, Search, Check, Copy } from 'lucide-react';
import { SeoInspectorData } from '../../types/seo';
import { generateMarkdownReport, downloadFile } from '../../services/exportService';

interface HeaderProps {
  data: SeoInspectorData | null;
  loading: boolean;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({ data, loading, onRefresh }) => {
  const [copiedUrl, setCopiedUrl] = React.useState(false);

  const score = data?.healthScore ?? 0;

  const getScoreColor = (sc: number) => {
    if (sc >= 80) return 'text-emerald-400 stroke-emerald-500';
    if (sc >= 60) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const handleCopyUrl = () => {
    if (!data?.overview.url) return;
    navigator.clipboard.writeText(data.overview.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleExport = () => {
    if (!data) return;
    const md = generateMarkdownReport(data);
    downloadFile(md, `${data.overview.domain}-seo-audit.md`, 'text/markdown');
  };

  // SVG circle calculations for health score gauge
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <header className="px-3.5 py-2.5 bg-slate-900/95 border-b border-slate-800 shrink-0 select-none">
      <div className="flex items-center justify-between">
        {/* Brand & Active URL */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shrink-0 flex items-center justify-center shadow-md shadow-cyan-950/40">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Search className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-xs tracking-tight">SEO Inspector</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                v1.0
              </span>
            </div>

            {data?.overview.url ? (
              <button
                type="button"
                onClick={handleCopyUrl}
                className="text-[11px] text-slate-400 hover:text-slate-200 truncate flex items-center gap-1 max-w-[340px] text-left transition-colors font-mono"
                title={`Click to copy: ${data.overview.url}`}
              >
                <span className="truncate">{data.overview.url}</span>
                {copiedUrl ? (
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-500 shrink-0 hover:text-slate-300" />
                )}
              </button>
            ) : (
              <span className="text-[11px] text-slate-500 italic">No page loaded</span>
            )}
          </div>
        </div>

        {/* Health Score Gauge & Actions */}
        <div className="flex items-center gap-2.5 shrink-0 pl-2">
          {data && (
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-2 py-1 rounded-xl">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-10 h-10 transform -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3.5"
                    fill="transparent"
                    className="text-slate-700"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className={`transition-all duration-700 ease-out ${getScoreColor(score)}`}
                  />
                </svg>
                <span className={`absolute text-[11px] font-mono font-bold ${getScoreColor(score).split(' ')[0]}`}>
                  {score}
                </span>
              </div>

              <div className="pr-1 text-left hidden sm:block">
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Health</div>
                <div className={`text-[11px] font-bold ${getScoreColor(score).split(' ')[0]}`}>
                  {score >= 80 ? 'Good' : score >= 60 ? 'Fair' : 'Poor'}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Re-run Diagnostics"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={handleExport}
            disabled={!data}
            title="Export Report (Markdown)"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
