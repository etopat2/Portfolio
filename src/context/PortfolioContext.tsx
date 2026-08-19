import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, ProjectItem, ContactFormInput } from '../types';
import { initialPortfolioData } from '../data/initialData';

interface ContactSubmissionResponse {
  success: boolean;
  referenceCode?: string;
  message?: string;
  error?: string;
}

export type ViewMode = 'public' | 'admin';

interface PortfolioContextType {
  data: PortfolioData;
  isLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  selectedProject: ProjectItem | null;
  setSelectedProject: (project: ProjectItem | null) => void;
  isCvModalOpen: boolean;
  setIsCvModalOpen: (open: boolean) => void;
  isPrivacyModalOpen: boolean;
  setIsPrivacyModalOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  submitContactForm: (formData: ContactFormInput) => Promise<ContactSubmissionResponse>;
  refreshPublicData: () => Promise<void>;
  // Auth state
  adminToken: string | null;
  adminUser: { id: string; email: string; name: string; role: string } | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (token: string, user: { id: string; email: string; name: string; role: string }) => void;
  logoutAdmin: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<ViewMode>('public');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isCvModalOpen, setIsCvModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');

  // Admin auth
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pe_admin_token');
    }
    return null;
  });

  const [adminUser, setAdminUser] = useState<{ id: string; email: string; name: string; role: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pe_admin_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const isAdminAuthenticated = Boolean(adminToken);

  // Apply theme to html root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pe_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const refreshPublicData = async () => {
    try {
      const res = await fetch('/api/public/content');
      if (res.ok) {
        const fetchedData = await res.json();
        setData(fetchedData);
      }
    } catch (err) {
      console.warn('Using local verified portfolio data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshPublicData();
  }, []);

  const loginAdmin = (token: string, user: { id: string; email: string; name: string; role: string }) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('pe_admin_token', token);
    localStorage.setItem('pe_admin_user', JSON.stringify(user));
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('pe_admin_token');
    localStorage.removeItem('pe_admin_user');
    setCurrentView('public');
  };

  const submitContactForm = async (formData: ContactFormInput): Promise<ContactSubmissionResponse> => {
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: json.error || 'Failed to submit enquiry. Please try again or reach out on WhatsApp.'
        };
      }

      return {
        success: true,
        referenceCode: json.referenceCode,
        message: json.message || 'Thank you—your message has been received. Patrick will respond using the contact details you provided.'
      };
    } catch (err: any) {
      return {
        success: false,
        error: 'Network error submitting your enquiry. Please reach out directly on WhatsApp.'
      };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoading,
        theme,
        toggleTheme,
        selectedProject,
        setSelectedProject,
        isCvModalOpen,
        setIsCvModalOpen,
        isPrivacyModalOpen,
        setIsPrivacyModalOpen,
        activeSection,
        setActiveSection,
        currentView,
        setCurrentView,
        submitContactForm,
        refreshPublicData,
        adminToken,
        adminUser,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
