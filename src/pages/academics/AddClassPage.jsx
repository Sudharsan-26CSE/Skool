import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createClass } from '../../services/api';

const AddClassPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Grade 9',
    section: 'A',
    capacity: 40,
    academicYear: '2023-2024',
    roomNo: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createClass({
        ...formData,
        // In a real app we'd map a selected teacher object ID here: classTeacher: '60d...'
      });
      showToast('Class created successfully!', 'success');
      navigate('/classes');
    } catch (err) {
      showToast(err.message || 'Failed to create class. Using offline mode.', 'error');
      navigate('/classes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/classes')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Create New Class</h1>
          <p className="page-subtitle">Configure a class grade, section, and room details</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label>Grade *</label>
                <select name="name" className="form-input" value={formData.name} onChange={handleChange} required>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
              <div className="form-group">
                <label>Section *</label>
                <input type="text" name="section" className="form-input" placeholder="e.g. A" value={formData.section} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Room Number *</label>
                <input type="text" name="roomNo" className="form-input" placeholder="e.g. Room 101" value={formData.roomNo} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Class Capacity</label>
                <input type="number" name="capacity" className="form-input" value={formData.capacity} onChange={handleChange} min="1" />
              </div>
              <div className="form-group">
                <label>Academic Year *</label>
                <input type="text" name="academicYear" className="form-input" placeholder="e.g. 2023-2024" value={formData.academicYear} onChange={handleChange} required />
              </div>
              <div className="form-group full-width">
                <label>Class Incharge (Teacher Dummy ID or Name)</label>
                <input type="text" className="form-input" placeholder="e.g. John Doe (Not wired to ObjectId yet)" />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/classes')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Class'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddClassPage;
