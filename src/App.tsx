/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Expertise } from './components/Expertise';
import { Journey } from './components/Journey';
import { Projects } from './components/Projects';
import { EducationAndSkills } from './components/EducationAndSkills';
import { Impact } from './components/Impact';
import { CvSection } from './components/CvSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { CvModal } from './components/CvModal';
import { PrivacyModal } from './components/PrivacyModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainPortfolio: React.FC = () => {
  const { currentView, setCurrentView, isAdminAuthenticated } = usePortfolio();

  // Listen to browser hash or path changes for #admin or /admin
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('public');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [setCurrentView]);

  if (currentView === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onBackToSite={() => {
            window.location.hash = '';
            setCurrentView('public');
          }}
        />
      );
    }
    return (
      <AdminDashboard
        onBackToSite={() => {
          window.location.hash = '';
          setCurrentView('public');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      
      {/* Navigation Bar */}
      <Header onOpenAdmin={() => {
        window.location.hash = '#admin';
        setCurrentView('admin');
      }} />

      {/* Main Public Content Sections */}
      <main id="main-content">
        <Hero />
        <About />
        <Expertise />
        <Journey />
        <Projects />
        <EducationAndSkills />
        <Impact />
        <CvSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => {
        window.location.hash = '#admin';
        setCurrentView('admin');
      }} />

      {/* Interactive Floating Modals */}
      <ProjectModal />
      <CvModal />
      <PrivacyModal />

    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <MainPortfolio />
    </PortfolioProvider>
  );
}
