import React, { useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ProjectItem, ProjectCategory } from '../../../types';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Eye, EyeOff, Briefcase, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { ImageUploadWidget } from '../ImageUploadWidget';

const CATEGORIES: ProjectCategory[] = [
  'Systems',
  'Web/PWA',
  'Data',
  'Social Impact',
  'Media',
  'Concept/Prototype'
];

export const ProjectsTab: React.FC = () => {
  const { data, adminToken, refreshPublicData } = usePortfolio();
  const [projects, setProjects] = useState<ProjectItem[]>(data.projects);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProjectChange = (index: number, field: keyof ProjectItem, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleTechnologiesChange = (index: number, techString: string) => {
    const arr = techString.split(',').map(t => t.trim()).filter(Boolean);
    handleProjectChange(index, 'technologies', arr);
  };

  const handleOutcomesChange = (index: number, outcomeString: string) => {
    const arr = outcomeString.split('\n').map(t => t.trim()).filter(Boolean);
    handleProjectChange(index, 'outcomes', arr);
  };

  const handleAddProject = () => {
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'New Project Title',
      subtitle: 'Short project subtitle',
      slug: `new-project-${Date.now()}`,
      category: 'Systems',
      status: 'In Development',
      role: 'Lead Systems Developer & Analyst',
      confidentiality_level: 'Safe Public Summary',
      summary: 'Summary of the project...',
      challenge: 'Problem statement...',
      approach: 'Methodology and strategy...',
      contribution: "Patrick's specific technical and analytical contributions...",
      technologies: ['TypeScript', 'React', 'Node.js'],
      outcomes: ['Key outcome 1'],
      image_url: '',
      external_url: '',
      sort_order: projects.length + 1,
      is_published: true
    };
    setProjects([...projects, newProject]);
  };

  const handleRemoveProject = (index: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter((_, i) => i !== index));
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
          section: 'projects',
          data: projects
        })
      });

      if (!res.ok) throw new Error('Failed to update projects');

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
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-[#020617] py-3 z-10 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white">Projects, Prototypes & Case Studies</h2>
          <p className="text-xs text-slate-400">Manage public project listings, screenshots, and detailed case studies.</p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-[#10B981] flex items-center gap-1.5 animate-in fade-in">
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
            onClick={handleAddProject}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm text-xs font-semibold text-slate-200 bg-[#0B1221] hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Add Project</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-bold text-[#020617] bg-[#10B981] hover:bg-[#0D9488] shadow-md disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Projects'}</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-8">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="bg-[#0B1221] rounded-lg border border-slate-800 p-6 space-y-5"
          >
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                  className="font-bold text-base text-white bg-[#020617] px-3 py-1.5 rounded-sm border border-slate-700 focus:ring-1 focus:ring-[#10B981] focus:outline-none w-64"
                  placeholder="Project Title"
                />
                <select
                  value={project.category}
                  onChange={(e) => handleProjectChange(index, 'category', e.target.value as ProjectCategory)}
                  className="text-xs font-semibold text-[#10B981] bg-[#020617] px-3 py-1.5 rounded-sm border border-slate-700 focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={project.status}
                  onChange={(e) => handleProjectChange(index, 'status', e.target.value)}
                  className="text-xs font-semibold text-slate-300 bg-[#020617] px-3 py-1.5 rounded-sm border border-slate-700 focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="In Development">In Development</option>
                  <option value="Initiative / Pilot">Initiative / Pilot</option>
                  <option value="Prototype">Prototype</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleProjectChange(index, 'is_published', !project.is_published)}
                  className={`px-2.5 py-1 rounded-sm text-xs font-semibold flex items-center gap-1.5 ${
                    project.is_published ? 'bg-emerald-950/60 text-[#10B981] border border-[#10B981]/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {project.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{project.is_published ? 'Published' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRemoveProject(index)}
                  className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-sm"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Project Image / Screenshot Management */}
            <div className="pt-1">
              <ImageUploadWidget
                label="Project Screenshot / Feature Graphic"
                description="Upload an image screenshot or preview banner for this project."
                currentUrl={project.image_url || ''}
                defaultUrl=""
                aspectRatio="video"
                onImageChange={(newUrl) => handleProjectChange(index, 'image_url', newUrl)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={project.subtitle}
                  onChange={(e) => handleProjectChange(index, 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Confidentiality Level</label>
                <input
                  type="text"
                  value={project.confidentiality_level || ''}
                  onChange={(e) => handleProjectChange(index, 'confidentiality_level', e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                  placeholder="e.g. Public Case Study / Anonymised Summary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Patrick's Role</label>
                <input
                  type="text"
                  value={project.role || ''}
                  onChange={(e) => handleProjectChange(index, 'role', e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">External URL / Reference (Optional)</label>
                <input
                  type="url"
                  value={project.external_url || ''}
                  onChange={(e) => handleProjectChange(index, 'external_url', e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Summary</label>
                <textarea
                  rows={2}
                  value={project.summary}
                  onChange={(e) => handleProjectChange(index, 'summary', e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">The Challenge</label>
                <textarea
                  rows={3}
                  value={project.challenge || ''}
                  onChange={(e) => handleProjectChange(index, 'challenge', e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">The Approach</label>
                <textarea
                  rows={3}
                  value={project.approach || ''}
                  onChange={(e) => handleProjectChange(index, 'approach', e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Specific Technical / Analytical Contributions</label>
                <textarea
                  rows={2}
                  value={project.contribution || ''}
                  onChange={(e) => handleProjectChange(index, 'contribution', e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technologies (Comma separated)</label>
                <input
                  type="text"
                  value={project.technologies.join(', ')}
                  onChange={(e) => handleTechnologiesChange(index, e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Verified Outcomes (One per line)</label>
                <textarea
                  rows={2}
                  value={(project.outcomes || []).join('\n')}
                  onChange={(e) => handleOutcomesChange(index, e.target.value)}
                  className="w-full px-3 py-2 rounded-sm text-xs bg-[#020617] border border-slate-700 text-white focus:ring-1 focus:ring-[#10B981] focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
