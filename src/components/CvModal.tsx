import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  X, 
  Printer, 
  MapPin, 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Layers, 
  Award 
} from 'lucide-react';

export const CvModal: React.FC = () => {
  const { data, isCvModalOpen, setIsCvModalOpen } = usePortfolio();
  const { profile, education, experience, skills, cv, projects } = data;

  if (!isCvModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={() => setIsCvModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-modal-title"
    >
      <div
        className="bg-[#0B1221] rounded-lg max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-800 shadow-2xl relative my-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 bg-[#0B1221]/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-2">
            <h3 id="cv-modal-title" className="text-sm font-bold text-white">
              {cv.displayTitle || 'Patrick Etomet — Curriculum Vitae'}
            </h3>
            <span className="px-2 py-0.5 rounded-xs text-[11px] font-mono bg-[#020617] text-[#10B981] border border-slate-800">
              {cv.versionDate || 'August 2026'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => setIsCvModalOpen(false)}
              aria-label="Close CV preview"
              className="w-8 h-8 rounded-xs flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#020617] border border-transparent hover:border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable CV Content */}
        <div className="p-6 sm:p-10 space-y-7 print:p-0 print:space-y-6">
          
          {/* CV Header */}
          <div className="border-b border-slate-800 pb-5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {profile.fullName}
            </h1>
            <p className="text-sm font-semibold text-[#10B981] mt-1">
              {profile.headline}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {profile.supportingHeadline}
            </p>

            {/* Contact Row */}
            <div className="flex flex-wrap gap-y-2 gap-x-5 text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#10B981]" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                {profile.phoneDisplay}
              </span>
            </div>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              Professional Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#020617] p-4 rounded-sm border border-slate-800">
              {cv.summaryText || profile.heroCopy}
            </p>
          </div>

          {/* Education Section */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-[#10B981]" />
              Education & Formal Studies
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs space-y-1 bg-[#020617] p-3 rounded-sm border border-slate-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>{edu.program}</span>
                    <span className="font-mono text-[#10B981]">{edu.period}</span>
                  </div>
                  <div className="text-slate-400 font-medium">
                    {edu.institution} — {edu.location} ({edu.status})
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {edu.details}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Experience & Milestones */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-[#10B981]" />
              Professional Journey & Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="text-xs space-y-1 bg-[#020617] p-3.5 rounded-sm border border-slate-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>{exp.title}</span>
                    <span className="font-mono text-slate-400">{exp.period}</span>
                  </div>
                  <div className="text-[#10B981] font-medium">
                    {exp.organization} {exp.location ? `• ${exp.location}` : ''}
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {exp.description}
                  </p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 pt-1 text-[11px]">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technical Toolkit */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#10B981]" />
              Technical & Analytical Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {skills.map((grp) => (
                <div key={grp.id} className="bg-[#020617] p-3 rounded-sm border border-slate-800">
                  <span className="font-bold text-white block mb-1">
                    {grp.category}:
                  </span>
                  <span className="text-slate-400">
                    {grp.skills.join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Projects Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#10B981]" />
              Selected Projects & Systems
            </h2>
            <div className="space-y-2.5 text-xs">
              {projects.slice(0, 4).map((p) => (
                <div key={p.id} className="border-l-2 border-[#10B981] pl-3 py-1 bg-[#020617] pr-3 rounded-r-sm border border-slate-800">
                  <span className="font-bold text-white">{p.title}</span>
                  <span className="text-slate-400 ml-2">({p.role})</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">{p.summary}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
