import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Lock, Mail, KeyRound, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { loginAdmin } = usePortfolio();
  const [email, setEmail] = useState('etomet2patrick@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please verify your credentials.');
        setIsLoading(false);
        return;
      }

      loginAdmin(data.token, data.user);
    } catch (err: any) {
      setError('Connection to backend auth service failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        
        {/* Back Button */}
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-[#10B981] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Portfolio</span>
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-sm bg-[#0D9488] flex items-center justify-center shadow-lg">
            <Lock className="w-6 h-6 text-[#020617]" />
          </div>
        </div>

        <h2 className="text-center text-2xl font-extrabold tracking-tight text-white">
          Patrick Etomet Admin Portal
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400">
          Protected authentication required for content and inbox management.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#0B1221] py-8 px-6 shadow-2xl rounded-lg sm:px-8 border border-slate-800">
          
          {error && (
            <div className="mb-6 p-4 rounded-sm bg-[#020617] border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-sm bg-[#020617] border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                  placeholder="etomet2patrick@gmail.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-sm bg-[#020617] border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-sm text-xs sm:text-sm font-bold text-[#020617] bg-[#10B981] hover:bg-[#0D9488] shadow-md focus:outline-none focus:ring-1 focus:ring-[#10B981] disabled:opacity-50 transition-all"
              >
                {isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Allowlisted Access • Passwords Hashed with Bcrypt</span>
            </div>
            <p className="mt-2 text-[10px] text-slate-500 font-mono">
              Default password: <code className="bg-[#020617] px-1.5 py-0.5 rounded text-[#10B981] border border-slate-800">PatrickUganda2026!</code>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
