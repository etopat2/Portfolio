import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Wrench, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  Layers 
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Wrench,
  BookOpen,
  ShieldCheck,
  Users,
  Compass,
  Sparkles,
  Layers
};

export const About: React.FC = () => {
  const { data } = usePortfolio();
  const { profile, values } = data;

  return (
    <section id="about" className="py-24 bg-[#020617] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Background & Purpose
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {profile.aboutTheme || 'From digital exclusion to practical innovation.'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            A resilient journey from limited early technology access in rural Uganda to architecting practical software, managing dependable IT systems, and leading community digital inclusion.
          </p>
        </div>

        {/* Narrative & Context Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          
          {/* Authentic Story Paragraphs */}
          <div className="lg:col-span-7 space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            {profile.aboutStory && profile.aboutStory.length > 0 ? (
              profile.aboutStory.map((paragraph, idx) => (
                <div key={idx} className="bg-[#0B1221] p-5 rounded-md border border-slate-800 text-slate-300 leading-relaxed">
                  {paragraph}
                </div>
              ))
            ) : (
              <>
                <div className="bg-[#0B1221] p-5 rounded-md border border-slate-800 text-slate-300 leading-relaxed">
                  Patrick’s early schooling in rural Uganda offered little or no access to computers. He first encountered computers and the internet during advanced secondary school in 2010–2011, which sparked a lasting commitment to technology and digital inclusion.
                </div>
                <div className="bg-[#0B1221] p-5 rounded-md border border-slate-800 text-slate-300 leading-relaxed">
                  He continued learning, supported national digital-registration work in 2014, participated in humanitarian OpenStreetMap mapping from 2015, trained community members, and progressed into IT support, systems analysis, databases, and software projects.
                </div>
                <div className="bg-[#0B1221] p-5 rounded-md border border-slate-800 text-slate-300 leading-relaxed">
                  Currently pursuing a Bachelor of Science in Business Computing and Data Analytics at Victoria University Kampala, Patrick connects technology with better organizational services, learning, opportunity, and social impact through Arata Synergy.
                </div>
              </>
            )}
          </div>

          {/* Key Principles / Focus Box */}
          <div className="lg:col-span-5 bg-[#0B1221] rounded-lg p-7 text-white shadow-2xl border border-slate-800 space-y-5">
            <h3 className="text-lg font-bold tracking-tight text-[#10B981] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
              Core Operating Principles
            </h3>
            <p className="text-xs text-slate-400">
              How Patrick approaches every system, organization, and project.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                <span><strong className="text-white">No ungrounded complexity:</strong> Prioritizing lean, maintainable, and reliable tools that users can operate with confidence.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                <span><strong className="text-white">Evidence-based decisions:</strong> Harnessing structured data, relational modeling, and thorough process analysis.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span><strong className="text-white">Strict confidentiality & ethics:</strong> Protecting sensitive institutional data, maintaining privacy, and respecting compliance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] mt-1.5 shrink-0" />
                <span><strong className="text-white">Knowledge transfer:</strong> Ensuring team members and community participants are empowered through clear documentation.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 4 Guiding Value Cards */}
        <div className="pt-4">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              Guiding Values
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Foundation of Patrick's practice
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val) => {
              const Icon = iconMap[val.iconName] || Wrench;
              return (
                <div
                  key={val.id}
                  className="bg-[#0B1221] rounded-md p-6 border border-slate-800 hover:border-[#10B981]/50 transition-all group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-sm bg-[#020617] text-[#10B981] border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">
                    {val.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
