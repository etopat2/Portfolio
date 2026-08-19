import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Users, HeartHandshake } from 'lucide-react';

export const Impact: React.FC = () => {
  const { data } = usePortfolio();
  const { impact } = data;

  return (
    <section id="impact" className="py-24 bg-[#020617] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Community & Social Value
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connecting Technology with Human Impact
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Moving people from digital exclusion to active participation, and transforming community ideas from conceptual stages into practical implementation.
          </p>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {impact.map((item) => (
            <div
              key={item.id}
              className="bg-[#0B1221] rounded-md p-6 sm:p-7 border border-slate-800 shadow-md hover:border-[#10B981]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-xs text-[11px] font-bold bg-[#020617] text-[#10B981] border border-slate-800">
                    {item.badge}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    Community Pillar
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Users className="w-4 h-4 text-[#10B981]" />
                  <span>Target: <span className="text-slate-400">{item.targetGroup}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arata Synergy Callout Box */}
        <div className="bg-[#0B1221] rounded-md p-8 text-white border border-slate-800 border-l-4 border-l-[#10B981] shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="px-3 py-1 rounded-xs text-xs font-bold font-mono tracking-wider bg-[#020617] text-[#10B981] border border-slate-800 inline-block">
              ARATA SYNERGY • TECHNOLOGY | INNOVATION | SOCIOPRENEURSHIP
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              A commitment to inclusive digital opportunity in Uganda
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Whether through open mapping for disaster response, digital safety workshops for first-time internet users, or designing privacy-first software tools, Patrick's focus remains on practical, human-centered technology that creates sustainable value.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
