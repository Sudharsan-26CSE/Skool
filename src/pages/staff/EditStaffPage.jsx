import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getStaffMember, updateStaff } from '../../services/api';

const EditStaffPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: 'Administration',
    designation: '',
    qualification: '',
    experience: 0,
    salary: 0,
    isActive: true,
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const data = await getStaffMember(id);
        const s = data.staff || data.item || data;
        if (!s) return;
        setFormData({
          name: s.user?.name || s.name || '',
          employeeId: s.employeeId || '',
          email: s.user?.email || s.email || '',
          phone: s.user?.phone || s.phone || '',
          department: s.department || 'Administration',
          designation: s.designation || '',
          qualification: s.qualification || '',
          experience: s.experience || 0,
          salary: s.salary || 0,
          isActive: s.isActive !== false,
        });
      } catch (err) {
        showToast('Failed to load staff details', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStaff();
  }, [id, showToast]);

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
      await updateStaff(id, formData);
      showToast('Staff member updated successfully!', 'success');
      navigate('/staff');
    } catch (err) {
      showToast(err.message || 'Failed to update staff.', 'error');
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
          <h1 className="page-title">Edit Staff</h1>
          <p className="page-subtitle">Update staff member details</p>
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

export default EditStaffPage;
