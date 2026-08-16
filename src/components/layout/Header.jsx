import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Mail, User, LogOut } from 'lucide-react';

const Header = ({ onToggleSidebar, user = { name: 'Admin User', role: 'Administrator', avatar: null } }) => {
  const navigate = useNavigate();

  return (
    <header className="app-header">
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
        <button className="header-icon-btn" onClick={() => navigate('/messages')} title="Messages">
          <Mail size={18} />
          <span className="badge"></span>
        </button>

        <button className="header-icon-btn" onClick={() => navigate('/notifications')} title="Notifications">
          <Bell size={18} />
          <span className="badge"></span>
        </button>

        <div className="header-user" onClick={() => navigate('/profile')}>
          <div className="header-avatar">
            {user.avatar ? <img src={user.avatar} alt={user.name} /> : <User size={20} />}
          </div>
          <div className="header-user-info">
            <span className="header-user-name">{user.name}</span>
            <span className="header-user-role">{user.role}</span>
          </div>
        </div>

        <button className="header-icon-btn" onClick={() => navigate('/')} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
