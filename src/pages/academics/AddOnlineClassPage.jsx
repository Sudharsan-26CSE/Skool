import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X, Link } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createOnlineClass } from '../../services/api';

const AddOnlineClassPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    className: 'Grade 10-A',
    subjectName: 'Mathematics',
    platform: 'google-meet',
    scheduledDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    meetingLink: '', // Auto-generated
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateLink = () => {
    const randomId = Math.random().toString(36).substring(2, 12);
    let base = '';
    if (formData.platform === 'zoom') base = 'https://zoom.us/j/';
    else if (formData.platform === 'teams') base = 'https://teams.microsoft.com/l/meetup-join/';
    else base = 'https://meet.google.com/';
    
    setFormData(prev => ({ ...prev, meetingLink: `${base}${randomId}` }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createOnlineClass({
        title: formData.title,
        scheduledDate: formData.scheduledDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        meetingLink: formData.meetingLink || `https://meet.google.com/${Math.random().toString(36).substring(2, 12)}`,
        platform: formData.platform,
        // Mocking ObjectIds for demo:
        class: '60d0fe4f5311236168a109ca',
        subject: '60d0fe4f5311236168a109cb',
        teacher: '60d0fe4f5311236168a109cc',
      });
      showToast('Virtual Classroom created successfully!', 'success');
      navigate('/online-classes');
    } catch (err) {
      showToast(err.message || 'Failed to create virtual classroom. Using offline mode.', 'error');
      navigate('/online-classes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/online-classes')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Schedule Virtual Class</h1>
          <p className="page-subtitle">Create a new live online session</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Session Title *</label>
                <input type="text" name="title" className="form-input" placeholder="e.g. Calculus Problem Solving" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Class/Section *</label>
                <select name="className" className="form-input" value={formData.className} onChange={handleChange} required>
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 11-B">Grade 11-B</option>
                  <option value="Grade 12-A">Grade 12-A</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <select name="subjectName" className="form-input" value={formData.subjectName} onChange={handleChange} required>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input type="date" name="scheduledDate" className="form-input" value={formData.scheduledDate} onChange={handleChange} required />
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
                <label>Platform *</label>
                <select name="platform" className="form-input" value={formData.platform} onChange={handleChange} required>
                  <option value="google-meet">Google Meet</option>
                  <option value="zoom">Zoom</option>
                  <option value="teams">Microsoft Teams</option>
                </select>
              </div>
              <div className="form-group">
                <label>Meeting Link</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="url" name="meetingLink" className="form-input" value={formData.meetingLink} onChange={handleChange} placeholder="Auto-generated if empty" />
                  <button type="button" className="btn btn-secondary" onClick={generateLink} title="Generate Link">
                    <Link size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/online-classes')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Scheduling...' : 'Schedule Class'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddOnlineClassPage;
