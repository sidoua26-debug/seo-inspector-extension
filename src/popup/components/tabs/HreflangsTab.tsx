import React from 'react';
import { HreflangsData } from '../../../types/seo';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import { Globe, AlertTriangle, CheckCircle2, Languages } from 'lucide-react';

interface HreflangsTabProps {
  hreflangs: HreflangsData;
}

export const HreflangsTab: React.FC<HreflangsTabProps> = ({ hreflangs }) => {
  return (
    <div className="space-y-3 pb-3">
      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Languages className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">HTML Lang</div>
            <div className="text-sm font-semibold text-slate-100 font-mono truncate">
              {hreflangs.htmlLang ? `lang="${hreflangs.htmlLang}"` : <span className="text-amber-400">Missing</span>}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${hreflangs.hasXDefault ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}`}>
            <Globe className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">x-default</div>
            <div className="text-sm font-semibold text-slate-100 truncate">
              {hreflangs.hasXDefault ? (
                <span className="text-emerald-400">Present</span>
              ) : (
                <span className="text-slate-400">Not Configured</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${hreflangs.hasSelfReference ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Self Reference</div>
            <div className="text-sm font-semibold text-slate-100 truncate">
              {hreflangs.hasSelfReference ? (
                <span className="text-emerald-400">Verified</span>
              ) : hreflangs.totalHreflangs > 0 ? (
                <span className="text-amber-400">Missing</span>
              ) : (
                <span className="text-slate-400">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Issues Alerts */}
      {hreflangs.issues.length > 0 && (
        <div className="space-y-1.5">
          {hreflangs.issues.map((iss, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{iss.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hreflangs List */}
      <Card
        title="Alternate Language Targets"
        badge={<Badge variant="neutral">{hreflangs.totalHreflangs} Tag(s)</Badge>}
      >
        {hreflangs.totalHreflangs === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            <Globe className="w-6 h-6 mx-auto mb-2 text-slate-500" />
            <p>No &lt;link rel="alternate" hreflang="..."&gt; tags found on this page.</p>
            <p className="text-[11px] text-slate-500 mt-1">If this site is single-language only, hreflangs are not required.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {hreflangs.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] shrink-0">
                    {item.lang}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-slate-300 truncate text-[11px]">
                      {item.href}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  {item.isSelf && <Badge variant="pass">Current Page</Badge>}
                  {item.isXDefault && <Badge variant="accent">Fallback</Badge>}
                  <CopyButton textToCopy={item.href} iconOnly />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
