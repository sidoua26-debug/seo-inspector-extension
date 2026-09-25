import React, { useState } from 'react';
import { AuditIssue, IssueSeverity, SeoInspectorData } from '../../../types/seo';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { AlertCircle, AlertTriangle, CheckCircle2, Download, Filter, FileText } from 'lucide-react';
import { generateMarkdownReport, downloadFile } from '../../../services/exportService';

interface IssuesTabProps {
  issues: AuditIssue[];
  fullData: SeoInspectorData;
}

export const IssuesTab: React.FC<IssuesTabProps> = ({ issues, fullData }) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'pass'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredIssues = issues.filter((iss) => {
    if (severityFilter !== 'all' && iss.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && iss.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    return true;
  });

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const passCount = issues.filter((i) => i.severity === 'pass').length;

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport(fullData);
    downloadFile(md, `${fullData.overview.domain}-seo-audit.md`, 'text/markdown');
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(fullData, null, 2);
    downloadFile(jsonStr, `${fullData.overview.domain}-seo-audit.json`, 'application/json');
  };

  return (
    <div className="space-y-3 pb-3">
      {/* Counters & Filter Buttons */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <button
          onClick={() => setSeverityFilter(severityFilter === 'critical' ? 'all' : 'critical')}
          className={`p-2 rounded-xl border transition-all text-left flex items-center justify-between ${
            severityFilter === 'critical'
              ? 'bg-rose-500/20 border-rose-500/60'
              : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700/80'
          }`}
        >
          <div>
            <div className="text-[10px] text-rose-400 font-medium uppercase tracking-wider">Critical</div>
            <div className="text-base font-bold text-rose-400 font-mono">{criticalCount}</div>
          </div>
          <AlertCircle className="w-5 h-5 text-rose-400 opacity-80" />
        </button>

        <button
          onClick={() => setSeverityFilter(severityFilter === 'warning' ? 'all' : 'warning')}
          className={`p-2 rounded-xl border transition-all text-left flex items-center justify-between ${
            severityFilter === 'warning'
              ? 'bg-amber-500/20 border-amber-500/60'
              : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700/80'
          }`}
        >
          <div>
            <div className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">Warnings</div>
            <div className="text-base font-bold text-amber-400 font-mono">{warningCount}</div>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-400 opacity-80" />
        </button>

        <button
          onClick={() => setSeverityFilter(severityFilter === 'pass' ? 'all' : 'pass')}
          className={`p-2 rounded-xl border transition-all text-left flex items-center justify-between ${
            severityFilter === 'pass'
              ? 'bg-emerald-500/20 border-emerald-500/60'
              : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700/80'
          }`}
        >
          <div>
            <div className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Passed</div>
            <div className="text-base font-bold text-emerald-400 font-mono">{passCount}</div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-80" />
        </button>
      </div>

      {/* Export Report Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleDownloadMarkdown}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Markdown Report</span>
        </button>
        <button
          onClick={handleDownloadJson}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Export JSON Audit</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
        {['all', 'Overview', 'Content', 'Links', 'Hreflang', 'Images', 'Schema', 'Performance', 'Tracking'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
              categoryFilter === cat
                ? 'bg-cyan-500 text-slate-950 font-semibold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <Card
        title="Audit Results & Fix Recommendations"
        badge={<Badge variant="neutral">{filteredIssues.length} Found</Badge>}
      >
        <div className="max-h-[250px] overflow-y-auto space-y-2 pr-1">
          {filteredIssues.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 italic">No issues match the selected filters.</div>
          ) : (
            filteredIssues.map((iss) => (
              <div
                key={iss.id}
                className={`p-2.5 rounded-lg border text-xs transition-colors ${
                  iss.severity === 'critical'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : iss.severity === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-emerald-950/20 border-emerald-500/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                    {iss.severity === 'critical' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    {iss.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                    {iss.severity === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>{iss.title}</span>
                  </div>
                  <Badge variant="neutral" size="sm">{iss.category}</Badge>
                </div>

                <div className="mt-1.5 text-slate-300 leading-relaxed text-[11px]">
                  {iss.description}
                </div>

                {iss.severity !== 'pass' && (
                  <div className="mt-2 p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                    <span className="font-semibold text-cyan-400 mr-1">Recommendation:</span>
                    <span>{iss.recommendation}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
