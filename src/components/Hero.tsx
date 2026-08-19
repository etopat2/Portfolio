import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  FileText, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  Code2, 
  Database, 
  Server, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { data, setIsCvModalOpen } = usePortfolio();
  const { profile } = data;
  const [imgError, setImgError] = useState(false);

  const whatsappUrl = `https://wa.me/${profile.whatsappInternational}?text=${encodeURIComponent(profile.whatsappMessage || 'Hello Patrick, I found your portfolio and would like to connect.')}`;

  return (
    <section 
      id="top" 
      className="relative min-h-[92vh] pt-32 pb-20 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#020617] via-[#020617] to-[#0B1221] border-b border-slate-800"
    >
      {/* Background subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#10B981]/20 via-[#0D9488]/10 to-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0D9488]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left / Main Hero Content */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Verified Location & Role Eyebrow */}
            <div className="mb-2">
              <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
                {profile.heroEyebrow || 'Kampala, Uganda • Systems & Data Analyst'}
              </span>
              
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.12] text-white tracking-tight">
                Building practical digital systems for <span className="text-[#10B981]">impactful</span> experiences.
              </h1>
            </div>

            {/* Supporting Copy */}
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              {profile.heroCopy || `I am Patrick Etomet—an IT support specialist, software developer, and founder of Arata Synergy. I combine technical precision with human-centered problem solving to transform complex workflows.`}
            </p>

            {/* Pillar Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-medium bg-[#0B1221] text-slate-300 border border-slate-800">
                <Server className="w-3.5 h-3.5 text-[#10B981]" />
                IT Support & SysAdmin
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-medium bg-[#0B1221] text-slate-300 border border-slate-800">
                <Code2 className="w-3.5 h-3.5 text-[#0D9488]" />
                Software & Web Dev
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-medium bg-[#0B1221] text-slate-300 border border-slate-800">
                <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
                Data & Systems Analysis
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-medium bg-[#0B1221] text-slate-300 border border-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                Founder, Arata Synergy
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              {/* Primary Explore CTA */}
              <a
                href="#projects"
                id="hero-explore-work-btn"
                className="px-8 py-3.5 border-2 border-[#10B981] text-[#10B981] font-bold rounded-sm hover:bg-[#10B981] hover:text-[#020617] transition-all text-sm shadow-md"
              >
                Explore My Work
              </a>

              {/* Secondary CTA: Download / View CV */}
              <button
                id="hero-view-cv-btn"
                onClick={() => setIsCvModalOpen(true)}
                className="px-8 py-3.5 bg-slate-800 text-white font-bold rounded-sm hover:bg-slate-700 transition-all text-sm"
              >
                Download CV
              </button>

              {/* Direct WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-btn"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors ml-1 py-2"
                title="Chat directly on WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-[#10B981]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right / Official Portrait & Core Pillars Showcase Panel */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Official Portrait Card */}
            <div className="bg-[#0B1221] border border-slate-800 rounded-lg p-6 sm:p-7 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                
                {/* Official Portrait Image */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-lg overflow-hidden shrink-0 bg-[#020617] border-2 border-[#10B981]/40 shadow-xl group">
                  {profile.avatarUrl && !imgError ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0D9488] flex items-center justify-center text-[#020617] font-extrabold text-3xl">
                      {profile.monogram || 'PE'}
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-xs bg-[#020617]/90 text-[10px] font-bold text-[#10B981] border border-slate-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                    <span>Official</span>
                  </div>
                </div>

                {/* Profile Snapshot */}
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-[#020617] border border-slate-800 text-[11px] font-semibold text-[#D4AF37]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Verified Practitioner</span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {profile.fullName}
                  </h3>

                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{profile.location || 'Luzira, Nakawa, Kampala, Uganda'}</span>
                  </div>

                  <p className="text-xs text-[#10B981] font-medium leading-tight">
                    {profile.headline}
                  </p>
                </div>
              </div>

              {/* Core Pillars Quick List */}
              <div className="mt-6 pt-5 border-t border-slate-800/90 grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#020617] p-2.5 rounded-sm border border-slate-800">
                  <Server className="w-4 h-4 text-[#10B981] mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-slate-200 block">IT Support</span>
                  <span className="text-[10px] text-slate-500">SysAdmin</span>
                </div>

                <div className="bg-[#020617] p-2.5 rounded-sm border border-slate-800">
                  <Code2 className="w-4 h-4 text-[#0D9488] mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-slate-200 block">Software</span>
                  <span className="text-[10px] text-slate-500">Web Dev</span>
                </div>

                <div className="bg-[#020617] p-2.5 rounded-sm border border-slate-800">
                  <Database className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-slate-200 block">Data</span>
                  <span className="text-[10px] text-slate-500">Analysis</span>
                </div>
              </div>

              {/* Impact Callout */}
              <div className="mt-4 p-3 bg-[#020617] border border-slate-800 rounded-sm">
                <p className="text-slate-400 text-xs italic text-center sm:text-left leading-relaxed">
                  &ldquo;From rural computing scarcity in Eastern Uganda to founding Arata Synergy—dedicated to practical innovation that bridges the digital opportunity gap.&rdquo;
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
