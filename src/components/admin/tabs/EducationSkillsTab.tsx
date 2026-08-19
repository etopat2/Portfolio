import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { EducationItem, SkillGroup, CertificationItem } from '../../../types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, GraduationCap, Code2, Award } from 'lucide-react';

export const EducationSkillsTab: React.FC = () => {
  const { data, adminToken, refreshPublicData } = usePortfolio();
  const [education, setEducation] = useState<EducationItem[]>(data.education);
  const [skills, setSkills] = useState<SkillGroup[]>(data.skills);
  const [certifications, setCertifications] = useState<CertificationItem[]>(data.certifications || []);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Education handlers
  const handleEduChange = (index: number, field: keyof EducationItem, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const handleAddEdu = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      program: 'New Degree / Program',
      institution: 'University / Institute',
      location: 'Kampala, Uganda',
      period: 'Period',
      status: 'Ongoing / Completed',
      details: 'Curricular highlights...'
    };
    setEducation([...education, newEdu]);
  };

  const handleRemoveEdu = (index: number) => {
    if (confirm('Delete this education entry?')) {
      setEducation(education.filter((_, i) => i !== index));
    }
  };

  // Skill group handlers
  const handleSkillGroupChange = (index: number, field: keyof SkillGroup, value: any) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };

  const handleSkillsListChange = (index: number, str: string) => {
    const arr = str.split(',').map(s => s.trim()).filter(Boolean);
    handleSkillGroupChange(index, 'skills', arr);
  };

  const handleAddSkillGroup = () => {
    const newGroup: SkillGroup = {
      id: `skill-${Date.now()}`,
      category: 'New Skill Category',
      skills: ['Skill 1', 'Skill 2']
    };
    setSkills([...skills, newGroup]);
  };

  const handleRemoveSkillGroup = (index: number) => {
    if (confirm('Delete this skill category?')) {
      setSkills(skills.filter((_, i) => i !== index));
    }
  };

  // Certifications handlers
  const handleCertChange = (index: number, field: keyof CertificationItem, value: any) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };

  const handleAddCert = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: 'New Certification Title',
      issuer: 'Issuing Body',
      issue_date: 'Year'
    };
    setCertifications([...certifications, newCert]);
  };

  const handleRemoveCert = (index: number) => {
    if (confirm('Delete this certification?')) {
      setCertifications(certifications.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // Save all 3 sections
      await Promise.all([
        fetch('/api/admin/update-section', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
          body: JSON.stringify({ section: 'education', data: education })
        }),
        fetch('/api/admin/update-section', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
          body: JSON.stringify({ section: 'skills', data: skills })
        }),
        fetch('/api/admin/update-section', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
          body: JSON.stringify({ section: 'certifications', data: certifications })
        })
      ]);

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
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-slate-950 py-3 z-10 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Education, Skills & Certifications</h2>
          <p className="text-xs text-slate-400">Manage academic degrees, working skill stack, and field recognition.</p>
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
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save All'}</span>
          </button>
        </div>
      </div>

      {/* Section 1: Education */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-500" />
            Academic Degrees & Formal Training
          </h3>
          <button
            type="button"
            onClick={handleAddEdu}
            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Degree</span>
          </button>
        </div>

        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={edu.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={edu.program}
                  onChange={(e) => handleEduChange(index, 'program', e.target.value)}
                  className="font-bold text-xs sm:text-sm text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 w-full max-w-sm"
                  placeholder="Program / Degree"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveEdu(index)}
                  className="p-1 text-rose-400 hover:bg-rose-950/40 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleEduChange(index, 'institution', e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 border border-slate-700 text-white"
                  placeholder="Institution"
                />
                <input
                  type="text"
                  value={edu.period}
                  onChange={(e) => handleEduChange(index, 'period', e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 border border-slate-700 text-white font-mono"
                  placeholder="Period (e.g. 2024–Present)"
                />
                <input
                  type="text"
                  value={edu.status}
                  onChange={(e) => handleEduChange(index, 'status', e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 border border-slate-700 text-white"
                  placeholder="Status (e.g. Ongoing / Current)"
                />
              </div>

              <textarea
                rows={2}
                value={edu.details}
                onChange={(e) => handleEduChange(index, 'details', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg text-xs bg-slate-800 border border-slate-700 text-white"
                placeholder="Academic focus and coursework highlights..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Skills Groups */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-teal-500" />
            Working Skill Groups & Stack
          </h3>
          <button
            type="button"
            onClick={handleAddSkillGroup}
            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill Group</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((grp, index) => (
            <div key={grp.id} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={grp.category}
                  onChange={(e) => handleSkillGroupChange(index, 'category', e.target.value)}
                  className="font-bold text-xs text-emerald-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700"
                  placeholder="Category Name"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSkillGroup(index)}
                  className="p-1 text-rose-400 hover:bg-rose-950/40 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Skills (Comma separated)</label>
                <textarea
                  rows={2}
                  value={grp.skills.join(', ')}
                  onChange={(e) => handleSkillsListChange(index, e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Certifications */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Certifications & Recognitions
          </h3>
          <button
            type="button"
            onClick={handleAddCert}
            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certificate</span>
          </button>
        </div>

        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <div key={cert.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center gap-3">
              <input
                type="text"
                value={cert.title}
                onChange={(e) => handleCertChange(index, 'title', e.target.value)}
                className="font-bold text-xs text-white bg-slate-800 px-2.5 py-1 rounded border border-slate-700 flex-1"
                placeholder="Certificate Title"
              />
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => handleCertChange(index, 'issuer', e.target.value)}
                className="text-xs text-slate-300 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 w-44"
                placeholder="Issuer"
              />
              <input
                type="text"
                value={cert.issue_date || ''}
                onChange={(e) => handleCertChange(index, 'issue_date', e.target.value)}
                className="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded border border-slate-700 w-24"
                placeholder="Date"
              />
              <button
                type="button"
                onClick={() => handleRemoveCert(index)}
                className="p-1 text-rose-400 hover:bg-rose-950/40 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
