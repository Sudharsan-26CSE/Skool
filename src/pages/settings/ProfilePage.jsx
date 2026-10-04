import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Mail, Shield, Phone, Save } from 'lucide-react';

const ProfilePage = () => {
  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const loginName = localStorage.getItem('preskool-user-name');
  const loginEmail = localStorage.getItem('preskool-email') || localStorage.getItem('preskool-user-email') || `${role}@skool.edu.in`;
  const defaultName = loginName || (loginEmail ? loginEmail.split('@')[0] : `${role.charAt(0).toUpperCase() + role.slice(1)} User`);

  const profile = {
    admin: { name: defaultName, role: 'Super Administrator', department: 'School Principal Office', email: loginEmail, phone: '+91 (0) 44 2800 1100', access: 'Full Administrator Permissions' },
    teacher: { name: defaultName, role: 'Faculty Member', department: 'Academic Department', email: loginEmail, phone: '+91 (0) 44 2800 2200', access: 'Teaching and Grading Permissions' },
    staff: { name: defaultName, role: 'Staff Member', department: 'School Administration', email: loginEmail, phone: '+91 (0) 44 2800 3300', access: 'Staff Administration Permissions' },
    student: { name: defaultName, role: 'Enrolled Student', department: 'Academic Section', email: loginEmail, phone: '+91 (0) 44 2800 4400', access: 'Student Portal Access' },
  }[role] || { name: defaultName, role: 'User', department: 'Campus User', email: loginEmail, phone: '+91 (0) 44 2800 1100', access: 'Standard Access' };

  const currentProfile = profile;
  const [permissions, setPermissions] = useState({
    manageAcademics: true,
    manageCommunication: true,
    manageFinance: true,
    manageUsers: true,
  });

  const togglePermission = (permission) => {
    setPermissions(current => ({ ...current, [permission]: !current[permission] }));
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Account Profile</h1>
          <p className="page-subtitle">Personal details and system preferences</p>
        </div>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">{currentProfile.name.charAt(0)}</div>
        <div className="profile-info">
          <h1>{currentProfile.name}</h1>
          <p>{currentProfile.role} • {currentProfile.department}</p>
          <div className="profile-meta">
            <div className="profile-meta-item"><Mail size={16} /> {currentProfile.email}</div>
            <div className="profile-meta-item"><Phone size={16} /> {currentProfile.phone}</div>
            <div className="profile-meta-item"><Shield size={16} /> {currentProfile.access}</div>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h3>Security & Credentials</h3>
        <div className="detail-row">
          <span className="detail-label">Two-Factor Authentication (2FA)</span>
          <span className="badge success">Enabled</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Password Last Changed</span>
          <span className="detail-value">30 days ago</span>
        </div>
      </div>

      <div className="detail-card access-card">
        <div className="detail-card-header">
          <div>
            <h3>Access Control</h3>
            <p className="page-subtitle">Choose the areas this administrator can manage.</p>
          </div>
          <button className="btn btn-primary btn-sm"><Save size={15} /> Save Access</button>
        </div>
        <div className="access-list">
          {[
            ['manageAcademics', 'Academics', 'Classes, assignments, and online classes'],
            ['manageCommunication', 'Communication', 'Messages, notices, and notifications'],
            ['manageFinance', 'Finance', 'Fees, payroll, and accounts'],
            ['manageUsers', 'People & Staff', 'Students, teachers, and staff records'],
          ].map(([key, label, description]) => (
            <label className="access-row" key={key}>
              <span><strong>{label}</strong><small>{description}</small></span>
              <input type="checkbox" checked={permissions[key]} onChange={() => togglePermission(key)} />
            </label>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
