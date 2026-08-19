import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { SettingsContent } from '../../../types';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  ShieldAlert, 
  Globe, 
  Palette 
} from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { data, adminToken, refreshPublicData } = usePortfolio();
  const [settings, setSettings] = useState<SettingsContent>(data.settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleKeywordsChange = (str: string) => {
    const arr = str.split(',').map(s => s.trim()).filter(Boolean);
    setSettings(prev => ({ ...prev, metaKeywords: arr }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
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
          section: 'settings',
          data: settings
        })
      });

      if (!res.ok) throw new Error('Failed to update system settings');

      setSaveSuccess(true);
      await refreshPublicData();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to change password');
      }

      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleResetDefaults = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/admin/reset-defaults', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        await refreshPublicData();
        setShowResetModal(false);
        alert('All portfolio data has been reset to verified initial defaults.');
        window.location.reload();
      }
    } catch (err) {
      alert('Failed to reset defaults');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-slate-950 py-3 z-10 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-500" />
            System, SEO & Security Settings
          </h2>
          <p className="text-xs text-slate-400">Configure global metadata, administrative access, and verified defaults.</p>
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
        </div>
      </div>

      {/* SEO & Meta Config */}
      <form onSubmit={handleSaveSettings} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            SEO & Social Sharing Metadata
          </h3>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save SEO Settings'}</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Site Title</label>
            <input
              type="text"
              name="siteTitle"
              value={settings.siteTitle}
              onChange={handleSettingsChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description</label>
            <textarea
              name="metaDescription"
              rows={2}
              value={settings.metaDescription}
              onChange={handleSettingsChange}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Keywords (Comma separated)</label>
            <input
              type="text"
              value={settings.metaKeywords.join(', ')}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handleChangePassword} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-emerald-400" />
          Update Admin Security Password
        </h3>

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Password updated securely. Use your new password on next sign-in.</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{passwordError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">New Password (8+ chars)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isChangingPassword}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
        >
          <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isChangingPassword ? 'Hashing & Updating...' : 'Update Password'}</span>
        </button>
      </form>

      {/* Danger Zone / Reset to Defaults */}
      <div className="bg-rose-950/20 rounded-2xl border border-rose-900/40 p-6 space-y-4">
        <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Reset Portfolio to Verified Seed Defaults
        </h3>
        <p className="text-xs text-rose-200/80 leading-relaxed max-w-2xl">
          Restores all sections (profile, milestones, verified case studies, education, skills, and settings) back to Patrick Etomet's authenticated seed state.
        </p>

        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Data to Defaults</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center mx-auto border border-rose-800">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Reset to Verified Initial Defaults?</h4>
              <p className="text-xs text-slate-400 mt-1">
                This will overwrite any live edits with Patrick's verified default content.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleResetDefaults}
                disabled={isResetting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50"
              >
                {isResetting ? 'Restoring...' : 'Yes, Reset Defaults'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
