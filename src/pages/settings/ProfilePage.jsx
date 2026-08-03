import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { User, Mail, Shield, Phone, MapPin } from 'lucide-react';

const ProfilePage = () => {
  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Account Profile</h1>
          <p className="page-subtitle">Personal details and system preferences</p>
        </div>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">A</div>
        <div className="profile-info">
          <h1>Admin User</h1>
          <p>Super Administrator • School Principal Office</p>
          <div className="profile-meta">
            <div className="profile-meta-item"><Mail size={16} /> admin@preskool.edu</div>
            <div className="profile-meta-item"><Phone size={16} /> +1 (555) 000-1122</div>
            <div className="profile-meta-item"><Shield size={16} /> Full Administrator Permissions</div>
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
    </DashboardLayout>
  );
};

export default ProfilePage;
