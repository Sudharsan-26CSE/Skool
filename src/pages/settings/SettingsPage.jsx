import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Settings, Save } from 'lucide-react';

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure application settings and school info</p>
        </div>
        <button className="btn btn-primary"><Save size={16} /> Save Changes</button>
      </div>

      <div className="form-page">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-section">
            <h3>School Identity Settings</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Institution Name</label>
                <input type="text" className="form-input" defaultValue="PreSkool International Academy" />
              </div>
              <div className="form-group">
                <label>Academic Year</label>
                <input type="text" className="form-input" defaultValue="2024 - 2025" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
