import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  FileText, 
  Briefcase, 
  Sparkles, 
  GraduationCap, 
  Layers, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

interface HeaderProps {
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin }) => {
  const { data, theme, toggleTheme, setIsCvModalOpen } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Expertise', href: '#expertise', icon: Layers },
    { label: 'Journey', href: '#journey', icon: Clock },
    { label: 'Projects', href: '#projects', icon: Briefcase },
    { label: 'Skills', href: '#skills', icon: GraduationCap },
    { label: 'Impact', href: '#impact', icon: Sparkles },
    { label: 'CV', href: '#cv', icon: FileText },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#020617]/95 backdrop-blur-md border-b border-slate-800 shadow-lg shadow-black/20'
          : 'bg-[#020617]/80 backdrop-blur-xs border-b border-slate-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 h-20 flex items-center justify-between">
        
        {/* Brand / Logo with Avatar Photo & Monogram */}
        <a
          href="#top"
          className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-sm p-1"
          aria-label="Patrick Etomet Home"
        >
          <div className="relative w-10 h-10 rounded-sm bg-[#0B1221] border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {data.profile.avatarUrl && !imgError ? (
              <img
                src={data.profile.avatarUrl}
                alt={data.profile.fullName}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full bg-[#0D9488] flex items-center justify-center text-[#020617] font-bold text-sm">
                {data.profile.monogram || 'PE'}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-semibold tracking-tight text-white group-hover:text-[#10B981] transition-colors">
              {data.profile.fullName}
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block">
              Kampala, Uganda • Systems & Tech
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="hover:text-[#10B981] transition-colors focus:outline-none focus:text-[#10B981]"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3.5">
          {/* Let's Talk CTA */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            id="header-talk-btn"
            className="hidden sm:inline-flex items-center gap-2 px-6 py-2 bg-[#10B981] text-[#020617] font-bold rounded-sm hover:bg-[#0D9488] transition-all text-sm shadow-sm"
          >
            <span>Let's Talk</span>
          </a>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch theme`}
            className="w-9 h-9 rounded-sm flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-colors focus:outline-none focus:ring-1 focus:ring-[#10B981]"
            title="Toggle theme appearance"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D4AF37]" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open mobile navigation menu"
            className="md:hidden w-9 h-9 rounded-sm flex items-center justify-center text-slate-300 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden fixed inset-x-0 top-20 bg-[#020617]/98 backdrop-blur-xl border-b border-slate-800 shadow-2xl px-6 py-6 animate-in slide-in-from-top duration-200"
        >
          <div className="grid grid-cols-2 gap-2 mb-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className="flex items-center gap-2.5 p-3 rounded-lg text-left text-sm font-medium text-slate-300 hover:bg-[#0B1221] hover:text-[#10B981] transition-colors border border-transparent hover:border-slate-800"
                >
                  <Icon className="w-4 h-4 text-[#10B981]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCvModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-sm text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <FileText className="w-4 h-4 text-[#10B981]" />
              <span>View & Download CV</span>
            </button>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-sm text-sm font-bold text-[#020617] bg-[#10B981] hover:bg-[#0D9488] transition-colors text-center"
            >
              <span>Contact Patrick</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
