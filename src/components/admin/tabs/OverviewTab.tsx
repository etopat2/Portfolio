import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { 
  Inbox, 
  Briefcase, 
  Layers, 
  Clock, 
  FileDown, 
  ExternalLink, 
  RotateCcw, 
  ShieldCheck, 
  Mail, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ContactMessage } from '../../../types';

interface OverviewTabProps {
  onSelectTab: (tab: string) => void;
  onViewSite: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onSelectTab, onViewSite }) => {
  const { data, adminToken } = usePortfolio();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!adminToken) return;
      try {
        const res = await fetch('/api/admin/messages', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const json = await res.json();
          setMessages(json.messages || []);
        }
      } catch (err) {
        console.error('Failed to fetch overview messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [adminToken]);

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const publishedProjects = data.projects.filter(p => p.is_published).length;
  const publishedExpertise = data.expertise.filter(e => e.is_published).length;

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-2xl text-white border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
            Control Center
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-white mt-1">
            Welcome back, Patrick Etomet
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Manage your live portfolio content, respond to client & collaborator enquiries, update case studies, and configure site settings.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onViewSite}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          
          <a
            href="/api/admin/messages-export-csv"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Inquiries CSV</span>
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => onSelectTab('inbox')}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Total Enquiries</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{messages.length}</span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>

        <div
          onClick={() => onSelectTab('projects')}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Published Projects</span>
            <div className="w-8 h-8 rounded-lg bg-teal-950/60 text-teal-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white">{publishedProjects}</span>
        </div>

        <div
          onClick={() => onSelectTab('expertise')}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Expertise Domains</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white">{publishedExpertise}</span>
        </div>

        <div
          onClick={() => onSelectTab('journey')}
          className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Journey Milestones</span>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl font-bold text-white">{data.experience.length}</span>
        </div>
      </div>

      {/* Recent Inquiries Snippet */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Recent Contact Inquiries</h3>
            <p className="text-xs text-slate-400">Latest messages submitted via the public contact form.</p>
          </div>
          <button
            onClick={() => onSelectTab('inbox')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            View all messages →
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl">
            <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No contact messages received yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.slice(0, 4).map((msg) => (
              <div
                key={msg.id}
                onClick={() => onSelectTab('inbox')}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{msg.fullName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                      {msg.referenceCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      msg.status === 'unread' ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{msg.subject}</p>
                  <p className="text-xs text-slate-400 line-clamp-1">{msg.message}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
