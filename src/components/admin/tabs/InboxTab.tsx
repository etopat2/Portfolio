import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ContactMessage } from '../../../types';
import { 
  Inbox, 
  Search, 
  Filter, 
  FileDown, 
  Mail, 
  Trash2, 
  CheckCircle, 
  Archive, 
  X, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare,
  Clock,
  Building,
  Phone,
  ShieldCheck,
  Send
} from 'lucide-react';

export const InboxTab: React.FC = () => {
  const { adminToken } = usePortfolio();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied' | 'archived'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchMessages = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const json = await res.json();
        setMessages(json.messages || []);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [adminToken]);

  const handleSelectMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setAdminNotes(msg.adminNotes || '');
    if (msg.status === 'unread') {
      handleUpdateStatus(msg.id, 'read');
    }
  };

  const handleUpdateStatus = async (id: string, status: ContactMessage['status'], notes?: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/messages/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status,
          adminNotes: notes !== undefined ? notes : adminNotes
        })
      });

      if (res.ok) {
        const json = await res.json();
        setMessages(prev => prev.map(m => m.id === id ? json.message : m));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(json.message);
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this message record?')) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredMessages = messages.filter(m => {
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      m.fullName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.referenceCode.toLowerCase().includes(q) ||
      (m.organization && m.organization.toLowerCase().includes(q));

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-slate-950 py-3 z-10 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Inbox className="w-5 h-5 text-emerald-500" />
            Contact Enquiries Inbox
          </h2>
          <p className="text-xs text-slate-400">
            {messages.length} total messages ({messages.filter(m => m.status === 'unread').length} unread).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/messages-export-csv"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender, email, ref..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {(['all', 'unread', 'read', 'replied', 'archived'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === s
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Inbox Table / List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading inbox...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No messages match your criteria</p>
            <p className="text-xs text-slate-500">Try adjusting your search query or filter tab.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-850 transition-colors ${
                  msg.status === 'unread' ? 'bg-slate-850/80 border-l-4 border-emerald-500' : ''
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-white">{msg.fullName}</span>
                    <span className="text-xs text-slate-400">({msg.email})</span>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {msg.referenceCode}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      msg.status === 'unread'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : msg.status === 'replied'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : msg.status === 'archived'
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {msg.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-400">[{msg.enquiryType}]</span>
                    <span className="text-xs font-medium text-slate-200">{msg.subject}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">{msg.message}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMessage(msg.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Drawer Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded font-mono text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {selectedMessage.referenceCode}
                </span>
                <button
                  onClick={() => handleCopyRef(selectedMessage.referenceCode)}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Copy reference code"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedMessage.status}
                  onChange={(e) => handleUpdateStatus(selectedMessage.id, e.target.value as any)}
                  className="text-xs font-semibold bg-slate-800 border border-slate-700 text-white px-2.5 py-1.5 rounded-lg focus:outline-none"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>

                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sender Meta Details */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Sender Name:</span>
                <span className="font-bold text-white">{selectedMessage.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email Address:</span>
                <a href={`mailto:${selectedMessage.email}`} className="font-medium text-emerald-400 hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone / WhatsApp:</span>
                  <span className="font-medium text-white">{selectedMessage.phone}</span>
                </div>
              )}
              {selectedMessage.organization && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Organisation:</span>
                  <span className="font-medium text-white">{selectedMessage.organization}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Enquiry Category:</span>
                <span className="font-bold text-emerald-300">{selectedMessage.enquiryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Submitted On:</span>
                <span className="text-slate-300">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Subject: <span className="text-white normal-case font-semibold text-sm">{selectedMessage.subject}</span>
              </h4>
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>

            {/* Quick Action: Reply by Mailto */}
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject} [Ref: ${selectedMessage.referenceCode}]`)}&body=${encodeURIComponent(`Dear ${selectedMessage.fullName},\n\nThank you for reaching out regarding "${selectedMessage.subject}".\n\nKind regards,\nPatrick Etomet\nKampala, Uganda`)}`}
                onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch Email Reply</span>
              </a>

              <button
                onClick={() => handleUpdateStatus(selectedMessage.id, 'archived')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>

              <button
                onClick={() => handleDeleteMessage(selectedMessage.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-xl"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  Internal Admin Notes
                </label>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, selectedMessage.status, adminNotes)}
                  disabled={isUpdating}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  {isUpdating ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add follow-up notes, phone call logs, or meeting status here..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
