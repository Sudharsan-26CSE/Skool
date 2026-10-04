import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createStaff } from '../../services/api';

const AddStaffPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: 'Administration',
    designation: '', // Role
    qualification: '',
    experience: 0,
    salary: 0,
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createStaff({
        ...formData,
        role: 'staff',
        employeeId: formData.employeeId || `STF-${Math.floor(Math.random() * 10000)}`,
        user: '60d0fe4f5311236168a109ca', // Dummy user ID for demo
      });
      showToast('Staff member added successfully!', 'success');
      navigate('/staff');
    } catch (err) {
      showToast(err.message || 'Failed to add staff. Using offline mode.', 'error');
      navigate('/staff');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/staff')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Add New Staff</h1>
          <p className="page-subtitle">Add administrative, security, or maintenance personnel</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Staff Full Name *</label>
                <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Employee ID *</label>
                <input type="text" name="employeeId" className="form-input" placeholder="e.g. STF-301" value={formData.employeeId} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Role (Designation) *</label>
                <input type="text" name="designation" className="form-input" placeholder="e.g. IT Specialist" value={formData.designation} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select name="department" className="form-input" value={formData.department} onChange={handleChange}>
                  <option value="Administration">Administration</option>
                  <option value="Finance">Finance</option>
                  <option value="Security">Security</option>
                  <option value="Technology">Technology</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Experience (Years)</label>
                <input type="number" name="experience" className="form-input" value={formData.experience} onChange={handleChange} min="0" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/staff')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Staff'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddStaffPage;
