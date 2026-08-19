import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ImpactItem } from '../../../types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, HeartHandshake } from 'lucide-react';

export const ImpactTab: React.FC = () => {
  const { data, adminToken, refreshPublicData } = usePortfolio();
  const [impact, setImpact] = useState<ImpactItem[]>(data.impact);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImpactChange = (index: number, field: keyof ImpactItem, value: any) => {
    const updated = [...impact];
    updated[index] = { ...updated[index], [field]: value };
    setImpact(updated);
  };

  const handleAddImpact = () => {
    const newItem: ImpactItem = {
      id: `impact-${Date.now()}`,
      badge: 'PILLAR NAME',
      title: 'Initiative Title',
      description: 'Description of social value creation...',
      targetGroup: 'Youth & Underserved Communities'
    };
    setImpact([...impact, newItem]);
  };

  const handleRemoveImpact = (index: number) => {
    if (confirm('Delete this community impact item?')) {
      setImpact(impact.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
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
          section: 'impact',
          data: impact
        })
      });

      if (!res.ok) throw new Error('Failed to update impact section');

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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-slate-950 py-3 z-10 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Community & Social Impact</h2>
          <p className="text-xs text-slate-400">Manage impact pillars, digital empowerment initiatives, and target groups.</p>
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
            onClick={handleAddImpact}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Pillar</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Impact'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {impact.map((item, index) => (
          <div key={item.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={item.badge}
                  onChange={(e) => handleImpactChange(index, 'badge', e.target.value)}
                  className="font-mono text-xs font-bold text-emerald-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 w-44"
                  placeholder="BADGE / PILLAR"
                />
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleImpactChange(index, 'title', e.target.value)}
                  className="font-bold text-sm text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 w-72"
                  placeholder="Pillar Title"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveImpact(index)}
                className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Impact Narrative</label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleImpactChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Beneficiaries / Target Group</label>
                <input
                  type="text"
                  value={item.targetGroup}
                  onChange={(e) => handleImpactChange(index, 'targetGroup', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
