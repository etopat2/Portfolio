import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { initialPortfolioData } from '../src/data/initialData';
import { PortfolioData, ContactMessage, AuditLog, ContactFormInput, MessageStatus } from '../src/types';

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export interface EmailLog {
  id: string;
  messageId: string;
  referenceCode: string;
  recipient: string;
  subject: string;
  status: 'delivered' | 'failed' | 'not_configured' | 'mock_simulated';
  errorDetails?: string;
  provider: string;
  createdAt: string;
}

interface DatabaseSchema {
  portfolioData: PortfolioData;
  adminUsers: AdminUser[];
  contactMessages: ContactMessage[];
  auditLogs: AuditLog[];
  emailLogs: EmailLog[];
  settings: {
    retentionDays: number;
    allowlistEmails: string[];
    emailNotificationEnabled: boolean;
    notifyEmail: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Allowed admin emails by default
const DEFAULT_ALLOWLIST = ['etomet2patrick@gmail.com', 'etopatt2@gmail.com'];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadDatabase();
    this.ensureInitialAdmin();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (err) {
        console.error('Failed to create data directory:', err);
      }
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all required top-level keys exist
        return {
          portfolioData: parsed.portfolioData || initialPortfolioData,
          adminUsers: parsed.adminUsers || [],
          contactMessages: parsed.contactMessages || [],
          auditLogs: parsed.auditLogs || [],
          emailLogs: parsed.emailLogs || [],
          settings: {
            retentionDays: parsed.settings?.retentionDays ?? 365,
            allowlistEmails: parsed.settings?.allowlistEmails || DEFAULT_ALLOWLIST,
            emailNotificationEnabled: parsed.settings?.emailNotificationEnabled ?? true,
            notifyEmail: parsed.settings?.notifyEmail || 'etomet2patrick@gmail.com',
          }
        };
      }
    } catch (err) {
      console.error('Error reading database file, using fallback initial data:', err);
    }

    const defaultDb: DatabaseSchema = {
      portfolioData: initialPortfolioData,
      adminUsers: [],
      contactMessages: [],
      auditLogs: [
        {
          id: 'log-init',
          action: 'SYSTEM_INIT',
          entity: 'DATABASE',
          details: 'Initial database created and seeded with Patrick Etomet portfolio verified data.',
          createdAt: new Date().toISOString(),
          userEmail: 'system'
        }
      ],
      emailLogs: [],
      settings: {
        retentionDays: 365,
        allowlistEmails: DEFAULT_ALLOWLIST,
        emailNotificationEnabled: true,
        notifyEmail: 'etomet2patrick@gmail.com',
      }
    };

    this.saveDatabase(defaultDb);
    return defaultDb;
  }

  private saveDatabase(dataToSave: DatabaseSchema = this.data): void {
    try {
      this.ensureDirectory();
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  private ensureInitialAdmin(): void {
    // If no admin user exists, create default admin with a pre-configured or setup-ready hash
    if (this.data.adminUsers.length === 0) {
      // Default password hash for initial secure setup: "PatrickUganda2026!"
      const salt = bcrypt.genSaltSync(10);
      const defaultHash = bcrypt.hashSync('PatrickUganda2026!', salt);

      const adminUser: AdminUser = {
        id: 'usr-admin-1',
        email: 'etomet2patrick@gmail.com',
        name: 'Patrick Etomet',
        passwordHash: defaultHash,
        role: 'super_admin',
        createdAt: new Date().toISOString(),
      };

      // Also allow current user's email if distinct
      const secondaryAdmin: AdminUser = {
        id: 'usr-admin-2',
        email: 'etopatt2@gmail.com',
        name: 'Patrick Etomet (Alternate)',
        passwordHash: defaultHash,
        role: 'super_admin',
        createdAt: new Date().toISOString(),
      };

      this.data.adminUsers.push(adminUser, secondaryAdmin);
      this.saveDatabase();
    }
  }

  // --- Portfolio Data Methods ---
  public getPublicPortfolioData(): PortfolioData {
    // Return filtered published items for public view
    const p = this.data.portfolioData;
    return {
      profile: p.profile,
      values: p.values.filter(v => v.is_published).sort((a, b) => a.sort_order - b.sort_order),
      expertise: p.expertise.filter(e => e.is_published).sort((a, b) => a.sort_order - b.sort_order),
      experience: p.experience.filter(e => e.is_published).sort((a, b) => a.sort_order - b.sort_order),
      education: p.education.filter(e => e.is_published).sort((a, b) => a.sort_order - b.sort_order),
      certifications: p.certifications.filter(c => c.is_published).sort((a, b) => a.sort_order - b.sort_order),
      skills: p.skills,
      projects: p.projects.filter(pr => pr.is_published).sort((a, b) => a.sort_order - b.sort_order),
      impact: p.impact.filter(i => i.is_published).sort((a, b) => a.sort_order - b.sort_order),
      cv: p.cv,
      settings: p.settings
    };
  }

  public getAllPortfolioData(): PortfolioData {
    return this.data.portfolioData;
  }

  public updatePortfolioSection<K extends keyof PortfolioData>(section: K, value: PortfolioData[K], userEmail: string): void {
    this.data.portfolioData[section] = value;
    this.addAuditLog('UPDATE_SECTION', section.toUpperCase(), `Updated section: ${String(section)}`, userEmail);
    this.saveDatabase();
  }

  public resetPortfolioToDefault(userEmail: string): void {
    this.data.portfolioData = JSON.parse(JSON.stringify(initialPortfolioData));
    this.addAuditLog('RESET_DATA', 'PORTFOLIO', 'Reset all portfolio data to verified initial seed content', userEmail);
    this.saveDatabase();
  }

  // --- Contact Messages Methods ---
  public addContactMessage(input: ContactFormInput, ipAddress?: string): ContactMessage {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const referenceCode = `PE-${year}-${randomHex}`;

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}-${randomHex}`,
      referenceCode,
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone ? input.phone.trim() : undefined,
      organization: input.organization ? input.organization.trim() : undefined,
      enquiryType: input.enquiryType || 'Other',
      subject: input.subject.trim(),
      message: input.message.trim(),
      consent: Boolean(input.consent),
      status: 'unread',
      emailDeliveryStatus: 'not_configured',
      createdAt: new Date().toISOString(),
      ipAddress: ipAddress || 'unknown'
    };

    this.data.contactMessages.unshift(newMessage);
    this.saveDatabase();
    return newMessage;
  }

  public updateMessageEmailDelivery(id: string, status: ContactMessage['emailDeliveryStatus']): void {
    const msg = this.data.contactMessages.find(m => m.id === id);
    if (msg) {
      msg.emailDeliveryStatus = status;
      this.saveDatabase();
    }
  }

  public getContactMessages(filter?: { status?: string; search?: string }): ContactMessage[] {
    let result = [...this.data.contactMessages];

    if (filter?.status && filter.status !== 'all') {
      result = result.filter(m => m.status === filter.status);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(m =>
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.referenceCode.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getMessageById(id: string): ContactMessage | undefined {
    return this.data.contactMessages.find(m => m.id === id);
  }

  public updateContactMessage(id: string, updates: Partial<ContactMessage>, userEmail: string): ContactMessage | null {
    const index = this.data.contactMessages.findIndex(m => m.id === id);
    if (index === -1) return null;

    this.data.contactMessages[index] = {
      ...this.data.contactMessages[index],
      ...updates
    };

    this.addAuditLog('UPDATE_MESSAGE', 'CONTACT_INBOX', `Updated status/notes for message ${this.data.contactMessages[index].referenceCode}`, userEmail);
    this.saveDatabase();
    return this.data.contactMessages[index];
  }

  public deleteContactMessage(id: string, userEmail: string): boolean {
    const msg = this.data.contactMessages.find(m => m.id === id);
    if (!msg) return false;

    this.data.contactMessages = this.data.contactMessages.filter(m => m.id !== id);
    this.addAuditLog('DELETE_MESSAGE', 'CONTACT_INBOX', `Deleted message reference ${msg.referenceCode}`, userEmail);
    this.saveDatabase();
    return true;
  }

  public cleanupOldMessages(userEmail: string): number {
    const retentionDays = this.data.settings.retentionDays || 365;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const initialCount = this.data.contactMessages.length;
    this.data.contactMessages = this.data.contactMessages.filter(m => {
      const created = new Date(m.createdAt);
      return created >= cutoffDate;
    });

    const deletedCount = initialCount - this.data.contactMessages.length;
    if (deletedCount > 0) {
      this.addAuditLog('RETENTION_CLEANUP', 'CONTACT_INBOX', `Automated cleanup removed ${deletedCount} messages older than ${retentionDays} days`, userEmail);
      this.saveDatabase();
    }
    return deletedCount;
  }

  // --- Admin User Methods ---
  public findAdminByEmail(email: string): AdminUser | undefined {
    const normalized = email.trim().toLowerCase();
    return this.data.adminUsers.find(u => u.email.toLowerCase() === normalized);
  }

  public isEmailAllowlisted(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    return this.data.settings.allowlistEmails.some(e => e.toLowerCase() === normalized);
  }

  public addAdminUser(email: string, password: string, name: string, creatorEmail: string): AdminUser {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    this.data.adminUsers.push(newUser);
    if (!this.data.settings.allowlistEmails.includes(newUser.email)) {
      this.data.settings.allowlistEmails.push(newUser.email);
    }

    this.addAuditLog('CREATE_ADMIN', 'ADMIN_USER', `Added new admin: ${newUser.email}`, creatorEmail);
    this.saveDatabase();
    return newUser;
  }

  public updateAdminPassword(email: string, newPassword: string): boolean {
    const admin = this.findAdminByEmail(email);
    if (!admin) return false;

    const salt = bcrypt.genSaltSync(10);
    admin.passwordHash = bcrypt.hashSync(newPassword, salt);
    this.addAuditLog('CHANGE_PASSWORD', 'ADMIN_SECURITY', `Password updated for ${email}`, email);
    this.saveDatabase();
    return true;
  }

  public updateAdminLastLogin(email: string): void {
    const admin = this.findAdminByEmail(email);
    if (admin) {
      admin.lastLogin = new Date().toISOString();
      this.saveDatabase();
    }
  }

  // --- Audit & Email Logs ---
  public addAuditLog(action: string, entity: string, details: string, userEmail: string): void {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      entity,
      details,
      createdAt: new Date().toISOString(),
      userEmail
    };
    this.data.auditLogs.unshift(log);
    // Keep max 500 audit logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.saveDatabase();
  }

  public getAuditLogs(limit: number = 100): AuditLog[] {
    return this.data.auditLogs.slice(0, limit);
  }

  public addEmailLog(log: Omit<EmailLog, 'id' | 'createdAt'>): EmailLog {
    const newLog: EmailLog = {
      ...log,
      id: `elog-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.emailLogs.unshift(newLog);
    if (this.data.emailLogs.length > 200) {
      this.data.emailLogs = this.data.emailLogs.slice(0, 200);
    }
    this.saveDatabase();
    return newLog;
  }

  public getEmailLogs(limit: number = 50): EmailLog[] {
    return this.data.emailLogs.slice(0, limit);
  }

  public getSettings() {
    return this.data.settings;
  }

  public updateSettings(newSettings: Partial<DatabaseSchema['settings']>, userEmail: string) {
    this.data.settings = {
      ...this.data.settings,
      ...newSettings
    };
    this.addAuditLog('UPDATE_SETTINGS', 'SYSTEM_SETTINGS', 'Updated system & notification settings', userEmail);
    this.saveDatabase();
    return this.data.settings;
  }
}

export const db = new Database();
