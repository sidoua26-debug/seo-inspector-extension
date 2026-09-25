import React, { useEffect, useState, useRef } from 'react';
import { SeoInspectorData, RawSeoExtractedData, TabId, SeoInspectorSettings, DEFAULT_SETTINGS } from '../types/seo';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { SettingsModal } from './components/SettingsModal';
import { OverviewTab } from './components/tabs/OverviewTab';
import { ContentTab } from './components/tabs/ContentTab';
import { LinksTab } from './components/tabs/LinksTab';
import { HreflangsTab } from './components/tabs/HreflangsTab';
import { ImagesTab } from './components/tabs/ImagesTab';
import { StructuredDataTab } from './components/tabs/StructuredDataTab';
import { PageSpeedTab } from './components/tabs/PageSpeedTab';
import { GscGa4Tab } from './components/tabs/GscGa4Tab';
import { IssuesTab } from './components/tabs/IssuesTab';
import { getMockInspectorData } from '../services/mockData';
import { runAuditEngine } from '../services/auditEngine';
import { getStoredSettings, saveStoredSettings, resetStoredSettings } from '../services/settingsService';
import { AlertCircle, Info, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [data, setData] = useState<SeoInspectorData | null>(null);
  const [rawExtracted, setRawExtracted] = useState<RawSeoExtractedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<SeoInspectorSettings>(DEFAULT_SETTINGS);

  // Load persistent user settings on mount
  useEffect(() => {
    getStoredSettings().then((loaded) => {
      setSettings(loaded);
    });
  }, []);

  const processInspectionData = (raw: RawSeoExtractedData, activeSettings: SeoInspectorSettings = settings) => {
    setRawExtracted(raw);
    const audit = runAuditEngine(raw, activeSettings);
    const full: SeoInspectorData = {
      ...raw,
      issues: audit.issues,
      healthScore: audit.score,
      scoreBreakdown: audit.scoreBreakdown,
    };
    setData(full);
  };

  const handleSaveSettings = async (newSettings: SeoInspectorSettings) => {
    const saved = await saveStoredSettings(newSettings);
    setSettings(saved);
    // Recalculate audit with updated user thresholds immediately
    if (rawExtracted) {
      processInspectionData(rawExtracted, saved);
    } else if (data) {
      processInspectionData(data, saved);
    }
  };

  const handleResetSettings = async () => {
    const res = await resetStoredSettings();
    setSettings(res);
    if (rawExtracted) {
      processInspectionData(rawExtracted, res);
    } else if (data) {
      processInspectionData(data, res);
    }
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);

    // Check if running inside Chrome extension environment
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab || !tab.id) {
          throw new Error('No active browser tab found.');
        }

        const tabUrl = tab.url || '';

        // Internal browser pages cannot be inspected via content scripts
        if (
          tabUrl.startsWith('chrome://') ||
          tabUrl.startsWith('chrome-extension://') ||
          tabUrl.startsWith('edge://') ||
          tabUrl.startsWith('about:')
        ) {
          console.warn('[SEO Inspector] Internal browser page. Loading demo data.');
          setIsPreviewMode(true);
          const mock = getMockInspectorData();
          processInspectionData(mock, settings);
          setLoading(false);
          return;
        }

        // Try sending message to existing content script
        chrome.tabs.sendMessage(tab.id, { action: 'RUN_INSPECTION' }, async (response) => {
          if (chrome.runtime.lastError || !response || !response.success) {
            // Need to inject extractor.js dynamically
            try {
              if (chrome.scripting && chrome.scripting.executeScript) {
                await chrome.scripting.executeScript({
                  target: { tabId: tab.id! },
                  files: ['extractor.js'],
                });

                // Wait 100ms and re-send message
                setTimeout(() => {
                  chrome.tabs.sendMessage(tab.id!, { action: 'RUN_INSPECTION' }, (retryRes) => {
                    if (retryRes && retryRes.success) {
                      processInspectionData(retryRes.data, settings);
                      setIsPreviewMode(false);
                    } else {
                      console.warn('[SEO Inspector] Injection response failed, falling back to mock.');
                      const mock = getMockInspectorData();
                      processInspectionData(mock, settings);
                      setIsPreviewMode(true);
                    }
                    setLoading(false);
                  });
                }, 100);
              } else {
                const mock = getMockInspectorData();
                processInspectionData(mock, settings);
                setIsPreviewMode(true);
                setLoading(false);
              }
            } catch (injectErr: any) {
              console.warn('[SEO Inspector] Script injection failed:', injectErr.message);
              const mock = getMockInspectorData();
              processInspectionData(mock, settings);
              setIsPreviewMode(true);
              setLoading(false);
            }
          } else {
            processInspectionData(response.data, settings);
            setIsPreviewMode(false);
            setLoading(false);
          }
        });
      } catch (err: any) {
        console.error('[SEO Inspector] Diagnostic error:', err);
        const mock = getMockInspectorData();
        processInspectionData(mock, settings);
        setIsPreviewMode(true);
        setLoading(false);
      }
    } else {
      // Standalone web / preview mode
      console.info('[SEO Inspector] Running outside Chrome extension environment, using rich mock data.');
      const mock = getMockInspectorData();
      processInspectionData(mock, settings);
      setIsPreviewMode(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-text overflow-hidden font-sans">
      {/* Top Header with Settings button */}
      <Header
        data={data}
        loading={loading}
        onRefresh={runDiagnostics}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSettingsOpen={isSettingsOpen}
        settings={settings}
      />

      {/* Preview mode notification if active */}
      {isPreviewMode && (
        <div className="px-3 py-1 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-300 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Preview Mode: Showing demo technical SEO diagnostics.</span>
          </div>
          <button
            onClick={runDiagnostics}
            className="text-[10px] uppercase font-bold text-amber-400 hover:text-amber-200"
          >
            Retry Tab
          </button>
        </div>
      )}

      {/* 9 Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        issueCounts={
          data
            ? {
                critical: data.scoreBreakdown.critical,
                warning: data.scoreBreakdown.warning,
              }
            : undefined
        }
      />

      {/* Tab Content Area */}
      <main className="flex-1 overflow-y-auto px-3.5 pt-3 scroll-smooth">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="w-7 h-7 animate-spin text-cyan-400 mb-3" />
            <p className="text-xs font-semibold text-slate-200">Inspecting DOM & Performance...</p>
            <p className="text-[11px] text-slate-500 mt-1">Analyzing metadata, links, headings & schemas</p>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
            <p className="text-xs font-semibold text-rose-300">{error}</p>
            <button
              onClick={runDiagnostics}
              className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700"
            >
              Try Again
            </button>
          </div>
        ) : data ? (
          <>
            {activeTab === 'overview' && <OverviewTab overview={data.overview} />}
            {activeTab === 'content' && <ContentTab content={data.content} />}
            {activeTab === 'links' && <LinksTab links={data.links} />}
            {activeTab === 'hreflangs' && <HreflangsTab hreflangs={data.hreflangs} />}
            {activeTab === 'images' && <ImagesTab images={data.images} />}
            {activeTab === 'schema' && <StructuredDataTab schema={data.schema} url={data.overview.url} />}
            {activeTab === 'pagespeed' && <PageSpeedTab pagespeed={data.pagespeed} url={data.overview.url} />}
            {activeTab === 'tracking' && <GscGa4Tab tracking={data.tracking} url={data.overview.url} />}
            {activeTab === 'issues' && <IssuesTab issues={data.issues} fullData={data} />}
          </>
        ) : null}
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={handleSaveSettings}
          onReset={handleResetSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};
