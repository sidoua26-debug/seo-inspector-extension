import React from 'react';
import { TabId } from '../../types/seo';
import {
  LayoutDashboard,
  FileText,
  Link2,
  Globe,
  Image as ImageIcon,
  Code2,
  Zap,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';

interface TabNavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  issueCounts?: {
    critical: number;
    warning: number;
  };
}

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onSelectTab,
  issueCounts,
}) => {
  const totalIssueAlerts = (issueCounts?.critical || 0) + (issueCounts?.warning || 0);

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'links', label: 'Links', icon: Link2 },
    { id: 'hreflangs', label: 'Hreflangs', icon: Globe },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'schema', label: 'Structured Data', icon: Code2 },
    { id: 'pagespeed', label: 'PageSpeed', icon: Zap },
    { id: 'tracking', label: 'GSC/GA4', icon: BarChart3 },
    { id: 'issues', label: 'Issues', icon: AlertTriangle, badge: totalIssueAlerts },
  ];

  return (
    <nav className="flex items-center px-2 py-1.5 bg-slate-900 border-b border-slate-800 gap-1 overflow-x-auto no-scrollbar shrink-0 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono ${
                  issueCounts?.critical && issueCounts.critical > 0
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
