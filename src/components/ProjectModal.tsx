import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  UserCheck, 
  AlertTriangle,
  Lightbulb,
  FileCode
} from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const { selectedProject, setSelectedProject } = usePortfolio();

  if (!selectedProject) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={() => setSelectedProject(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="bg-[#0B1221] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-800 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="sticky top-0 bg-[#0B1221]/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-xs text-xs font-semibold bg-[#020617] text-[#10B981] border border-slate-800">
              {selectedProject.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-xs text-xs font-medium bg-[#020617] text-slate-300 border border-slate-800">
              Status: {selectedProject.status}
            </span>
          </div>

          <button
            onClick={() => setSelectedProject(null)}
            aria-label="Close project modal"
            className="w-8 h-8 rounded-sm flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#020617] border border-transparent hover:border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Title & Subtitle */}
          <div>
            <h3 id="project-modal-title" className="text-2xl font-extrabold text-white tracking-tight mb-1">
              {selectedProject.title}
            </h3>
            <p className="text-sm font-medium text-[#10B981]">
              {selectedProject.subtitle}
            </p>
          </div>

          {/* Project Screenshot / Feature Banner */}
          {selectedProject.image_url && (
            <div className="rounded-lg overflow-hidden border border-slate-800 bg-[#020617] max-h-72 w-full">
              <img
                src={selectedProject.image_url}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Confidentiality Notice / Badge */}
          {selectedProject.confidentiality_level && (
            <div className="flex items-start gap-3 p-3.5 rounded-sm bg-[#020617] border border-slate-800 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">
                  Data Classification: {selectedProject.confidentiality_level}
                </span>
                <p className="text-slate-400 mt-0.5">
                  Adheres strictly to confidentiality protocols. No sensitive institutional records or credentials are disclosed.
                </p>
              </div>
            </div>
          )}

          {/* Role & Summary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <UserCheck className="w-4 h-4 text-[#10B981]" />
              <span>Patrick's Role: <span className="text-white font-bold">{selectedProject.role}</span></span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed bg-[#020617] p-4 rounded-sm border border-slate-800">
              {selectedProject.summary}
            </p>
          </div>

          {/* Challenge & Approach Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#020617] border border-slate-800 rounded-sm p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wide">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>The Challenge</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedProject.challenge}
              </p>
            </div>

            <div className="bg-[#020617] border border-slate-800 rounded-sm p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#10B981] uppercase tracking-wide">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>The Approach</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedProject.approach}
              </p>
            </div>
          </div>

          {/* Specific Contribution */}
          {selectedProject.contribution && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Key Technical & Analytical Contributions</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 bg-[#020617] p-4 rounded-sm border border-slate-800">
                {selectedProject.contribution}
              </p>
            </div>
          )}

          {/* Outcomes */}
          {selectedProject.outcomes && selectedProject.outcomes.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Verifiable Project Outcomes
              </h4>
              <div className="space-y-2">
                {selectedProject.outcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technologies Used */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Technologies & Methodologies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedProject.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-xs text-xs font-medium bg-[#020617] text-slate-300 border border-slate-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* External Links */}
          {selectedProject.external_url && (
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <a
                href={selectedProject.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold text-[#020617] bg-[#10B981] hover:bg-[#0D9488] transition-colors"
              >
                <span>Visit Project Reference</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
