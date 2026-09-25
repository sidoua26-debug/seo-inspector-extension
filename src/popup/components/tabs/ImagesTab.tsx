import React, { useState } from 'react';
import { ImagesData } from '../../../types/seo';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import { Image as ImageIcon, AlertTriangle, AlertCircle, CheckCircle2, Maximize2, ShieldAlert } from 'lucide-react';

interface ImagesTabProps {
  images: ImagesData;
}

export const ImagesTab: React.FC<ImagesTabProps> = ({ images }) => {
  const [filter, setFilter] = useState<'all' | 'missing-alt' | 'broken' | 'no-dim'>('all');

  const filteredItems = images.items.filter((img) => {
    if (filter === 'missing-alt') return !img.hasAlt || img.isAltEmpty;
    if (filter === 'broken') return img.isBroken;
    if (filter === 'no-dim') return img.missingDimensions;
    return true;
  });

  return (
    <div className="space-y-3 pb-3">
      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2">
          <div className="text-[10px] text-slate-400 font-medium uppercase">Total Images</div>
          <div className="text-base font-bold text-slate-100 font-mono">{images.totalImages}</div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2">
          <div className="text-[10px] text-amber-400 font-medium uppercase">Missing Alt</div>
          <div className={`text-base font-bold font-mono ${images.missingAltCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {images.missingAltCount}
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2">
          <div className="text-[10px] text-rose-400 font-medium uppercase">Broken</div>
          <div className={`text-base font-bold font-mono ${images.brokenCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {images.brokenCount}
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-2">
          <div className="text-[10px] text-indigo-400 font-medium uppercase">CLS Risk</div>
          <div className={`text-base font-bold font-mono ${images.missingDimensionsCount > 0 ? 'text-indigo-400' : 'text-emerald-400'}`}>
            {images.missingDimensionsCount}
          </div>
        </div>
      </div>

      {/* Format Breakdown Badges */}
      <div className="flex items-center gap-1.5 flex-wrap px-1">
        <span className="text-[11px] text-slate-400 font-medium mr-1">Formats:</span>
        {Object.entries(images.formatCounts).map(([fmt, count]) => (
          <Badge key={fmt} variant="neutral" size="sm">
            {fmt.toUpperCase()}: <span className="text-cyan-400 font-mono font-bold ml-1">{String(count)}</span>
          </Badge>
        ))}
      </div>

      {/* Image Inventory */}
      <Card
        title="Image Inventory & Diagnostics"
        badge={<Badge variant="neutral">{filteredItems.length} Shown</Badge>}
        action={
          <div className="flex items-center gap-1 text-xs">
            {(['all', 'missing-alt', 'broken', 'no-dim'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  filter === f
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {f === 'all' ? 'All' : f === 'missing-alt' ? 'Missing Alt' : f === 'broken' ? 'Broken' : 'No Dims'}
              </button>
            ))}
          </div>
        }
      >
        <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 italic">No images matching this filter.</div>
          ) : (
            filteredItems.map((img, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
              >
                {/* Thumbnail Preview */}
                <div className="w-12 h-12 rounded bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {img.isBroken ? (
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  ) : (
                    <img
                      src={img.src}
                      alt={img.alt || ''}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[11px] text-cyan-300/90 truncate max-w-[280px]" title={img.src}>
                      {img.src.split('/').pop() || img.src}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {img.format.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="text-[11px] mt-1 text-slate-300">
                    <span className="text-slate-500 font-medium">Alt: </span>
                    {img.hasAlt ? (
                      img.isAltEmpty ? (
                        <span className="italic text-slate-400">[Empty: alt=""]</span>
                      ) : (
                        <span className="text-slate-200">"{img.alt}"</span>
                      )
                    ) : (
                      <span className="text-rose-400 font-semibold">[Missing Alt Attribute]</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-mono">
                    <span>
                      Natural: {img.naturalWidth}×{img.naturalHeight}px
                    </span>
                    <span>•</span>
                    <span>
                      Rendered: {img.renderedWidth}×{img.renderedHeight}px
                    </span>
                    {img.missingDimensions && (
                      <>
                        <span>•</span>
                        <span className="text-amber-400 font-sans font-medium">Missing width/height</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  <CopyButton textToCopy={img.src} iconOnly />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
