import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createClass, getStaff } from '../../services/api';

const AddClassPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: 'Grade 9',
    section: 'A',
    capacity: 40,
    academicYear: '2023-2024',
    roomNo: '',
    classTeacher: '',
    description: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await getStaff('teacher');
      const list = res.staff || (Array.isArray(res) ? res : []);
      setTeachers(list);
      if (list.length > 0) {
        setFormData(prev => ({ ...prev, classTeacher: list[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load teachers:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createClass({
        name: formData.name,
        section: formData.section,
        capacity: Number(formData.capacity),
        academicYear: formData.academicYear,
        roomNo: formData.roomNo,
        classTeacher: formData.classTeacher || undefined,
        description: formData.description,
      });
      showToast('Class created successfully in database!', 'success');
      navigate('/classes');
    } catch (err) {
      showToast(err.message || 'Failed to create class.', 'error');
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
                  <option value="Grade 8">Grade 8</option>
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
                <label>Class Incharge (Teacher)</label>
                <select name="classTeacher" className="form-input" value={formData.classTeacher} onChange={handleChange}>
                  {teachers.map(t => (
                    <option key={t._id} value={t._id}>{t.name} ({t.designation || 'Teacher'})</option>
                  ))}
                </select>
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
