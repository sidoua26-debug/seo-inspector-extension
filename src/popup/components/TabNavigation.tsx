import React, { useRef, useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
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
  shortLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  description: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onSelectTab,
  issueCounts,
}) => {
  const navRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const totalIssueAlerts = (issueCounts?.critical || 0) + (issueCounts?.warning || 0);

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, description: 'Meta, canonical, robots & status' },
    { id: 'content', label: 'Content', icon: FileText, description: 'Headings tree, word count & keywords' },
    { id: 'links', label: 'Links', icon: Link2, description: 'Internal vs external & nofollow audit' },
    { id: 'hreflangs', label: 'Hreflangs', icon: Globe, description: 'Language targeting & x-default checks' },
    { id: 'images', label: 'Images', icon: ImageIcon, description: 'Alt tags, dimensions & broken images' },
    { id: 'schema', label: 'Structured Data', shortLabel: 'Schema', icon: Code2, description: 'JSON-LD Schema.org extraction' },
    { id: 'pagespeed', label: 'PageSpeed', shortLabel: 'Speed', icon: Zap, description: 'Core Web Vitals & timing' },
    { id: 'tracking', label: 'GSC/GA4', icon: BarChart3, description: 'Analytics, GTM & verification tags' },
    { id: 'issues', label: 'Issues', icon: AlertTriangle, badge: totalIssueAlerts, description: 'Critical, warning & passed checklist' },
  ];

  const checkScroll = () => {
    if (!navRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  // Auto-scroll active tab into view when activeTab changes
  useEffect(() => {
    if (!navRef.current) return;
    const activeBtn = navRef.current.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    checkScroll();
  }, [activeTab]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!navRef.current) return;
    const offset = direction === 'left' ? -180 : 180;
    navRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkScroll, 250);
  };

  // Convert mouse wheel vertical scroll into horizontal tab scroll
  const handleWheel = (e: React.WheelEvent) => {
    if (!navRef.current) return;
    if (e.deltaY !== 0) {
      navRef.current.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  return (
    <div className="relative flex items-center bg-slate-900 border-b border-slate-800 shrink-0 select-none">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute left-0 z-20 h-full px-1.5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent flex items-center text-slate-400 hover:text-cyan-400 transition-colors"
          title="Scroll tabs left"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* 9 Tab Navigation (strictly 9 buttons inside <nav> for test and semantic compatibility) */}
      <nav
        ref={navRef}
        onScroll={checkScroll}
        onWheel={handleWheel}
        className="flex-1 flex items-center px-2 py-1.5 gap-1 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => onSelectTab(tab.id)}
              title={`${tab.label}: ${tab.description}`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-950/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
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

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute right-9 z-20 h-full px-1.5 bg-gradient-to-l from-slate-900 via-slate-900/90 to-transparent flex items-center text-slate-400 hover:text-cyan-400 transition-colors"
          title="Scroll tabs right"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Quick All-Tabs Selector Dropdown (outside nav) */}
      <div className="relative pr-2 shrink-0 z-30" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-[11px] ${
            isDropdownOpen
              ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent hover:border-slate-700'
          }`}
          title="View all 9 tabs quick menu"
          aria-label="All 9 Tabs menu"
        >
          <span className="font-mono text-[10px] font-semibold text-slate-300">Tabs</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-2 top-full mt-1 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-cyan-950/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>All 9 Diagnostic Tabs</span>
              <span className="text-cyan-400 font-mono">100% Reachable</span>
            </div>
            <div className="py-1 max-h-72 overflow-y-auto">
              {tabs.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(tab.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] text-slate-500 w-3">{idx + 1}.</span>
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate">{tab.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          {tab.badge}
                        </span>
                      )}
                      {isActive && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
