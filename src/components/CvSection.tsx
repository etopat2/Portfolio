import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { FileText, Eye, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export const CvSection: React.FC = () => {
  const { data, setIsCvModalOpen } = usePortfolio();
  const { cv } = data;

  return (
    <section id="cv" className="py-24 bg-[#020617] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        
        <div className="bg-[#0B1221] rounded-lg p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Info */}
            <div className="lg:col-span-8 space-y-5">
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block">
                Curriculum Vitae
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {cv.displayTitle || 'Patrick Etomet — Verified Curriculum Vitae'}
              </h2>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl font-normal">
                {cv.summaryText || 'A structured professional summary encompassing IT support, database architecture, systems analysis, PWA engineering, and community digital leadership.'}
              </p>

              <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  Version: <strong className="text-slate-200 font-mono">{cv.versionDate || 'August 2026'}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  Verified Academic & Field Milestones
                </span>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center bg-[#020617] p-6 rounded-md border border-slate-800">
              <button
                id="cv-view-full-btn"
                onClick={() => setIsCvModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm text-sm font-bold text-[#020617] bg-[#10B981] hover:bg-[#0D9488] transition-all shadow-md"
              >
                <Eye className="w-4 h-4" />
                <span>View Full CV Document</span>
              </button>

              <button
                id="cv-print-btn"
                onClick={() => {
                  setIsCvModalOpen(true);
                  setTimeout(() => window.print(), 300);
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-sm text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print / Save as PDF</span>
              </button>

              <p className="text-[11px] text-center text-slate-500 font-mono">
                Filename: <span className="text-[#10B981]">{cv.downloadFilename || 'Patrick_Etomet_CV.pdf'}</span>
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
