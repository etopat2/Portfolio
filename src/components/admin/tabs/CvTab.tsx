import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { CvContent } from '../../../types';
import { Save, CheckCircle2, AlertCircle, FileText, Eye, Download } from 'lucide-react';

export const CvTab: React.FC = () => {
  const { data, adminToken, refreshPublicData, setIsCvModalOpen } = usePortfolio();
  const [cv, setCv] = useState<CvContent>(data.cv);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setCv(prev => ({ ...prev, [name]: checked }));
    } else {
      setCv(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/update-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          section: 'cv',
          data: cv
        })
      });

      if (!res.ok) throw new Error('Failed to update CV configuration');

      setSaveSuccess(true);
      await refreshPublicData();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-slate-950 py-3 z-10 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Curriculum Vitae & Document Settings</h2>
          <p className="text-xs text-slate-400">Manage CV display title, version, custom download filename, and summary.</p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Saved!
            </span>
          )}
          {error && (
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {error}
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsCvModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview CV</span>
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save CV Settings'}</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          Document Metadata & Output Controls
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Display Title</label>
            <input
              type="text"
              name="displayTitle"
              value={cv.displayTitle}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Version Date</label>
            <input
              type="text"
              name="versionDate"
              value={cv.versionDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="e.g. August 2026"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Suggested Download Filename</label>
            <input
              type="text"
              name="downloadFilename"
              value={cv.downloadFilename}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Executive Summary on CV Document</label>
            <textarea
              name="summaryText"
              rows={4}
              value={cv.summaryText}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_published"
                checked={cv.is_published}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-300 font-semibold">
                Make CV Section publicly visible on website
              </span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};
