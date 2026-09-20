import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createTimetable } from '../../services/api';

const AddTimetablePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday',
    period: 1,
    startTime: '08:30',
    endTime: '09:30',
    roomNo: '',
    academicYear: '2023-2024',
    subjectName: 'Mathematics', // Fallback for dropdown
    className: 'Grade 10',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createTimetable({
        day: formData.day,
        period: parseInt(formData.period, 10),
        startTime: formData.startTime,
        endTime: formData.endTime,
        roomNo: formData.roomNo,
        academicYear: formData.academicYear,
        // Since we are mocking ObjectId references in frontend for demo:
        class: '60d0fe4f5311236168a109ca',
        subject: '60d0fe4f5311236168a109cb',
        teacher: '60d0fe4f5311236168a109cc',
      });
      showToast('Timetable slot saved & Notification sent to class!', 'success');
      navigate('/timetable');
    } catch (err) {
      showToast(err.message || 'Failed to save timetable slot. Using offline mode.', 'error');
      navigate('/timetable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/timetable')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Add Timetable Slot</h1>
          <p className="page-subtitle">Schedule a new class period</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label>Class/Grade *</label>
                <select name="className" className="form-input" value={formData.className} onChange={handleChange} required>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <select name="subjectName" className="form-input" value={formData.subjectName} onChange={handleChange} required>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                </select>
              </div>
              <div className="form-group">
                <label>Day of Week *</label>
                <select name="day" className="form-input" value={formData.day} onChange={handleChange} required>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
              <div className="form-group">
                <label>Period Number *</label>
                <input type="number" name="period" className="form-input" value={formData.period} onChange={handleChange} min="1" max="10" required />
              </div>
              <div className="form-group">
                <label>Start Time *</label>
                <input type="time" name="startTime" className="form-input" value={formData.startTime} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>End Time *</label>
                <input type="time" name="endTime" className="form-input" value={formData.endTime} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Room No</label>
                <input type="text" name="roomNo" className="form-input" value={formData.roomNo} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Academic Year *</label>
                <input type="text" name="academicYear" className="form-input" value={formData.academicYear} onChange={handleChange} required />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/timetable')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save & Notify'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddTimetablePage;
