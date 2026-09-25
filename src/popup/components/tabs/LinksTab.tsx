import React, { useState } from 'react';
import { LinksData } from '../../../types/seo';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import { Link2, ExternalLink, ArrowDownLeft, ShieldAlert, Copy, Download, Search } from 'lucide-react';
import { downloadFile } from '../../../services/exportService';

interface LinksTabProps {
  links: LinksData;
}

export const LinksTab: React.FC<LinksTabProps> = ({ links }) => {
  const [filter, setFilter] = useState<'all' | 'internal' | 'external' | 'nofollow' | 'insecure'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const filteredLinks = links.links.filter((l) => {
    // Search query
    if (searchTerm) {
      const matchSearch =
        l.href.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.text.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchSearch) return false;
    }

    if (filter === 'internal') return l.isInternal;
    if (filter === 'external') return l.isExternal;
    if (filter === 'nofollow') return l.isNofollow;
    if (filter === 'insecure') return !l.isSecure;
    return true;
  });

  const handleCopyAllLinks = () => {
    const textList = links.links.map((l) => l.href).join('\n');
    navigator.clipboard.writeText(textList);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleExportCsv = () => {
    let csv = 'URL,Anchor Text,Type,Rel,Target,Secure\n';
    links.links.forEach((l) => {
      const cleanText = `"${l.text.replace(/"/g, '""')}"`;
      const cleanUrl = `"${l.href.replace(/"/g, '""')}"`;
      const type = l.isInternal ? 'Internal' : 'External';
      const rel = `"${l.rel}"`;
      csv += `${cleanUrl},${cleanText},${type},${rel},${l.target || '_self'},${l.isSecure ? 'Yes' : 'No'}\n`;
    });
    downloadFile(csv, 'page-links.csv', 'text/csv');
  };

  return (
    <div className="space-y-3 pb-3">
      {/* Metric Counters */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2">
          <div className="text-[10px] text-slate-400 font-medium uppercase">Total Links</div>
          <div className="text-base font-bold text-slate-100 font-mono">{links.totalLinks}</div>
        </div>
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2">
          <div className="text-[10px] text-cyan-400 font-medium uppercase">Internal</div>
          <div className="text-base font-bold text-cyan-300 font-mono">{links.internalCount}</div>
        </div>
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2">
          <div className="text-[10px] text-indigo-400 font-medium uppercase">External</div>
          <div className="text-base font-bold text-indigo-300 font-mono">{links.externalCount}</div>
        </div>
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2">
          <div className="text-[10px] text-amber-400 font-medium uppercase">Nofollow</div>
          <div className="text-base font-bold text-amber-300 font-mono">{links.nofollowCount}</div>
        </div>
      </div>

      {/* Warning Badges if insecure or empty anchors */}
      {(links.insecureCount > 0 || links.emptyAnchorCount > 0) && (
        <div className="flex gap-2">
          {links.insecureCount > 0 && (
            <div className="flex-1 flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{links.insecureCount} insecure HTTP links</span>
            </div>
          )}
          {links.emptyAnchorCount > 0 && (
            <div className="flex-1 flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <Link2 className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{links.emptyAnchorCount} links missing anchor text</span>
            </div>
          )}
        </div>
      )}

      {/* Main Links Container */}
      <Card
        title="Links Directory"
        badge={<Badge variant="neutral">{filteredLinks.length} Shown</Badge>}
        action={
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyAllLinks}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border transition-colors ${
                copiedAll
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-700/80 hover:bg-slate-700 text-slate-200 border-slate-600/60'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedAll ? 'Copied!' : 'Copy All Links'}</span>
            </button>
            <button
              onClick={handleExportCsv}
              title="Download CSV"
              className="p-1 rounded text-slate-300 hover:text-white bg-slate-700/80 hover:bg-slate-700 border border-slate-600/60"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      >
        {/* Search & Filter Toolbar */}
        <div className="space-y-2 mb-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search links by URL or anchor text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {(['all', 'internal', 'external', 'nofollow', 'insecure'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Links List */}
        <div className="max-h-[230px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-800">
          {filteredLinks.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 italic">No links match your criteria.</div>
          ) : (
            filteredLinks.map((l, idx) => (
              <div key={idx} className="pt-1.5 first:pt-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-slate-200 truncate flex items-center gap-1.5">
                      {l.isExternal ? (
                        <ExternalLink className="w-3 h-3 text-indigo-400 shrink-0" />
                      ) : (
                        <ArrowDownLeft className="w-3 h-3 text-cyan-400 shrink-0" />
                      )}
                      <span className="truncate">{l.text}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                      {l.href}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    {l.isNofollow && <Badge variant="warning">nofollow</Badge>}
                    {l.isSponsored && <Badge variant="accent">sponsored</Badge>}
                    {!l.isSecure && <Badge variant="critical">HTTP</Badge>}
                    <CopyButton textToCopy={l.href} iconOnly />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
