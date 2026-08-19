import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Clock, CheckCircle2, MapPin, Sparkles } from 'lucide-react';

export const Journey: React.FC = () => {
  const { data } = usePortfolio();
  const { experience } = data;

  return (
    <section id="journey" className="py-24 bg-[#020617] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Milestones & Progression
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Professional & Academic Journey
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            A documented progression marked by determination, hands-on field experience, formal computing studies, and sociopreneurial leadership.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-[#10B981]/30 ml-4 sm:ml-8 md:ml-36 space-y-10 pb-4">
          
          {experience.map((entry) => {
            const isOngoing = entry.period.toLowerCase().includes('ongoing') || entry.period.toLowerCase().includes('current') || entry.period.toLowerCase().includes('founder');

            return (
              <div key={entry.id} className="relative pl-6 sm:pl-8 group">
                
                {/* Timeline node icon */}
                <div className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${
                  isOngoing
                    ? 'bg-[#10B981] border-[#10B981] text-[#020617] shadow-lg shadow-[#10B981]/20'
                    : 'bg-[#0B1221] border-slate-700 text-slate-400'
                }`}>
                  {isOngoing ? (
                    <Sparkles className="w-3.5 h-3.5" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                  )}
                </div>

                {/* Date / Period label */}
                <div className="md:absolute md:-left-36 md:top-2 md:w-32 md:text-right mb-2 md:mb-0">
                  <span className={`inline-block px-2.5 py-1 rounded-xs text-xs font-bold font-mono ${
                    isOngoing
                      ? 'bg-[#0B1221] text-[#10B981] border border-[#10B981]/50'
                      : 'bg-[#0B1221] text-slate-400 border border-slate-800'
                  }`}>
                    {entry.period}
                  </span>
                </div>

                {/* Timeline Card */}
                <div className="bg-[#0B1221] rounded-md p-6 border border-slate-800 hover:border-[#10B981]/40 transition-all shadow-md">
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-white">
                      {entry.title}
                    </h3>
                    {entry.location && (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {entry.location}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-[#10B981] mb-3">
                    {entry.organization}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    {entry.description}
                  </p>

                  {entry.highlights && entry.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-3 border-t border-slate-800">
                      {entry.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
