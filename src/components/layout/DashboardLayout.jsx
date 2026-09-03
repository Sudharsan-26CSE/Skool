import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Breadcrumbs from '../common/Breadcrumbs';

const DashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarIsCollapsed = sidebarCollapsed && !sidebarHovered;

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(prev => !prev);
      return;
    }

    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="dashboard-layout">
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
        <Header onToggleSidebar={toggleSidebar} />
          <main className="dashboard-content page-enter">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
