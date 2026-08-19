import { ContactMessage } from '../src/types';
import { db } from './db';

export interface EmailDispatchResult {
  status: 'delivered' | 'failed' | 'not_configured';
  provider: string;
  error?: string;
}

export async function sendContactNotificationEmail(message: ContactMessage): Promise<EmailDispatchResult> {
  const recipient = process.env.NOTIFICATION_TO_EMAIL || 'etomet2patrick@gmail.com';
  const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'portfolio@resend.dev';
  const resendApiKey = process.env.RESEND_API_KEY;

  const emailSubject = `[Portfolio Enquiry] ${message.enquiryType}: ${message.subject} (${message.referenceCode})`;

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
      <div style="background-color: #0f172a; padding: 16px 20px; border-radius: 6px; margin-bottom: 20px;">
        <h2 style="color: #ffffff; margin: 0; font-size: 18px;">New Portfolio Contact Message</h2>
        <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Reference Code: <strong style="color: #10b981;">${message.referenceCode}</strong></p>
      </div>

      <div style="margin-bottom: 16px;">
        <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: bold;">Sender Details</p>
        <p style="margin: 0; font-size: 15px; font-weight: 600; color: #0f172a;">${message.fullName}</p>
        <p style="margin: 2px 0; font-size: 14px; color: #0d9488;"><a href="mailto:${message.email}" style="color: #0d9488; text-decoration: none;">${message.email}</a></p>
        ${message.phone ? `<p style="margin: 2px 0; font-size: 14px; color: #334155;">Phone/WhatsApp: <strong>${message.phone}</strong></p>` : ''}
        ${message.organization ? `<p style="margin: 2px 0; font-size: 14px; color: #334155;">Organization: <strong>${message.organization}</strong></p>` : ''}
      </div>

      <div style="margin-bottom: 16px; padding: 12px; background-color: #f8fafc; border-left: 4px solid #0d9488; border-radius: 4px;">
        <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold;">Enquiry Type</p>
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #0f172a;">${message.enquiryType} — ${message.subject}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold;">Message</p>
        <div style="padding: 16px; background-color: #f1f5f9; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${message.message}</div>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

      <div style="font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between;">
        <span>Sent from Patrick Etomet Portfolio</span>
        <span>${new Date(message.createdAt).toUTCString()}</span>
      </div>
    </div>
  `;

  // If Resend API Key is available, dispatch via Resend REST API
  if (resendApiKey && resendApiKey.trim() !== '' && resendApiKey !== 'MY_RESEND_API_KEY') {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [recipient],
          reply_to: message.email,
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      if (response.ok) {
        db.addEmailLog({
          messageId: message.id,
          referenceCode: message.referenceCode,
          recipient,
          subject: emailSubject,
          status: 'delivered',
          provider: 'Resend API'
        });
        db.updateMessageEmailDelivery(message.id, 'delivered');
        return { status: 'delivered', provider: 'Resend API' };
      } else {
        const errorText = await response.text();
        console.error('Resend email delivery failed:', errorText);
        db.addEmailLog({
          messageId: message.id,
          referenceCode: message.referenceCode,
          recipient,
          subject: emailSubject,
          status: 'failed',
          errorDetails: errorText.slice(0, 300),
          provider: 'Resend API'
        });
        db.updateMessageEmailDelivery(message.id, 'failed');
        return { status: 'failed', provider: 'Resend API', error: errorText };
      }
    } catch (err: any) {
      console.error('Exception during email send:', err);
      db.addEmailLog({
        messageId: message.id,
        referenceCode: message.referenceCode,
        recipient,
        subject: emailSubject,
        status: 'failed',
        errorDetails: String(err?.message || err),
        provider: 'Resend API'
      });
      db.updateMessageEmailDelivery(message.id, 'failed');
      return { status: 'failed', provider: 'Resend API', error: String(err?.message || err) };
    }
  }

  // If no email API key is configured, log as 'not_configured' and keep message safely stored
  db.addEmailLog({
    messageId: message.id,
    referenceCode: message.referenceCode,
    recipient,
    subject: emailSubject,
    status: 'not_configured',
    errorDetails: 'Transactional email provider (RESEND_API_KEY) is not configured in server environment secrets. Message safely stored in database inbox.',
    provider: 'Local DB Storage'
  });
  db.updateMessageEmailDelivery(message.id, 'not_configured');

  return {
    status: 'not_configured',
    provider: 'Local DB Storage',
    error: 'RESEND_API_KEY environment secret is not set. Enquiry saved securely to database.'
  };
}
