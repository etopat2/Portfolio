import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { ShieldCheck, RefreshCw, Clock } from 'lucide-react';
import { AuditLog } from '../../../types';

export const AuditLogsTab: React.FC = () => {
  const { adminToken } = usePortfolio();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [adminToken]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-slate-950 py-3 z-10 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Security & Audit Activity Trail
          </h2>
          <p className="text-xs text-slate-400">
            Immutable administrative records of content updates, authentication events, and data changes.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 border border-slate-700"
          title="Refresh audit logs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit history...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No administrative events recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                      {log.action}
                    </span>
                    <span className="font-bold text-white">{log.details}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    User: <span className="text-slate-300">{log.userEmail}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(log.createdAt || log.timestamp || Date.now()).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
