import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, Mail, User, LogOut } from 'lucide-react';

const Header = ({ onToggleSidebar, user = { name: 'Admin User', role: 'Administrator', avatar: null } }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/student')) return 'Dashboard / Student View';
    if (path.includes('/dashboard/teacher')) return 'Dashboard / Teacher View';
    if (path.includes('/dashboard')) return 'Dashboard / Overview';
    if (path.includes('/students/add')) return 'Students / Add New Student';
    if (path.includes('/students/')) return 'Students / Details';
    if (path.includes('/students')) return 'Students / List';
    if (path.includes('/teachers')) return 'Teachers / Overview';
    if (path.includes('/staff')) return 'Staff Management';
    if (path.includes('/classes')) return 'Academics / Classes';
    if (path.includes('/subjects')) return 'Academics / Subjects';
    if (path.includes('/timetable')) return 'Academics / Timetable';
    if (path.includes('/exam-results')) return 'Academics / Exam Results';
    if (path.includes('/assignments')) return 'Academics / Assignments';
    if (path.includes('/online-classes')) return 'Academics / Virtual Classrooms';
    if (path.includes('/attendance')) return 'Management / Attendance';
    if (path.includes('/leave-management')) return 'Management / Leave Requests';
    if (path.includes('/fees')) return 'Finance / Fee Collection';
    if (path.includes('/payroll')) return 'Finance / Payroll';
    if (path.includes('/accounts')) return 'Finance / Accounting';
    if (path.includes('/notice-board')) return 'Communication / Notice Board';
    if (path.includes('/messages')) return 'Communication / Messages';
    if (path.includes('/notifications')) return 'Communication / Notifications';
    if (path.includes('/library')) return 'Facilities / Library';
    if (path.includes('/transport')) return 'Facilities / Transport';
    if (path.includes('/hostel')) return 'Facilities / Hostel';
    if (path.includes('/inventory')) return 'Facilities / Inventory';
    if (path.includes('/reports')) return 'System / Analytics & Reports';
    if (path.includes('/calendar')) return 'System / Calendar';
    if (path.includes('/profile')) return 'System / User Profile';
    if (path.includes('/settings')) return 'System / Settings';
    return 'PreSkool ERP';
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="header-toggle-btn" onClick={onToggleSidebar} title="Toggle Sidebar">
          <Menu size={20} />
        </button>
        <div className="header-breadcrumb">
          <span>{getBreadcrumb()}</span>
        </div>
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
