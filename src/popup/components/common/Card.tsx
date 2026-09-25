import React from 'react';

interface CardProps {
  title?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  badge,
  action,
  children,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <div className={`bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm ${className}`}>
      {(title || badge || action) && (
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-800/90 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            {title && <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">{title}</h3>}
            {badge}
          </div>
          {action && <div className="flex items-center">{action}</div>}
        </div>
      )}
      <div className={`p-3.5 ${bodyClassName}`}>{children}</div>
    </div>
  );
};
