import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Server, 
  Code2, 
  Workflow, 
  Database, 
  Shield, 
  MapPin, 
  Layers, 
  CheckCircle, 
  Tag 
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Server,
  Code2,
  Workflow,
  Database,
  Shield,
  MapPin,
  Layers
};

export const Expertise: React.FC = () => {
  const { data } = usePortfolio();
  const { expertise } = data;

  return (
    <section id="expertise" className="py-24 bg-[#020617] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical & Analytical Expertise
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Grounded in real-world application, structured problem discovery, and hands-on implementation—focused on reliable systems and clear outcomes.
          </p>
        </div>

        {/* 6 Expertise Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertise.map((item) => {
            const Icon = iconMap[item.iconName] || Layers;
            return (
              <div
                key={item.id}
                className="bg-[#0B1221] rounded-md p-6 sm:p-7 border border-slate-800 shadow-md hover:border-[#10B981]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-sm bg-[#020617] text-[#10B981] flex items-center justify-center shrink-0 border border-slate-800">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                    {item.description}
                  </p>

                  {/* Evidence Statement */}
                  {item.evidenceStatement && (
                    <div className="mb-5 p-3.5 rounded-sm bg-[#020617] border border-slate-800 border-l-2 border-l-[#10B981] text-xs text-slate-300">
                      <span className="font-semibold text-[#10B981] block mb-1">
                        Application Evidence:
                      </span>
                      {item.evidenceStatement}
                    </div>
                  )}
                </div>

                {/* Practical Skill Tags */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    <Tag className="w-3 h-3" />
                    <span>Applied Domains</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-xs text-[11px] font-medium bg-[#020617] text-slate-300 border border-slate-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
