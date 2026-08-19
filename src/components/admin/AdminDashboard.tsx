import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  LayoutDashboard, 
  User, 
  Layers, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  HeartHandshake, 
  FileText, 
  Inbox, 
  Mail, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  Lock
} from 'lucide-react';

import { OverviewTab } from './tabs/OverviewTab';
import { ProfileTab } from './tabs/ProfileTab';
import { ExpertiseTab } from './tabs/ExpertiseTab';
import { JourneyTab } from './tabs/JourneyTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { EducationSkillsTab } from './tabs/EducationSkillsTab';
import { ImpactTab } from './tabs/ImpactTab';
import { CvTab } from './tabs/CvTab';
import { InboxTab } from './tabs/InboxTab';
import { EmailLogsTab } from './tabs/EmailLogsTab';
import { AuditLogsTab } from './tabs/AuditLogsTab';
import { SettingsTab } from './tabs/SettingsTab';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const { adminUser, logoutAdmin, data } = usePortfolio();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inquiries Inbox', icon: Inbox },
    { id: 'profile', label: 'Profile & Bio', icon: User },
    { id: 'expertise', label: 'Core Expertise', icon: Layers },
    { id: 'journey', label: 'Journey Timeline', icon: Clock },
    { id: 'projects', label: 'Projects & Case Studies', icon: Briefcase },
    { id: 'education', label: 'Education & Skills', icon: GraduationCap },
    { id: 'impact', label: 'Community Impact', icon: HeartHandshake },
    { id: 'cv', label: 'CV & Documents', icon: FileText },
    { id: 'email-logs', label: 'Email & Delivery Logs', icon: Mail },
    { id: 'audit-logs', label: 'Security & Audit Logs', icon: ShieldCheck },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onSelectTab={(t) => setActiveTab(t)} onViewSite={onBackToSite} />;
      case 'inbox':
        return <InboxTab />;
      case 'profile':
        return <ProfileTab />;
      case 'expertise':
        return <ExpertiseTab />;
      case 'journey':
        return <JourneyTab />;
      case 'projects':
        return <ProjectsTab />;
      case 'education':
        return <EducationSkillsTab />;
      case 'impact':
        return <ImpactTab />;
      case 'cv':
        return <CvTab />;
      case 'email-logs':
        return <EmailLogsTab />;
      case 'audit-logs':
        return <AuditLogsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab onSelectTab={(t) => setActiveTab(t)} onViewSite={onBackToSite} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col md:flex-row">
      
      {/* Mobile Top Nav */}
      <div className="md:hidden bg-[#0B1221] border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-[#0D9488] text-[#020617] flex items-center justify-center font-bold text-xs shadow-sm">
            {data.profile.monogram || 'PE'}
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Patrick Etomet Admin</span>
            <span className="text-[10px] text-[#10B981] capitalize">{activeTab.replace('-', ' ')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-sm bg-[#020617] text-slate-300 hover:text-white border border-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0B1221] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-5 overflow-y-auto">
          
          {/* Logo & Admin Branding */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-[#0D9488] text-[#020617] flex items-center justify-center font-bold text-xs shadow-sm">
                {data.profile.monogram || 'PE'}
              </div>
              <div>
                <h1 className="text-xs font-bold text-white tracking-tight">Patrick Etomet</h1>
                <span className="text-[10px] text-[#10B981] font-mono flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Admin CMS</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#10B981] text-[#020617] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#020617]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#020617]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B1221] space-y-3">
          <div className="text-[11px] text-slate-400 px-1">
            <span className="text-slate-500 block text-[10px]">Logged in as:</span>
            <span className="font-semibold text-slate-300 truncate block">
              {adminUser?.email || 'etomet2patrick@gmail.com'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onBackToSite}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-sm text-[11px] font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-sm text-[11px] font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-900/50 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
        {renderActiveTab()}
      </main>

    </div>
  );
};
