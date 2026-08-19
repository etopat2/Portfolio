export type ProjectCategory = 'Systems' | 'Web/PWA' | 'Data' | 'Social Impact' | 'Media' | 'Concept/Prototype';

export type ProjectStatus = 'Active' | 'In Development' | 'Prototype' | 'Initiative / Pilot' | 'Completed' | 'Research';

export type ConfidentialityLevel = 'Public' | 'Safe Public Summary' | 'Restricted (High Level Only)';

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  status: ProjectStatus;
  role: string;
  confidentiality_level: ConfidentialityLevel;
  summary: string;
  challenge: string;
  approach: string;
  contribution: string;
  technologies: string[];
  outcomes: string[];
  image_url?: string;
  external_url?: string;
  github_url?: string;
  gallery?: string[];
  is_published: boolean;
  sort_order: number;
}

export interface ValueCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
  sort_order: number;
  is_published: boolean;
}

export interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  evidenceStatement: string;
  iconName: string;
  sort_order: number;
  is_published: boolean;
}

export interface ExperienceEntry {
  id: string;
  period: string;
  title: string;
  organization: string;
  location?: string;
  description: string;
  highlights: string[];
  sort_order: number;
  is_published: boolean;
}
export type ExperienceItem = ExperienceEntry;

export interface EducationEntry {
  id: string;
  program: string;
  institution: string;
  location: string;
  period: string;
  status: string; // e.g. "Ongoing / Current", "Completed"
  details: string;
  sort_order?: number;
  is_published?: boolean;
}
export type EducationItem = EducationEntry;

export interface CertificationEntry {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  credential_url?: string;
  sort_order?: number;
  is_published?: boolean;
}
export type CertificationItem = CertificationEntry;

export interface SkillCategory {
  id: string;
  category: string;
  skills: string[];
}
export type SkillGroup = SkillCategory;

export interface ImpactItem {
  id: string;
  title: string;
  description: string;
  targetGroup: string;
  badge: string;
  sort_order?: number;
  is_published?: boolean;
}

export interface SocialLinks {
  linkedin: string;
  x: string;
  facebook: string;
  github?: string;
}

export interface ProfileContent {
  fullName: string;
  headline: string;
  supportingHeadline: string;
  location: string;
  email: string;
  phoneDisplay: string;
  whatsappInternational: string;
  whatsappMessage: string;
  socials: SocialLinks;
  heroEyebrow: string;
  heroHeadline: string;
  heroCopy: string;
  aboutTitle: string;
  aboutTheme: string;
  aboutStory: string[];
  monogram: string;
  avatarUrl?: string;
  openGraphImage?: string;
  metaTitle: string;
  metaDescription: string;
  analyticsId?: string;
  accentColor: string;
}

export interface CvDocument {
  id: string;
  displayTitle: string;
  versionDate: string;
  downloadFilename: string;
  is_published: boolean;
  summaryText: string;
  pdfUrl?: string;
}
export type CvContent = CvDocument;

export interface SettingsContent {
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  analyticsId?: string;
  accentColor: string;
  enablePublicContactForm: boolean;
}

export type MessageStatus = 'unread' | 'read' | 'replied' | 'archived';
export type EmailDeliveryStatus = 'delivered' | 'failed' | 'not_configured' | 'pending';

export interface ContactMessage {
  id: string;
  referenceCode: string;
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  enquiryType: 'Project' | 'Employment' | 'Collaboration' | 'Speaking/Training' | 'Support' | 'Other';
  subject: string;
  message: string;
  consent: boolean;
  status: MessageStatus;
  emailDeliveryStatus: EmailDeliveryStatus;
  adminNotes?: string;
  createdAt: string;
  ipAddress?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  details: string;
  createdAt?: string;
  timestamp?: string;
  userEmail: string;
}

export interface EmailDeliveryLog {
  id: string;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'simulated';
  provider: string;
  timestamp: string;
  errorDetails?: string;
}

export interface PortfolioData {
  profile: ProfileContent;
  values: ValueCard[];
  expertise: ExpertiseItem[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  impact: ImpactItem[];
  cv: CvDocument;
  settings: SettingsContent;
}

export interface ContactFormInput {
  fullName: string;
  email: string;
  phone?: string;
  organization?: string;
  enquiryType: 'Project' | 'Employment' | 'Collaboration' | 'Speaking/Training' | 'Support' | 'Other';
  subject: string;
  message: string;
  consent: boolean;
  honeypot?: string;
}
