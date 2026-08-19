import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { sendContactNotificationEmail } from './server/emailAdapter';
import { authenticateAdmin, generateToken, AuthenticatedRequest } from './server/auth';
import { ContactFormInput } from './src/types';

dotenv.config();

// In-memory rate limiting map for contact form submissions: IP -> timestamp[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 6;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return true;
}

// Simple HTML/script tag sanitizer
function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Public: Get published portfolio content
  app.get('/api/public/content', (req, res) => {
    try {
      const data = db.getPublicPortfolioData();
      res.json(data);
    } catch (err: any) {
      console.error('Error fetching public portfolio content:', err);
      res.status(500).json({ error: 'Failed to load portfolio content' });
    }
  });

  // Public: Submit contact form (with validation, bot honeypot, rate limiting, and email adapter)
  app.post('/api/public/contact', async (req, res) => {
    try {
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

      // 1. Rate limiting
      if (!checkRateLimit(ip)) {
        res.status(429).json({
          error: 'Too many messages sent recently. Please wait a few minutes before trying again or connect directly on WhatsApp or Email.'
        });
        return;
      }

      const body = req.body as ContactFormInput;

      // 2. Bot honeypot check (if honeypot field is filled, silently ignore spam bot)
      if (body.honeypot && body.honeypot.trim().length > 0) {
        // Return fake success to confuse spam bots
        res.json({
          success: true,
          referenceCode: 'PE-SPAM-FILTERED',
          message: 'Thank you—your message has been received. Patrick will respond using the contact details you provided.'
        });
        return;
      }

      // 3. Validation
      const fullName = sanitizeInput(body.fullName);
      const email = sanitizeInput(body.email).toLowerCase();
      const subject = sanitizeInput(body.subject);
      const message = sanitizeInput(body.message);
      const phone = body.phone ? sanitizeInput(body.phone) : undefined;
      const organization = body.organization ? sanitizeInput(body.organization) : undefined;
      const enquiryType = body.enquiryType || 'Other';
      const consent = Boolean(body.consent);

      if (!fullName || fullName.length < 2) {
        res.status(400).json({ error: 'Please provide your full name.' });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        res.status(400).json({ error: 'Please provide a valid email address.' });
        return;
      }

      if (!subject || subject.length < 3) {
        res.status(400).json({ error: 'Please provide a descriptive subject.' });
        return;
      }

      if (!message || message.length < 10) {
        res.status(400).json({ error: 'Please write a message with at least 10 characters.' });
        return;
      }

      if (!consent) {
        res.status(400).json({ error: 'Please acknowledge the privacy consent checkbox.' });
        return;
      }

      // 4. Save to database (the single source of truth)
      const savedMessage = db.addContactMessage(
        {
          fullName,
          email,
          phone,
          organization,
          enquiryType,
          subject,
          message,
          consent
        },
        ip
      );

      // 5. Attempt transactional email dispatch asynchronously (never breaks form submission)
      sendContactNotificationEmail(savedMessage).catch(err => {
        console.error('Async email dispatch error:', err);
      });

      // 6. Return verified confirmation with reference code
      res.json({
        success: true,
        referenceCode: savedMessage.referenceCode,
        message: 'Thank you—your message has been received. Patrick will respond using the contact details you provided.'
      });
    } catch (err: any) {
      console.error('Error handling contact submission:', err);
      res.status(500).json({ error: 'An unexpected server error occurred while processing your message. Please try again or reach out directly on WhatsApp.' });
    }
  });

  // --- AUTH ROUTES ---

  // Admin login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      const user = db.findAdminByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials or unauthorized email' });
        return;
      }

      const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      db.updateAdminLastLogin(user.email);
      db.addAuditLog('LOGIN', 'AUTH', `Successful login for ${user.email}`, user.email);

      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      });

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login service failed' });
    }
  });

  // Verify auth session
  app.get('/api/auth/me', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  });

  // Update password
  app.post('/api/auth/change-password', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!newPassword || newPassword.length < 8) {
        res.status(400).json({ error: 'New password must be at least 8 characters long' });
        return;
      }

      const user = db.findAdminByEmail(req.user!.email);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const isCurrentValid = bcrypt.compareSync(currentPassword, user.passwordHash);
      if (!isCurrentValid) {
        res.status(400).json({ error: 'Current password does not match' });
        return;
      }

      db.updateAdminPassword(user.email, newPassword);
      res.json({ success: true, message: 'Password updated successfully' });
    } catch (err: any) {
      console.error('Password change error:', err);
      res.status(500).json({ error: 'Failed to update password' });
    }
  });

  // --- PROTECTED ADMIN ROUTES ---

  // Get full data (including unpublished drafts)
  app.get('/api/admin/all-data', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const data = db.getAllPortfolioData();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch admin portfolio data' });
    }
  });

  // Update a specific section
  app.post('/api/admin/update-section', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const { section, data } = req.body;
      if (!section || data === undefined) {
        res.status(400).json({ error: 'Section name and data are required' });
        return;
      }

      db.updatePortfolioSection(section, data, req.user!.email);
      res.json({ success: true, message: `Section '${section}' updated successfully.` });
    } catch (err: any) {
      console.error('Update section error:', err);
      res.status(500).json({ error: 'Failed to update section' });
    }
  });

  // Upload image (base64 image payload saved to public/uploads directory)
  app.post('/api/admin/upload-image', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const { filename, dataUrl } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        res.status(400).json({ error: 'Image data URL is required' });
        return;
      }

      // Check if it's base64 dataUrl
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let ext = 'jpg';
      let buffer: Buffer;

      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        if (mimeType.includes('png')) ext = 'png';
        else if (mimeType.includes('webp')) ext = 'webp';
        else if (mimeType.includes('gif')) ext = 'gif';
        else if (mimeType.includes('svg')) ext = 'svg+xml';
        buffer = Buffer.from(matches[2], 'base64');
      } else if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/')) {
        // Already a URL
        res.json({ success: true, url: dataUrl });
        return;
      } else {
        res.status(400).json({ error: 'Invalid image format. Expected data URL or web link.' });
        return;
      }

      const safeName = (filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '_') : `portrait_${Date.now()}`).substring(0, 30);
      const outputFilename = `${safeName}_${Date.now()}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, outputFilename);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${outputFilename}`;
      db.addAuditLog('UPLOAD_IMAGE', 'MEDIA', `Uploaded image ${publicUrl}`, req.user!.email);

      res.json({ success: true, url: publicUrl, filename: outputFilename });
    } catch (err: any) {
      console.error('Image upload error:', err);
      res.status(500).json({ error: 'Failed to process image upload' });
    }
  });

  // Reset portfolio data to default seed
  app.post('/api/admin/reset-defaults', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      db.resetPortfolioToDefault(req.user!.email);
      res.json({ success: true, message: 'Portfolio data reset to verified default content.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to reset portfolio data' });
    }
  });

  // Get contact inbox messages
  app.get('/api/admin/messages', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const status = req.query.status as string;
      const search = req.query.search as string;
      const messages = db.getContactMessages({ status, search });
      res.json({ messages });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve messages' });
    }
  });

  // Update message status or notes
  app.patch('/api/admin/messages/:id', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;
      const updated = db.updateContactMessage(id, { status, adminNotes }, req.user!.email);
      if (!updated) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }
      res.json({ success: true, message: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update message' });
    }
  });

  // Delete message
  app.delete('/api/admin/messages/:id', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const deleted = db.deleteContactMessage(id, req.user!.email);
      if (!deleted) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }
      res.json({ success: true, message: 'Message removed' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete message' });
    }
  });

  // Export messages to CSV
  app.get('/api/admin/messages-export-csv', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const messages = db.getContactMessages();
      const headers = ['Reference Code', 'Full Name', 'Email', 'Phone', 'Organization', 'Enquiry Type', 'Subject', 'Message', 'Status', 'Email Delivery', 'Date'];
      const rows = messages.map(m => [
        `"${m.referenceCode}"`,
        `"${(m.fullName || '').replace(/"/g, '""')}"`,
        `"${(m.email || '').replace(/"/g, '""')}"`,
        `"${(m.phone || '').replace(/"/g, '""')}"`,
        `"${(m.organization || '').replace(/"/g, '""')}"`,
        `"${(m.enquiryType || '').replace(/"/g, '""')}"`,
        `"${(m.subject || '').replace(/"/g, '""')}"`,
        `"${(m.message || '').replace(/"/g, '""')}"`,
        `"${m.status}"`,
        `"${m.emailDeliveryStatus}"`,
        `"${m.createdAt}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=patrick_etomet_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
      res.send(csvContent);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate CSV export' });
    }
  });

  // Get audit logs
  app.get('/api/admin/audit-logs', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const logs = db.getAuditLogs(100);
      res.json({ logs });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load audit logs' });
    }
  });

  // Get email delivery logs
  app.get('/api/admin/email-logs', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const logs = db.getEmailLogs(50);
      const isConfigured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== '');
      res.json({ logs, isConfigured });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to load email logs' });
    }
  });

  // System settings
  app.get('/api/admin/settings', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    res.json(db.getSettings());
  });

  app.post('/api/admin/settings', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const updated = db.updateSettings(req.body, req.user!.email);
      res.json({ success: true, settings: updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // Cleanup old messages
  app.post('/api/admin/cleanup-messages', authenticateAdmin, (req: AuthenticatedRequest, res) => {
    try {
      const deletedCount = db.cleanupOldMessages(req.user!.email);
      res.json({ success: true, deletedCount });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to run retention cleanup' });
    }
  });

  // Static file serving for uploads and public assets
  const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsPath));
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware for dev or static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Patrick Etomet Portfolio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
