import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  Clock,
  Award,
  DollarSign,
  Bell,
  MessageSquare,
  FileText,
  Library,
  Bus,
  Building,
  Box,
  UserX,
  PieChart,
  Settings,
  User,
  BookCheck,
  Video,
  CreditCard,
  Building2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const Sidebar = ({ collapsed, mobileOpen, onNavigate, onMouseEnter, onMouseLeave }) => {
  const role = localStorage.getItem('preskool-role') || 'admin';
  const navSections = [
    {
      title: 'Main',
      items: [
        { path: '/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
        { path: '/dashboard/student', label: 'Student Dashboard', icon: GraduationCap },
        { path: '/dashboard/teacher', label: 'Teacher Dashboard', icon: Users },
      ]
    },
    {
      title: 'People',
      items: [
        { path: '/students', label: 'Students', icon: GraduationCap },
        { path: '/teachers', label: 'Teachers', icon: Users },
        { path: '/staff', label: 'Staff Management', icon: UserCheck },
      ]
    },
    {
      title: 'Academics',
      items: [
        { path: '/classes', label: 'Class Management', icon: Building2 },
        { path: '/subjects', label: 'Subjects', icon: BookOpen },
        { path: '/timetable', label: 'Timetable', icon: Clock },
        { path: '/exam-results', label: 'Exam Results', icon: Award },
        { path: '/assignments', label: 'Assignments', icon: BookCheck },
        { path: '/online-classes', label: 'Online Classes', icon: Video },
      ]
    },
    {
      title: 'Management',
      items: [
        { path: '/attendance', label: 'Attendance', icon: Calendar },
        { path: '/leave-management', label: 'Leave Requests', icon: UserX },
        { path: '/fees', label: 'Fee Management', icon: DollarSign },
        { path: '/payroll', label: 'Payroll', icon: CreditCard },
        { path: '/accounts', label: 'Accounts', icon: PieChart },
      ]
    },
    {
      title: 'Communication',
      items: [
        { path: '/notice-board', label: 'Notice Board', icon: FileText },
        { path: '/messages', label: 'Messages', icon: MessageSquare },
        { path: '/notifications', label: 'Notifications', icon: Bell },
      ]
    },
    {
      title: 'Facilities',
      items: [
        { path: '/library', label: 'Library', icon: Library },
        { path: '/transport', label: 'Transport', icon: Bus },
        { path: '/hostel', label: 'Hostel', icon: Building },
        { path: '/inventory', label: 'Inventory', icon: Box },
      ]
    },
    {
      title: 'System',
      items: [
        { path: '/reports', label: 'Reports', icon: PieChart },
        { path: '/calendar', label: 'School Calendar', icon: Calendar },
        { path: '/profile', label: 'Profile', icon: User },
        { path: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ].map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (role === 'admin') return true;
      if (section.title === 'Main') return item.path === `/dashboard/${role === 'staff' ? 'staff' : role}`;
      if (section.title === 'People') return role !== 'student' && item.path === '/students';
      if (section.title === 'Academics') {
        if (item.path === '/classes') return role !== 'student';
        return ['/subjects', '/timetable', '/exam-results', '/assignments', '/online-classes'].includes(item.path);
      }
      if (section.title === 'Management') {
        return role === 'student' ? item.path === '/attendance' : ['/attendance', '/leave-management'].includes(item.path);
      }
      if (section.title === 'Communication') return ['/notice-board', '/messages', '/notifications'].includes(item.path);
      if (section.title === 'Facilities') return item.path === '/library';
      if (section.title === 'System') return ['/calendar', '/profile', '/settings'].includes(item.path);
      return true;
    }),
  })).filter((section) => section.items.length > 0);

  const initialExpandedState = navSections.reduce((acc, section) => {
    acc[section.title] = true; // Default all sections to be expanded
    return acc;
  }, {});

  const [expandedSections, setExpandedSections] = useState(initialExpandedState);

  const toggleSection = (title) => {
    if (!collapsed) {
      setExpandedSections(prev => ({
        ...prev,
        [title]: !prev[title]
      }));
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="sidebar-header">
        <NavLink to={role === 'student' ? '/dashboard/student' : role === 'staff' ? '/dashboard/staff' : role === 'teacher' ? '/dashboard/teacher' : '/dashboard'} className="sidebar-logo">
          <div className="sidebar-logo-icon">S</div>
          {!collapsed && (
            <span className="sidebar-logo-text">
              Skool
            </span>
          )}
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section, idx) => (
          <div key={idx} className="sidebar-section">
            {!collapsed && (
              <div className="sidebar-section-title" onClick={() => toggleSection(section.title)}>
                <span>{section.title}</span>
                <span className="sidebar-chevron">
                  {expandedSections[section.title] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              </div>
            )}
            {(collapsed || expandedSections[section.title]) && section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    onClick={onNavigate}
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <div className="sidebar-item-icon">
                      <Icon size={18} />
                    </div>
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="sidebar-item-badge">{item.badge}</span>
                    )}
                  </NavLink>
                );
              })}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
