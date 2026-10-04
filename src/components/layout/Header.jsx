import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, MessageSquare, ExternalLink, User, LogOut, ChevronRight, Sun, Moon } from 'lucide-react';

const Header = ({ onToggleSidebar, mobileSidebarOpen = false, user = { name: 'Admin User', role: 'Administrator', avatar: null } }) => {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('preskool-theme') || 'light');
  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const storedName = localStorage.getItem('preskool-user-name');
  const storedEmail = localStorage.getItem('preskool-email') || localStorage.getItem('preskool-user-email');
  const defaultName = storedName || (storedEmail ? storedEmail.split('@')[0] : (role.charAt(0).toUpperCase() + role.slice(1)));

  const roleDetails = {
    admin: { name: defaultName || 'Administrator', role: 'Administrator', detail: 'School Principal Office' },
    teacher: { name: defaultName || 'Faculty Member', role: 'Teacher', detail: 'Academic Department' },
    staff: { name: defaultName || 'Staff Member', role: 'Staff Member', detail: 'School Administration' },
    student: { name: defaultName || 'Student', role: 'Student', detail: 'Student Portal' },
  }[role] || user;
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('preskool-user-name') || roleDetails.name);
  const popupRef = useRef(null);
  
  // Use a state to check if it's mobile to conditionally render the icon
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('preskool-theme', nextTheme);
    localStorage.setItem('skool-theme', nextTheme);
    window.dispatchEvent(new Event('preskool-settings-change'));
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpenPopup(null);
      }
    };
    const handleNameChange = () => setDisplayName(localStorage.getItem('preskool-user-name') || roleDetails.name);
    const handleSettingsChange = () => {
      const activeTheme = localStorage.getItem('preskool-theme') || localStorage.getItem('skool-theme') || document.documentElement.dataset.theme || 'light';
      setTheme(activeTheme);
    };
    
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('preskool-name-change', handleNameChange);
    window.addEventListener('preskool-settings-change', handleSettingsChange);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('preskool-name-change', handleNameChange);
      window.removeEventListener('preskool-settings-change', handleSettingsChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [roleDetails.name]);

  const togglePopup = (popup) => setOpenPopup(current => current === popup ? null : popup);

  return (
    <header className="app-header" ref={popupRef}>
      <div className="header-left">
        <button
          className={`header-toggle-btn ${mobileSidebarOpen ? 'active' : ''}`}
          onClick={onToggleSidebar}
          title="Toggle Navigation Menu"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="header-mobile-brand" onClick={() => navigate(role === 'student' ? '/dashboard/student' : role === 'teacher' ? '/dashboard/teacher' : '/dashboard')}>
          <img src="/favicon.png" alt="Logo" className="header-mobile-logo" />
          <span className="header-mobile-title">Skool</span>
        </div>
      </div>

      <div className="header-search">
        <Search size={16} className="header-search-icon" />
        <input type="text" placeholder="Search students, teachers, classes..." />

      </div>

      <div className="header-right">
        {/* Bright / Dark Mode Blur Toggle */}
        <button
          className="header-icon-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Bright Mode (White Blur)' : 'Switch to Dark Mode (Dark Blur)'}
          aria-label="Toggle Bright/Dark Mode"
        >
          {theme === 'dark' ? <Sun size={18} className="theme-sun-icon" /> : <Moon size={18} className="theme-moon-icon" />}
        </button>

        <div className="header-popup-anchor">
          <button className="header-icon-btn" onClick={() => togglePopup('messages')} title="Google Chat Messages" aria-expanded={openPopup === 'messages'}>
            <MessageSquare size={18} />
          </button>
          {openPopup === 'messages' && (
            <div className="header-popup" role="dialog" aria-label="Google Chat messages">
              <div className="header-popup-heading">
                <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ac47', display: 'inline-block' }} />
                  Google Chat
                </strong>
              </div>
              <button className="header-popup-item" onClick={() => { setOpenPopup(null); navigate('/messages'); }}>
                <span><strong>Google Chat Panel</strong><small>Direct DMs & Space channels</small></span>
                <ChevronRight size={16} />
              </button>
              <button
                className="header-popup-item"
                onClick={() => { setOpenPopup(null); window.open('https://chat.google.com', '_blank', 'noopener,noreferrer'); }}
              >
                <span><strong>Launch Google Chat Web</strong><small>Open web app in new tab</small></span>
                <ExternalLink size={14} />
              </button>
              <button className="header-popup-link" onClick={() => { setOpenPopup(null); navigate('/messages'); }}>
                Open Google Chat Hub
              </button>
            </div>
          )}
        </div>

        <div className="header-popup-anchor">
          <button className="header-icon-btn" onClick={() => togglePopup('notifications')} title="Notifications" aria-expanded={openPopup === 'notifications'}>
            <Bell size={18} />

          </button>
          {openPopup === 'notifications' && (
            <div className="header-popup" role="dialog" aria-label="Recent notifications">
              <div className="header-popup-heading"><strong>Notifications</strong></div>
              <button className="header-popup-item" onClick={() => navigate('/notifications')}>
                <span><strong>System Status</strong><small>All Systems Operational</small></span><ChevronRight size={16} />
              </button>
              <button className="header-popup-item" onClick={() => navigate('/notices')}>
                <span><strong>School Noticeboard</strong><small>View latest circulars</small></span><ChevronRight size={16} />
              </button>
              <button className="header-popup-link" onClick={() => navigate('/notifications')}>View all announcements</button>
            </div>
          )}
        </div>

        <button className={`header-user role-${role} hover-lift`} type="button" onClick={() => navigate('/profile')} title="View Profile & Role Details">
          <div className="header-avatar">
            {user.avatar ? <img src={user.avatar} alt={displayName} /> : <User size={20} />}
          </div>
          <div className="header-user-info">
            <span className="header-user-name">{displayName}</span>
            <span className="header-user-role">
              <span className={`header-user-role-title role-pill-${role}`}>{roleDetails.role}</span>
              <span className="header-user-role-detail"> | {roleDetails.detail}</span>
            </span>
          </div>
        </button>

        <button className="header-icon-btn" onClick={() => navigate('/login')} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
