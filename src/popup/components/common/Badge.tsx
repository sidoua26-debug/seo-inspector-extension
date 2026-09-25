import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface BadgeProps {
  variant?: 'pass' | 'warning' | 'critical' | 'info' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'sm',
  children,
  icon = false,
  className = '',
}) => {
  const variantStyles = {
    pass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    critical: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    info: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
    accent: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide whitespace-nowrap transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && variant === 'pass' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
      {icon && variant === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
      {icon && variant === 'critical' && <AlertCircle className="w-3 h-3 text-rose-400" />}
      {icon && (variant === 'info' || variant === 'accent') && <Info className="w-3 h-3" />}
      {children}
    </span>
  );
};
