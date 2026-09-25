import React, { useState } from 'react';
import { StructuredDataInfo } from '../../../types/seo';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import { Code2, ExternalLink, AlertTriangle, AlertCircle, CheckCircle2, ChevronRight, ChevronDown } from 'lucide-react';

interface StructuredDataTabProps {
  schema: StructuredDataInfo;
  url: string;
}

export const StructuredDataTab: React.FC<StructuredDataTabProps> = ({ schema, url }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const richResultsUrl = `https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`;
  const schemaValidatorUrl = `https://validator.schema.org/#url=${encodeURIComponent(url)}`;

  return (
    <div className="space-y-3 pb-3">
      {/* Metric summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">JSON-LD Blocks</div>
            <div className="text-sm font-semibold text-slate-100 font-mono">{schema.totalSchemas}</div>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Detected Types</div>
            <div className="text-sm font-semibold text-slate-100 font-mono">{schema.detectedTypes.length}</div>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Microdata</div>
            <div className="text-sm font-semibold text-slate-100 font-mono">{schema.microdataCount}</div>
          </div>
        </div>
      </div>

      {/* External Validation Links */}
      <div className="flex gap-2">
        <a
          href={richResultsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-medium transition-all"
        >
          <span>Google Rich Results Test</span>
          <ExternalLink className="w-3 h-3 text-cyan-400" />
        </a>
        <a
          href={schemaValidatorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-medium transition-all"
        >
          <span>Schema.org Validator</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* Detected Types Pills */}
      {schema.detectedTypes.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap px-1">
          <span className="text-[11px] text-slate-400 font-medium mr-1">Entities:</span>
          {schema.detectedTypes.map((t) => (
            <Badge key={t} variant="accent" size="sm">
              @{t}
            </Badge>
          ))}
        </div>
      )}

      {/* Validation Issues Alert */}
      {schema.validationIssues.length > 0 && (
        <div className="space-y-1.5">
          {schema.validationIssues.map((v, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
                v.severity === 'critical'
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              }`}
            >
              {v.severity === 'critical' ? (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              )}
              <div>
                <span className="font-semibold mr-1">[{v.schemaType}]:</span>
                <span>{v.issue}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schema Raw Blocks */}
      <Card
        title="Schema JSON-LD Blocks"
        badge={<Badge variant="neutral">{schema.rawBlocks.length} Found</Badge>}
      >
        {schema.rawBlocks.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            <Code2 className="w-6 h-6 mx-auto mb-2 text-slate-500" />
            <p>No &lt;script type="application/ld+json"&gt; tags found on this page.</p>
            <p className="text-[11px] text-slate-500 mt-1">Add structured data to stand out in Google search snippets.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {schema.rawBlocks.map((block, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div key={idx} className="border border-slate-700/80 rounded-lg overflow-hidden bg-slate-900/60">
                  <div
                    onClick={() => toggleExpand(idx)}
                    className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-800/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-xs font-semibold text-slate-200">
                        Block #{block.index}: {block.types.join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {block.isValid ? (
                        <Badge variant="pass" size="sm">Valid JSON</Badge>
                      ) : (
                        <Badge variant="critical" size="sm">Invalid</Badge>
                      )}
                      <CopyButton textToCopy={block.rawJson} label="Copy JSON" />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-2.5 border-t border-slate-800 bg-slate-950 font-mono text-[11px] text-slate-300 max-h-[180px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-all">{block.rawJson}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
