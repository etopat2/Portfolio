import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { X, ShieldCheck, Lock, Database, Trash2 } from 'lucide-react';

export const PrivacyModal: React.FC = () => {
  const { isPrivacyModalOpen, setIsPrivacyModalOpen, data } = usePortfolio();

  if (!isPrivacyModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={() => setIsPrivacyModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div
        className="bg-[#0B1221] rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-800 shadow-2xl relative my-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#0B1221]/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#10B981]" />
            <h3 id="privacy-modal-title" className="text-sm font-bold text-white">
              Privacy Notice & Data Handling
            </h3>
          </div>
          <button
            onClick={() => setIsPrivacyModalOpen(false)}
            className="w-8 h-8 rounded-sm flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#020617] border border-transparent hover:border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-slate-400 leading-relaxed">
          <div className="p-4 rounded-sm bg-[#020617] border border-slate-800 border-l-2 border-l-[#10B981] text-slate-300">
            <strong className="text-white">Patrick Etomet's Commitment:</strong> Your privacy and data integrity are held to the highest standard of professional ethics.
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Database className="w-4 h-4 text-[#10B981]" />
              1. What Information is Collected
            </h4>
            <p>
              When you submit an enquiry through the contact form, we collect only the information you explicitly provide: your full name, email address, optional phone/WhatsApp number, optional organisation, enquiry subject, and message.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Lock className="w-4 h-4 text-[#10B981]" />
              2. How Your Data is Used & Protected
            </h4>
            <p>
              Your contact details are strictly used to reply to your enquiry and coordinate potential professional work, employment, support, or community projects. Your data is never sold, shared with third-party advertisers, or used for unsolicited marketing.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
              <Trash2 className="w-4 h-4 text-[#10B981]" />
              3. Data Retention & Erasure
            </h4>
            <p>
              Enquiries are retained in the protected portfolio database for administrative record-keeping. You may request the deletion of your enquiry at any time by emailing{' '}
              <a href={`mailto:${data.profile.email}`} className="text-[#10B981] font-semibold underline">
                {data.profile.email}
              </a>
              {' '}with your reference code.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={() => setIsPrivacyModalOpen(false)}
              className="px-6 py-2.5 rounded-sm text-xs font-bold text-[#020617] bg-[#10B981] hover:bg-[#0D9488] transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
