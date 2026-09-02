import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Mail, User, LogOut, ChevronRight } from 'lucide-react';

const Header = ({ onToggleSidebar, user = { name: 'Admin User', role: 'Administrator', avatar: null } }) => {
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(null);
  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const roleDetails = {
    admin: { name: 'Admin User', role: 'Administrator', detail: 'School Principal Office' },
    teacher: { name: 'Sarah Connor', role: 'Teacher', detail: 'Mathematics Department' },
    staff: { name: 'Michael Adebayo', role: 'Staff Member', detail: 'School Administration' },
    student: { name: 'Janet Adebayo', role: 'Student', detail: 'Grade 10-A' },
  }[role] || user;
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('preskool-user-name') || roleDetails.name);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpenPopup(null);
      }
    };
    const handleNameChange = () => setDisplayName(localStorage.getItem('preskool-user-name') || roleDetails.name);

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('preskool-name-change', handleNameChange);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('preskool-name-change', handleNameChange);
    };
  }, [roleDetails.name]);

  const togglePopup = (popup) => setOpenPopup(current => current === popup ? null : popup);

  return (
    <header className="app-header" ref={popupRef}>
      <div className="header-left">
        <button className="header-toggle-btn" onClick={onToggleSidebar} title="Toggle Sidebar">
          <Menu size={20} />
        </button>
      </div>

      <div className="header-search">
        <Search size={16} className="header-search-icon" />
        <input type="text" placeholder="Search students, teachers, classes..." />
      </div>

      <div className="header-right">
        <div className="header-popup-anchor">
          <button className="header-icon-btn" onClick={() => togglePopup('messages')} title="Messages" aria-expanded={openPopup === 'messages'}>
          <Mail size={18} />
            <span className="badge">2</span>
          </button>
          {openPopup === 'messages' && (
            <div className="header-popup" role="dialog" aria-label="Recent messages">
              <div className="header-popup-heading"><strong>Messages</strong><span>2 new</span></div>
              <button className="header-popup-item" onClick={() => navigate('/messages')}>
                <span><strong>Dr. Sarah Connor</strong><small>Review the math syllabus update</small></span><ChevronRight size={16} />
              </button>
              <button className="header-popup-item" onClick={() => navigate('/messages')}>
                <span><strong>Michael Adebayo</strong><small>Thank you for the update on Janet</small></span><ChevronRight size={16} />
              </button>
              <button className="header-popup-link" onClick={() => navigate('/messages')}>View all messages</button>
            </div>
          )}
        </div>

        <div className="header-popup-anchor">
          <button className="header-icon-btn" onClick={() => togglePopup('notifications')} title="Notifications" aria-expanded={openPopup === 'notifications'}>
          <Bell size={18} />
            <span className="badge">3</span>
          </button>
          {openPopup === 'notifications' && (
            <div className="header-popup" role="dialog" aria-label="Recent notifications">
              <div className="header-popup-heading"><strong>Notifications</strong><span>3 new</span></div>
              <button className="header-popup-item" onClick={() => navigate('/notifications')}><span><strong>New leave request</strong><small>Mr. Alan Turing submitted a request</small></span><ChevronRight size={16} /></button>
              <button className="header-popup-item" onClick={() => navigate('/notifications')}><span><strong>Fee payment received</strong><small>Janet Adebayo paid the tuition fee</small></span><ChevronRight size={16} /></button>
              <button className="header-popup-item" onClick={() => navigate('/notifications')}><span><strong>Low inventory alert</strong><small>Whiteboard marker stock is low</small></span><ChevronRight size={16} /></button>
              <button className="header-popup-link" onClick={() => navigate('/notifications')}>View all notifications</button>
            </div>
          )}
        </div>

          <button className="header-user" type="button" onClick={() => navigate('/profile')}>
          <div className="header-avatar">
            {user.avatar ? <img src={user.avatar} alt={displayName} /> : <User size={20} />}
          </div>
          <div className="header-user-info">
            <span className="header-user-name">{displayName}</span>
            <span className="header-user-role">{roleDetails.role} | {roleDetails.detail}</span>
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
