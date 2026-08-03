import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ collapsed }) => {
  const location = useLocation();

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
        { path: '/students', label: 'Students', icon: GraduationCap, badge: 'New' },
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
        { path: '/messages', label: 'Messages', icon: MessageSquare, badge: '5' },
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
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="sidebar-logo">
          <div className="sidebar-logo-icon">P</div>
          {!collapsed && (
            <span className="sidebar-logo-text">
              Pre<span>Skool</span>
            </span>
          )}
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        {navSections.map((section, idx) => (
          <div key={idx} className="sidebar-section">
            {!collapsed && <div className="sidebar-section-title">{section.title}</div>}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
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
