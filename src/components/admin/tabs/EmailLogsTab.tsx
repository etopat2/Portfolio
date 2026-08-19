import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../../../context/PortfolioContext';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, Server, Send } from 'lucide-react';
import { EmailDeliveryLog } from '../../../types';

export const EmailLogsTab: React.FC = () => {
  const { adminToken } = usePortfolio();
  const [logs, setLogs] = useState<EmailDeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  const fetchLogs = async () => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/email-logs', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs || []);
      }
    } catch (err) {
      console.error('Failed to load email logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [adminToken]);

  const handleSendTestEmail = async () => {
    setTestEmailSending(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        }
      });
      const json = await res.json();
      if (res.ok) {
        setTestResult({ success: true, message: json.message || 'Test email dispatched successfully.' });
        fetchLogs();
      } else {
        setTestResult({ success: false, error: json.error || 'Failed to dispatch test email.' });
      }
    } catch (err: any) {
      setTestResult({ success: false, error: err.message || 'Network error sending test email' });
    } finally {
      setTestEmailSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-slate-950 py-3 z-10 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-500" />
            Transactional Email Integration & Delivery Logs
          </h2>
          <p className="text-xs text-slate-400">
            Monitors outbound email notifications dispatched when visitors submit inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 border border-slate-700"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSendTestEmail}
            disabled={testEmailSending}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{testEmailSending ? 'Sending Test...' : 'Send Test Notification'}</span>
          </button>
        </div>
      </div>

      {testResult && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
          testResult.success 
            ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300' 
            : 'bg-amber-950/60 border border-amber-800 text-amber-300'
        }`}>
          {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{testResult.message || testResult.error}</span>
        </div>
      )}

      {/* Provider Status Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          Configured Outbound Mail Provider: Resend API
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Transactional email delivery is handled by Resend. If <code className="font-mono text-emerald-400">RESEND_API_KEY</code> is configured in environment secrets, live notification emails are dispatched instantly to Patrick's inbox (<code className="font-mono text-slate-300">etomet2patrick@gmail.com</code>). If unconfigured, the system gracefully logs and stores the inquiry in the portfolio database without disruption.
        </p>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Outbound Delivery Event History</h4>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading delivery logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No outbound email attempts recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      log.status === 'sent'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : log.status === 'simulated'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {log.status}
                    </span>
                    <span className="font-bold text-white">To: {log.recipient}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{log.provider}</span>
                  </div>
                  <p className="text-slate-300 font-medium">{log.subject}</p>
                  {log.errorDetails && (
                    <p className="text-rose-400 text-[11px]">{log.errorDetails}</p>
                  )}
                </div>

                <div className="text-slate-500 font-mono text-[11px] shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
