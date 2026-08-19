import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ContactFormInput } from '../types';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { data, submitContactForm, setIsPrivacyModalOpen } = usePortfolio();
  const { profile } = data;

  const [formData, setFormData] = useState<ContactFormInput>({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    enquiryType: 'Project',
    subject: '',
    message: '',
    consent: false,
    honeypot: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    referenceCode?: string;
    message?: string;
    error?: string;
  } | null>(null);

  const [copiedRef, setCopiedRef] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionResult(null);

    const res = await submitContactForm(formData);
    setIsSubmitting(false);
    setSubmissionResult(res);

    if (res.success) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        enquiryType: 'Project',
        subject: '',
        message: '',
        consent: false,
        honeypot: ''
      });
    }
  };

  const copyReferenceCode = () => {
    if (submissionResult?.referenceCode) {
      navigator.clipboard.writeText(submissionResult.referenceCode);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/${profile.whatsappInternational}?text=${encodeURIComponent(profile.whatsappMessage || 'Hello Patrick, I found your portfolio and would like to connect.')}`;

  return (
    <section id="contact" className="py-24 bg-[#020617] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block mb-3">
            Direct Communication
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Get in Touch with Patrick
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
            Open to technology support, software development, data analytics, systems consultation, speaking/training, and impact initiatives. No account required.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#0B1221] rounded-md p-7 border border-slate-800 shadow-md space-y-5">
              <h3 className="text-base font-bold text-white">
                Direct Contact Channels
              </h3>
              
              <div className="space-y-3.5">
                {/* Email Action */}
                <a
                  href={`mailto:${profile.email}`}
                  id="direct-email-link"
                  className="flex items-start gap-4 p-4 rounded-sm bg-[#020617] hover:border-[#10B981]/50 border border-slate-800 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-sm bg-[#0B1221] text-[#10B981] border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Official Email</span>
                    <span className="text-sm font-bold text-white group-hover:text-[#10B981] break-all">
                      {profile.email}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">Click to open your mail client</p>
                  </div>
                </a>

                {/* WhatsApp Direct Action */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="direct-whatsapp-link"
                  className="flex items-start gap-4 p-4 rounded-sm bg-[#020617] hover:border-[#10B981]/50 border border-slate-800 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-sm bg-[#0B1221] text-[#10B981] border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">WhatsApp Instant</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </div>
                    <span className="text-sm font-bold text-white group-hover:text-[#10B981]">
                      {profile.phoneDisplay}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">Quick message via wa.me link</p>
                  </div>
                </a>

                {/* Telephone Call Action */}
                <a
                  href={`tel:${profile.whatsappInternational ? `+${profile.whatsappInternational}` : '+256791170164'}`}
                  id="direct-phone-link"
                  className="flex items-start gap-4 p-4 rounded-sm bg-[#020617] hover:border-[#10B981]/50 border border-slate-800 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-sm bg-[#0B1221] text-[#10B981] border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Telephone</span>
                    <span className="text-sm font-bold text-white group-hover:text-[#10B981]">
                      {profile.phoneDisplay}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">Direct phone call in Uganda</p>
                  </div>
                </a>

                {/* Base Location */}
                <div className="flex items-start gap-4 p-4 rounded-sm bg-[#020617] border border-slate-800">
                  <div className="w-10 h-10 rounded-sm bg-[#0B1221] text-slate-400 border border-slate-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Base Location</span>
                    <span className="text-sm font-bold text-white">
                      {profile.location}
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">East Africa Time (EAT • UTC+3)</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Public Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#0B1221] rounded-md p-7 sm:p-8 border border-slate-800 shadow-md">
              
              <h3 className="text-lg font-bold text-white mb-1">
                Send a Structured Enquiry
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Your message is stored securely and assigned a unique reference code.
              </p>

              {/* Success Banner */}
              {submissionResult?.success && (
                <div className="mb-6 p-4 rounded-sm bg-[#020617] border border-[#10B981] text-white">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#10B981]">
                        {submissionResult.message || 'Thank you—your message has been received.'}
                      </h4>
                      
                      {submissionResult.referenceCode && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs text-slate-400">Reference:</span>
                          <span className="px-2 py-0.5 rounded-xs font-mono text-xs font-bold bg-[#0B1221] border border-slate-700 text-[#10B981]">
                            {submissionResult.referenceCode}
                          </span>
                          <button
                            type="button"
                            onClick={copyReferenceCode}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Copy reference code"
                          >
                            {copiedRef ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {submissionResult?.error && (
                <div className="mb-6 p-4 rounded-sm bg-[#020617] border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{submissionResult.error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Honeypot field */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    id="website_hp"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.honeypot}
                    onChange={handleChange}
                  />
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-fullName" className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name <span className="text-[#10B981]">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-fullName"
                      name="fullName"
                      required
                      placeholder="e.g. Sarah Mukasa"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-sm text-xs sm:text-sm bg-[#020617] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address <span className="text-[#10B981]">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-sm text-xs sm:text-sm bg-[#020617] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-colors"
                    />
                  </div>
                </div>

                {/* Phone & Organization Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone / WhatsApp <span className="text-slate-500 text-[11px] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      placeholder="e.g. +256 700 000000"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-sm text-xs sm:text-sm bg-[#020617] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-org" className="block text-xs font-semibold text-slate-300 mb-1">
                      Organisation <span className="text-slate-500 text-[11px] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="contact-org"
                      name="organization"
                      placeholder="Company, NGO, or Institution"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-sm text-xs sm:text-sm bg-[#020617] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-colors"
                    />
                  </div>
                </div>

                {/* Enquiry Type & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="contact-enquiryType" className="block text-xs font-semibold text-slate-300 mb-1">
                      Enquiry Type
                    </label>
                    <select
                      id="contact-enquiryType"
                      name="enquiryType"
                      value={formData.enquiryType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-sm text-xs sm:text-sm bg-[#020617] border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-colors"
                    >
                      <option value="Project">Project / Systems</option>
                      <option value="Employment">Employment / Contract</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Speaking/Training">Speaking / Training</option>
                      <option value="Support">IT Support / Advisory</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-300 mb-1">
                      Subject <span className="text-[#10B981]">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-subject"
                      name="subject"
                      required
                      placeholder="Brief topic of your enquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-sm text-xs sm:text-sm bg-[#020617] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 mb-1">
                    Message <span className="text-[#10B981]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Describe your inquiry, project scope, or opportunity..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-sm text-xs sm:text-sm bg-[#020617] border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-colors"
                  />
                </div>

                {/* Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      id="contact-consent"
                      name="consent"
                      required
                      checked={formData.consent}
                      onChange={handleChange}
                      className="mt-0.5 w-4 h-4 rounded-xs border-slate-700 bg-[#020617] text-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                    />
                    <span className="text-[11px] text-slate-400 leading-normal">
                      I consent to having Patrick Etomet store and use these contact details solely for responding to this enquiry.{' '}
                      <button
                        type="button"
                        onClick={() => setIsPrivacyModalOpen(true)}
                        className="text-[#10B981] underline hover:text-emerald-300"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-sm text-sm font-bold text-[#020617] bg-[#10B981] hover:bg-[#0D9488] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSubmitting ? (
                      <span>Transmitting securely...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message to Patrick</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
