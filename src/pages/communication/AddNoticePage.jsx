import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createNotice, createNotification } from '../../services/api';

const AddNoticePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    content: '',
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: '',
    targetRoles: 'all',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        targetRoles: [formData.targetRoles],
        // Default admin id since there's no auth yet
        postedBy: '60d0fe4f5311236168a109ca', // Replace with real admin ID later
      };

      await createNotice(payload);
      
      // Also send a notification for all users
      await createNotification({
        userId: '60d0fe4f5311236168a109ca', // Global/broadcast
        title: `New Notice: ${formData.title}`,
        message: formData.content,
        type: 'alert'
      });

      showToast('Notice published successfully!', 'success');
      navigate('/notice-board');
    } catch (err) {
      showToast(err.message || 'Failed to publish notice', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/notice-board')}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="page-title">Post New Notice</h1>
          <p className="page-subtitle">Publish an announcement to the school community</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="title">Notice Title *</label>
                <input id="title" name="title" className="form-input" placeholder="Enter a clear notice title" value={formData.title} onChange={handleChange} required />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select id="category" name="category" className="form-input" value={formData.category} onChange={handleChange} required>
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="event">Event</option>
                  <option value="exam">Examination</option>
                  <option value="holiday">Holiday</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="targetRoles">Target Audience *</label>
                <select id="targetRoles" name="targetRoles" className="form-input" value={formData.targetRoles} onChange={handleChange} required>
                  <option value="all">All Users</option>
                  <option value="student">Students Only</option>
                  <option value="teacher">Teachers Only</option>
                  <option value="staff">Staff Only</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="validFrom">Publish Date *</label>
                <input type="date" id="validFrom" name="validFrom" className="form-input" value={formData.validFrom} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="validUntil">Time Duration (Valid Until)</label>
                <input type="date" id="validUntil" name="validUntil" className="form-input" value={formData.validUntil} onChange={handleChange} />
              </div>

              <div className="form-group full-width">
                <label htmlFor="content">Notice Content *</label>
                <textarea id="content" name="content" className="form-input" rows="4" placeholder="Write the announcement" value={formData.content} onChange={handleChange} required />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/notice-board')}>
              <X size={16} /> Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} /> {loading ? 'Publishing...' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddNoticePage;
