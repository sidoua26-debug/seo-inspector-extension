import React, { useState } from 'react';
import { ContentData } from '../../../types/seo';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import { FileText, Clock, Hash, AlertTriangle, Layers, AlignLeft } from 'lucide-react';

interface ContentTabProps {
  content: ContentData;
}

export const ContentTab: React.FC<ContentTabProps> = ({ content }) => {
  const [headingFilter, setHeadingFilter] = useState<string>('all');
  const [keywordTab, setKeywordTab] = useState<'1-word' | '2-word' | '3-word'>('1-word');

  const filteredHeadings = content.headings.filter((h) => {
    if (headingFilter === 'all') return true;
    return h.tag.toLowerCase() === headingFilter.toLowerCase();
  });

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'H1':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'H2':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'H3':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'H4':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'H5':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      case 'H6':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-3 pb-3">
      {/* Content Stats Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Word Count</div>
            <div className="text-sm font-semibold text-slate-100 font-mono">
              {content.wordCount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <AlignLeft className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Text / Code Ratio</div>
            <div className="text-sm font-semibold text-slate-100 font-mono flex items-center gap-1">
              <span>{content.textToCodeRatio}%</span>
              <span className={`text-[10px] font-normal ${content.textToCodeRatio >= 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {content.textToCodeRatio >= 10 ? '(Good)' : '(Low)'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Reading Time</div>
            <div className="text-sm font-semibold text-slate-100 font-mono">
              ~{content.readingTimeMinutes} min
            </div>
          </div>
        </div>
      </div>

      {/* Heading Structure Alerts */}
      {content.headingIssues.length > 0 && (
        <div className="space-y-1.5">
          {content.headingIssues.map((issue, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{issue.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Heading Summary & Filter */}
      <Card
        title="Heading Structure (H1-H6 Tree)"
        badge={<Badge variant="neutral">{content.headings.length} Total</Badge>}
        action={
          <div className="flex items-center gap-1 text-xs">
            {['all', 'h1', 'h2', 'h3'].map((tag) => (
              <button
                key={tag}
                onClick={() => setHeadingFilter(tag)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  headingFilter === tag
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {tag.toUpperCase()}
              </button>
            ))}
          </div>
        }
      >
        {/* Heading Count Pills */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-700/60 text-xs">
          {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((h) => {
            const count = content.headingCounts[h];
            return (
              <div key={h} className="text-center">
                <span className="text-[10px] uppercase text-slate-400 block font-semibold">{h}</span>
                <span className={`font-mono text-xs font-bold ${count > 0 ? 'text-slate-100' : 'text-slate-500'}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Headings Tree Scroll */}
        <div className="max-h-[180px] overflow-y-auto space-y-1.5 pr-1">
          {filteredHeadings.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-400 italic">No headings match this filter.</div>
          ) : (
            filteredHeadings.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-1.5 rounded bg-slate-900/50 hover:bg-slate-900 border border-slate-800 text-xs transition-colors"
                style={{ paddingLeft: `${Math.max(6, (h.level - 1) * 16 + 6)}px` }}
              >
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border shrink-0 ${getTagColor(h.tag)}`}>
                  {h.tag}
                </span>
                <span className="text-slate-200 leading-snug break-words flex-1 font-medium">
                  {h.text}
                </span>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {h.charCount}c
                </span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Keyword Density */}
      <Card
        title="Keyword Density"
        action={
          <div className="flex items-center gap-1">
            {(['1-word', '2-word', '3-word'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setKeywordTab(tab)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  keywordTab === tab
                    ? 'bg-slate-700 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700/60 pb-1 text-[11px]">
                <th className="py-1 font-medium">Keyword / Phrase</th>
                <th className="py-1 font-medium text-center">Count</th>
                <th className="py-1 font-medium text-right">Density</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {keywordTab === '1-word' &&
                content.topSingleWords.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-700/30">
                    <td className="py-1.5 font-medium text-slate-200">{kw.keyword}</td>
                    <td className="py-1.5 text-center font-mono text-slate-400">{kw.count}</td>
                    <td className="py-1.5 text-right font-mono text-cyan-400 font-semibold">{kw.density}%</td>
                  </tr>
                ))}
              {keywordTab === '2-word' &&
                content.topTwoWords.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-700/30">
                    <td className="py-1.5 font-medium text-slate-200">{kw.keyword}</td>
                    <td className="py-1.5 text-center font-mono text-slate-400">{kw.count}</td>
                    <td className="py-1.5 text-right font-mono text-cyan-400 font-semibold">{kw.density}%</td>
                  </tr>
                ))}
              {keywordTab === '3-word' &&
                content.topThreeWords.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-700/30">
                    <td className="py-1.5 font-medium text-slate-200">{kw.keyword}</td>
                    <td className="py-1.5 text-center font-mono text-slate-400">{kw.count}</td>
                    <td className="py-1.5 text-right font-mono text-cyan-400 font-semibold">{kw.density}%</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
