import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCategory } from '../types';
import { 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

const CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'Systems',
  'Web/PWA',
  'Data',
  'Social Impact',
  'Media',
  'Concept/Prototype'
];

export const Projects: React.FC = () => {
  const { data, setSelectedProject } = usePortfolio();
  const { projects } = data;
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectCategory>('All');

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter(p => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section id="projects" className="py-24 bg-[#020617] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
              Selected Work & Initiatives
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Systems, Prototypes & Social Impact
            </h2>
            <p className="mt-3 text-base text-slate-400 font-normal">
              Practical software engineering, automated workflows, and community digital innovation. Click any card to explore the full case study.
            </p>
          </div>

          {/* Confidentiality Assurance Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#0B1221] border border-slate-800 text-xs text-slate-400 shadow-sm shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Strict data ethics & anonymized case studies</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-sm text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-1 focus:ring-[#10B981] ${
                selectedCategory === cat
                  ? 'bg-[#10B981] text-[#020617] shadow-sm'
                  : 'bg-[#0B1221] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-[#0B1221] rounded-md border border-slate-800 p-6 sm:p-7 shadow-md hover:border-[#10B981]/50 transition-all cursor-pointer flex flex-col justify-between group overflow-hidden"
            >
              <div>
                {/* Optional Project Screenshot / Banner */}
                {project.image_url && (
                  <div className="mb-4 -mx-6 -mt-6 sm:-mx-7 sm:-mt-7 h-40 bg-[#020617] border-b border-slate-800 overflow-hidden relative">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Top Status & Category Badges */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-xs text-[11px] font-bold bg-[#020617] text-[#10B981] border border-slate-800">
                    {project.category}
                  </span>

                  <span className={`px-2 py-0.5 rounded-xs text-[10px] font-semibold font-mono uppercase tracking-wider ${
                    project.status === 'Active'
                      ? 'bg-[#020617] text-[#10B981] border border-[#10B981]/40'
                      : project.status === 'In Development'
                      ? 'bg-[#020617] text-[#D4AF37] border border-[#D4AF37]/40'
                      : 'bg-[#020617] text-slate-400 border border-slate-800'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Project Title & Subtitle */}
                <h3 className="text-base font-bold text-white group-hover:text-[#10B981] transition-colors mb-1">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-3">
                  {project.subtitle}
                </p>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3 mb-5">
                  {project.summary}
                </p>
              </div>

              {/* Bottom Metadata: Tech stack & CTA */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-xs text-[10px] font-medium bg-[#020617] text-slate-300 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-0.5 rounded-xs text-[10px] font-medium bg-[#020617] text-slate-500">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-[#10B981] group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Case Study</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-lg">
            <p className="text-sm text-slate-400">No projects found in this category.</p>
          </div>
        )}

      </div>
    </section>
  );
};
