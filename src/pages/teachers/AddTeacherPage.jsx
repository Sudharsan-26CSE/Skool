import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createStaff } from '../../services/api';

const AddTeacherPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    department: 'Mathematics', // Filter Department default
    designation: 'Teacher',
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
      // createStaff endpoint handles staff/teachers
      // we pass role: 'teacher' to make sure the User model gets the right role
      await createStaff({
        ...formData,
        role: 'teacher',
        employeeId: formData.employeeId || `TCH-${Math.floor(Math.random() * 10000)}`,
        user: '60d0fe4f5311236168a109ca', // Dummy user ID for demo
      });
      showToast('Teacher added successfully!', 'success');
      navigate('/teachers');
    } catch (err) {
      showToast(err.message || 'Failed to add teacher. Using offline mode.', 'error');
      navigate('/teachers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/teachers')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Add New Teacher</h1>
          <p className="page-subtitle">Add a new teaching faculty member</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Teacher Full Name *</label>
                <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Teacher ID *</label>
                <input type="text" name="employeeId" className="form-input" placeholder="e.g. TCH-201" value={formData.employeeId} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Department (Filter) *</label>
                <select name="department" className="form-input" value={formData.department} onChange={handleChange}>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>
              <div className="form-group">
                <label>Specific Subject (Designation) *</label>
                <input type="text" name="designation" className="form-input" placeholder="e.g. Senior Math Teacher" value={formData.designation} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Experience (Years) *</label>
                <input type="number" name="experience" className="form-input" value={formData.experience} onChange={handleChange} min="0" required />
              </div>
              <div className="form-group">
                <label>Qualification *</label>
                <input type="text" name="qualification" className="form-input" placeholder="e.g. M.Sc, B.Ed" value={formData.qualification} onChange={handleChange} required />
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
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/teachers')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Teacher'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddTeacherPage;
