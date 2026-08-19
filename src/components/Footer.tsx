import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  MapPin, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Github, 
  Lock, 
  ArrowUp 
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { data, setIsPrivacyModalOpen } = usePortfolio();
  const { profile } = data;
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#020617] border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand and Summary */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#0D9488] text-[#020617] flex items-center justify-center font-bold text-base shadow-sm">
                {profile.monogram || 'PE'}
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {profile.fullName}
                </h4>
                <p className="text-xs text-[#10B981] font-medium">
                  {profile.headline}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Combining technology, data systems, and human-centred problem-solving to build practical, resilient digital tools in Uganda.
            </p>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{profile.location}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Explore
            </h5>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-[#10B981] transition-colors">About & Purpose</a></li>
              <li><a href="#expertise" className="hover:text-[#10B981] transition-colors">Core Expertise</a></li>
              <li><a href="#journey" className="hover:text-[#10B981] transition-colors">Journey Timeline</a></li>
              <li><a href="#projects" className="hover:text-[#10B981] transition-colors">Projects & Systems</a></li>
              <li><a href="#skills" className="hover:text-[#10B981] transition-colors">Education & Skills</a></li>
              <li><a href="#impact" className="hover:text-[#10B981] transition-colors">Community Impact</a></li>
            </ul>
          </div>

          {/* Social Profiles */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Verified Social Channels
            </h5>
            <div className="flex flex-col space-y-2.5">
              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs hover:text-[#10B981] transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-[#10B981]" />
                  <span>LinkedIn (@patrick-etomet)</span>
                </a>
              )}

              {profile.socials.x && (
                <a
                  href={profile.socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs hover:text-[#10B981] transition-colors"
                >
                  <Twitter className="w-4 h-4 text-[#10B981]" />
                  <span>X / Twitter (@ArataPatrickEto)</span>
                </a>
              )}

              {profile.socials.facebook && (
                <a
                  href={profile.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs hover:text-[#10B981] transition-colors"
                >
                  <Facebook className="w-4 h-4 text-[#10B981]" />
                  <span>Facebook (@patrick.etomet)</span>
                </a>
              )}

              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-xs hover:text-[#10B981] transition-colors"
                >
                  <Github className="w-4 h-4 text-[#10B981]" />
                  <span>GitHub Repository Profile</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-[11px] text-center sm:text-left">
            © {currentYear} {profile.fullName}. Built with modern full-stack standards. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-slate-400 hover:text-[#10B981] text-[11px] underline"
            >
              Privacy Notice
            </button>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-slate-400 hover:text-white text-[11px] flex items-center gap-1 opacity-75 hover:opacity-100 transition-opacity"
                title="Admin Area"
              >
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="w-8 h-8 rounded-sm bg-[#0B1221] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
