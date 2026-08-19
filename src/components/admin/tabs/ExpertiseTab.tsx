import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ExpertiseItem } from '../../../types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Eye, EyeOff, Layers } from 'lucide-react';

export const ExpertiseTab: React.FC = () => {
  const { data, adminToken, refreshPublicData } = usePortfolio();
  const [items, setItems] = useState<ExpertiseItem[]>(data.expertise);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleItemChange = (index: number, field: keyof ExpertiseItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleTagsChange = (index: number, tagsString: string) => {
    const tagsArray = tagsString.split(',').map(t => t.trim()).filter(Boolean);
    handleItemChange(index, 'tags', tagsArray);
  };

  const handleAddItem = () => {
    const newItem: ExpertiseItem = {
      id: `exp-${Date.now()}`,
      title: 'New Expertise Title',
      description: 'Description of capability...',
      tags: ['Applied Skill 1', 'Applied Skill 2'],
      evidenceStatement: 'Evidence statement of verified implementation...',
      iconName: 'Layers',
      sort_order: items.length + 1,
      is_published: true
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (confirm('Are you sure you want to delete this expertise card?')) {
      setItems(items.filter((_, i) => i !== index));
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
          section: 'expertise',
          data: items
        })
      });

      if (!res.ok) throw new Error('Failed to update expertise items');

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
      {/* Header */}
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-slate-950 py-3 z-10 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Expertise Domains & Evidence</h2>
          <p className="text-xs text-slate-400">Manage the 6 technical domain cards, tags, and evidence statements.</p>
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
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Domain</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 relative"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                  className="font-bold text-sm text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-80"
                  placeholder="Expertise Title"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleItemChange(index, 'is_published', !item.is_published)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                    item.is_published ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{item.is_published ? 'Published' : 'Draft / Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Evidence Statement (Real application proof)</label>
                <textarea
                  rows={2}
                  value={item.evidenceStatement}
                  onChange={(e) => handleItemChange(index, 'evidenceStatement', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Applied Domain Tags (Comma separated)</label>
                <input
                  type="text"
                  value={item.tags.join(', ')}
                  onChange={(e) => handleTagsChange(index, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Tag 1, Tag 2, Tag 3"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
