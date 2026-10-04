import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from '../common/Breadcrumbs';
import AICopilotModal from '../common/AICopilotModal';
import { getUserUIPreferences, applyUserUIPreferences } from '../../services/aiCopilotService';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Apply this specific user's personalized UI theme upon layout render
  useEffect(() => {
    const userEmail = localStorage.getItem('preskool-email') || '';
    const prefs = getUserUIPreferences(userEmail);
    applyUserUIPreferences(prefs);
  }, []);

  const sidebarIsCollapsed = sidebarCollapsed && !sidebarHovered;

  const toggleSidebar = () => {
    const isMobile = window.innerWidth <= 768 || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    if (isMobile) {
      setMobileSidebarOpen(prev => !prev);
      return;
    }

    setSidebarCollapsed(prev => !prev);
  };

  // Close mobile sidebar on window resize > 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileSidebarOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileSidebarOpen]);

  return (
    <div className="dashboard-layout">
      {/* Ambient Glass Aurora Blur Background for all screens */}
      <div className="glass-aurora-bg" aria-hidden="true">
        <div className="aurora-blob blob-1" />
        <div className="aurora-blob blob-2" />
        <div className="aurora-blob blob-3" />
        <div className="aurora-blob blob-4" />
      </div>
      <Sidebar
        collapsed={sidebarIsCollapsed && !mobileSidebarOpen}
        mobileOpen={mobileSidebarOpen}
        onNavigate={() => setMobileSidebarOpen(false)}
        onMouseEnter={() => window.innerWidth > 768 && setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      />
      {mobileSidebarOpen && (
        <button
          className="sidebar-overlay"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <div className={`dashboard-main ${sidebarIsCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header onToggleSidebar={toggleSidebar} mobileSidebarOpen={mobileSidebarOpen} />
        <main key={location.pathname} className="dashboard-content gentle-page-transition">
          <Breadcrumbs />
          <div className="page-transition-inner">
            {children}
          </div>
        </main>
      </div>

      {/* Floating AI Copilot for All Roles */}
      <AICopilotModal />
    </div>
  );
};

export default DashboardLayout;
