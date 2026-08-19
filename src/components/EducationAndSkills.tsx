import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  GraduationCap, 
  Code2, 
  Award, 
  BookOpen 
} from 'lucide-react';

export const EducationAndSkills: React.FC = () => {
  const { data } = usePortfolio();
  const { education, skills, certifications } = data;

  return (
    <section id="skills" className="py-24 bg-[#020617] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Academic & Technical Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education, Certifications & Tools
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Rigorous undergraduate studies in business computing and databases, coupled with practical software development frameworks and systems diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Education & Certifications */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#10B981]" />
                Academic Background
              </h3>

              <div className="space-y-4">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-[#0B1221] rounded-md p-5 border border-slate-800 shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-xs text-[11px] font-bold font-mono bg-[#020617] text-[#10B981] border border-slate-800">
                        {edu.period}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {edu.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">
                      {edu.program}
                    </h4>
                    <p className="text-xs font-semibold text-[#10B981] mb-2">
                      {edu.institution} • {edu.location}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {edu.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Badges */}
            {certifications && certifications.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                  Certifications & Field Recognition
                </h3>

                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-[#0B1221] rounded-md p-4 border border-slate-800 flex items-start gap-3 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-xs bg-[#020617] text-[#D4AF37] border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">
                          {cert.title}
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          {cert.issuer} {cert.issue_date ? `• ${cert.issue_date}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Categorized Working Skills Matrix */}
          <div className="lg:col-span-7">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#0D9488]" />
              Categorized Technical Stack & Tools
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Represented as areas of practical exposure, working skill, and active coursework application.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skillGroup) => (
                <div
                  key={skillGroup.id}
                  className="bg-[#0B1221] rounded-md p-5 border border-slate-800 shadow-sm"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#10B981] mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    {skillGroup.category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGroup.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-xs text-xs font-medium bg-[#020617] text-slate-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
