import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ProfileContent } from '../../../types';
import { Save, CheckCircle2, AlertCircle, User, Phone, Globe, Image as ImageIcon } from 'lucide-react';
import { ImageUploadWidget } from '../ImageUploadWidget';

export const ProfileTab: React.FC = () => {
  const { data, adminToken, refreshPublicData } = usePortfolio();
  const [profile, setProfile] = useState<ProfileContent>(data.profile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socials.')) {
      const socialKey = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        socials: {
          ...prev.socials,
          [socialKey]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (newUrl: string) => {
    setProfile(prev => ({ ...prev, avatarUrl: newUrl }));
  };

  const handleOgImageChange = (newUrl: string) => {
    setProfile(prev => ({ ...prev, openGraphImage: newUrl }));
  };

  const handleStoryChange = (index: number, value: string) => {
    const updated = [...(profile.aboutStory || [])];
    updated[index] = value;
    setProfile(prev => ({ ...prev, aboutStory: updated }));
  };

  const handleAddStoryParagraph = () => {
    setProfile(prev => ({
      ...prev,
      aboutStory: [...(prev.aboutStory || []), 'New story paragraph...']
    }));
  };

  const handleRemoveStoryParagraph = (index: number) => {
    setProfile(prev => ({
      ...prev,
      aboutStory: prev.aboutStory.filter((_, i) => i !== index)
    }));
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
          section: 'profile',
          data: profile
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update profile section');
      }

      setSaveSuccess(true);
      await refreshPublicData();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      
      {/* Header & Save Button */}
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-[#020617] py-3 z-10 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Public Profile, Portrait & Identity</h2>
          <p className="text-xs text-slate-400">Manage official portrait image, headlines, contact details, and authentic story.</p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-[#10B981] flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              Saved successfully!
            </span>
          )}
          {error && (
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {error}
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-bold text-[#020617] bg-[#10B981] hover:bg-[#0D9488] shadow-md disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {/* Official Portrait & Media Management */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#10B981]" />
          Official Portrait & Social Images
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ImageUploadWidget
            label="Official Profile Portrait"
            description="Displayed on the Hero section, About card, and Header badge."
            currentUrl={profile.avatarUrl || '/profile.jpg'}
            defaultUrl="/profile.jpg"
            aspectRatio="square"
            onImageChange={handleAvatarChange}
          />

          <ImageUploadWidget
            label="OpenGraph / Social Card Image"
            description="Preview image shown when sharing the portfolio URL on LinkedIn, WhatsApp, or Twitter."
            currentUrl={profile.openGraphImage || '/profile.jpg'}
            defaultUrl="/profile.jpg"
            aspectRatio="video"
            onImageChange={handleOgImageChange}
          />
        </div>
      </div>

      {/* Core Identity */}
      <div className="bg-[#0B1221] rounded-lg border border-slate-800 p-6 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-[#10B981]" />
          Primary Identity & Headlines
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Monogram Mark (for avatar fallback)</label>
            <input
              type="text"
              name="monogram"
              value={profile.monogram}
              onChange={handleChange}
              maxLength={4}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Professional Headline</label>
            <input
              type="text"
              name="headline"
              value={profile.headline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Supporting Headline / Identity</label>
            <input
              type="text"
              name="supportingHeadline"
              value={profile.supportingHeadline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Verified Contact Details */}
      <div className="bg-[#0B1221] rounded-lg border border-slate-800 p-6 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#10B981]" />
          Verified Contact Details & WhatsApp
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Public Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location Display</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Telephone / WhatsApp Display</label>
            <input
              type="text"
              name="phoneDisplay"
              value={profile.phoneDisplay}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp International Number (for wa.me links)</label>
            <input
              type="text"
              name="whatsappInternational"
              value={profile.whatsappInternational}
              onChange={handleChange}
              placeholder="256791170164"
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Prefilled Message</label>
            <input
              type="text"
              name="whatsappMessage"
              value={profile.whatsappMessage}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-[#0B1221] rounded-lg border border-slate-800 p-6 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#10B981]" />
          Verified Social Profiles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
            <input
              type="url"
              name="socials.linkedin"
              value={profile.socials.linkedin}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">X / Twitter URL</label>
            <input
              type="url"
              name="socials.x"
              value={profile.socials.x}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Facebook URL</label>
            <input
              type="url"
              name="socials.facebook"
              value={profile.socials.facebook}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
            <input
              type="url"
              name="socials.github"
              value={profile.socials.github || ''}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Hero & About Copy */}
      <div className="bg-[#0B1221] rounded-lg border border-slate-800 p-6 space-y-5">
        <h3 className="text-base font-bold text-white">Hero & Authentic Bio Story</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Eyebrow Text</label>
            <input
              type="text"
              name="heroEyebrow"
              value={profile.heroEyebrow}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Main Headline</label>
            <input
              type="text"
              name="heroHeadline"
              value={profile.heroHeadline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hero Supporting Copy</label>
            <textarea
              name="heroCopy"
              rows={3}
              value={profile.heroCopy}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">About Section Theme</label>
            <input
              type="text"
              name="aboutTheme"
              value={profile.aboutTheme}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">About Story Narrative Paragraphs</label>
              <button
                type="button"
                onClick={handleAddStoryParagraph}
                className="text-xs text-[#10B981] hover:text-emerald-400 font-semibold"
              >
                + Add Paragraph
              </button>
            </div>
            <div className="space-y-3">
              {profile.aboutStory?.map((para, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <textarea
                    rows={2}
                    value={para}
                    onChange={(e) => handleStoryChange(idx, e.target.value)}
                    className="w-full px-3.5 py-2 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStoryParagraph(idx)}
                    className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-sm text-xs"
                    title="Remove paragraph"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </form>
  );
};
