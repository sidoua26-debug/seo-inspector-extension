import React, { useState } from 'react';
import {
  X,
  Sliders,
  FileSpreadsheet,
  Key,
  ShieldCheck,
  RotateCcw,
  Save,
  Check,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { SeoInspectorSettings } from '../../types/seo';

interface SettingsModalProps {
  settings: SeoInspectorSettings;
  onSave: (newSettings: SeoInspectorSettings) => void;
  onReset: () => void;
  onClose: () => void;
}

type SettingsSection = 'thresholds' | 'branding' | 'integrations' | 'diagnostics';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onReset,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('thresholds');
  const [formData, setFormData] = useState<SeoInspectorSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleChange = <K extends keyof SeoInspectorSettings>(
    key: K,
    value: SeoInspectorSettings[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (confirm('Reset all SEO Inspector settings back to default parameters?')) {
      onReset();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Sliders className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                SEO Inspector Settings
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Custom Calibration
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Calibrate audit thresholds, white-label reports, and API keys
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
            title="Close Settings (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Section Tabs */}
        <div className="flex items-center px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 gap-1 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveSection('thresholds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'thresholds'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Audit Thresholds</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('branding')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'branding'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>White-Label & Reports</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('integrations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'integrations'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Integrations & API</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('diagnostics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeSection === 'diagnostics'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Diagnostics</span>
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* SECTION 1: AUDIT THRESHOLDS */}
          {activeSection === 'thresholds' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-3">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                  <span>Metadata Character Bounds</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Min Title Length (chars)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={50}
                      value={formData.minTitleLength}
                      onChange={(e) => handleChange('minTitleLength', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Max Title Length (chars)
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={100}
                      value={formData.maxTitleLength}
                      onChange={(e) => handleChange('maxTitleLength', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Min Meta Description (chars)
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={100}
                      value={formData.minDescLength}
                      onChange={(e) => handleChange('minDescLength', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Max Meta Description (chars)
                    </label>
                    <input
                      type="number"
                      min={120}
                      max={240}
                      value={formData.maxDescLength}
                      onChange={(e) => handleChange('maxDescLength', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-3">
                <h3 className="font-semibold text-slate-200">Content & Layout Rules</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Min Text-to-Code Ratio (%)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={50}
                      value={formData.minTextToCodeRatio}
                      onChange={(e) => handleChange('minTextToCodeRatio', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Max Image File Size (KB warning)
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={1000}
                      value={formData.maxImageSizeKb}
                      onChange={(e) => handleChange('maxImageSizeKb', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-slate-300">Strict Heading Hierarchy (flag skipped levels H1→H3)</span>
                    <input
                      type="checkbox"
                      checked={formData.strictHeadingOrder}
                      onChange={(e) => handleChange('strictHeadingOrder', e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-slate-300">Flag Images Missing Alt Attributes</span>
                    <input
                      type="checkbox"
                      checked={formData.flagMissingAlt}
                      onChange={(e) => handleChange('flagMissingAlt', e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-slate-300">Flag Missing Image Width/Height (CLS Prevention)</span>
                    <input
                      type="checkbox"
                      checked={formData.flagMissingDimensions}
                      onChange={(e) => handleChange('flagMissingDimensions', e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: WHITE-LABEL & REPORTS */}
          {activeSection === 'branding' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="font-semibold text-slate-200">White-Label Client Reports</h3>
                </div>
                <p className="text-[11px] text-slate-400">
                  Add your agency credentials and auditor details to generated audit reports.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Auditor / Consultant Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Mercer"
                      value={formData.auditorName}
                      onChange={(e) => handleChange('auditorName', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Agency / Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Digital SEO Labs"
                      value={formData.agencyName}
                      onChange={(e) => handleChange('agencyName', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Default Export Format
                    </label>
                    <select
                      value={formData.defaultExportFormat}
                      onChange={(e) =>
                        handleChange('defaultExportFormat', e.target.value as 'markdown' | 'json')
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    >
                      <option value="markdown">Markdown (.md) - Ready for clients</option>
                      <option value="json">JSON (.json) - Machine readable</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.includePassingChecks}
                        onChange={(e) => handleChange('includePassingChecks', e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                      />
                      <span className="text-slate-300">Include passing checks in report</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: INTEGRATIONS & API */}
          {activeSection === 'integrations' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-3">
                <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span>Google PageSpeed Insights API Key (Optional)</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  By default, Core Web Vitals use client-side Performance API. Providing a PageSpeed
                  API key enables Google cloud-run synthetic audits with elevated quotas.
                </p>

                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    placeholder="AIzaSy..."
                    value={formData.googlePageSpeedApiKey || ''}
                    onChange={(e) => handleChange('googlePageSpeedApiKey', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono pr-20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1.5 text-[11px] text-slate-400 hover:text-slate-200 px-1.5 py-0.5"
                  >
                    {showApiKey ? 'Hide' : 'Reveal'}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-slate-300">
                      Auto-inspect DOM upon opening extension popup
                    </span>
                    <input
                      type="checkbox"
                      checked={formData.autoInspectOnOpen}
                      onChange={(e) => handleChange('autoInspectOnOpen', e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: DIAGNOSTICS & SYSTEM INFO */}
          {activeSection === 'diagnostics' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold text-slate-200">Extension Engine Diagnostics</h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase">Engine Version</span>
                    <span className="text-cyan-400 font-bold">1.0.0 (Production)</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase">Manifest Architecture</span>
                    <span className="text-emerald-400 font-bold">Manifest V3</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase">Storage Engine</span>
                    <span className="text-cyan-400">chrome.storage.sync</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase">DOM Analyzer</span>
                    <span className="text-emerald-400">100% Client-Side Local</span>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-lg text-slate-300 text-[11px] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero-Telemetry Privacy Guarantee</strong>: All metadata, heading structures,
                    and schema nodes are extracted directly inside tab memory. No external crawlers or
                    third-party tracking servers are contacted.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 bg-slate-900/90 -mx-5 -mb-5 px-5 py-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/80 text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-md shadow-cyan-950/50 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Preferences</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
