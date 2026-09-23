import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X, Link } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createOnlineClass, getClasses, getSubjects, getStaff } from '../../services/api';

const AddOnlineClassPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [classesList, setClassesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    subjectId: '',
    teacherId: '',
    platform: 'google-meet',
    scheduledDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    meetingLink: '', // Auto-generated
  });

  useEffect(() => {
    fetchPrerequisites();
  }, []);

  const fetchPrerequisites = async () => {
    try {
      const [clsRes, subRes, tchRes] = await Promise.all([
        getClasses().catch(() => ({ classes: [] })),
        getSubjects().catch(() => ({ subjects: [] })),
        getStaff('teacher').catch(() => ({ staff: [] })),
      ]);

      const cls = clsRes.classes || (Array.isArray(clsRes) ? clsRes : []);
      const subs = subRes.subjects || (Array.isArray(subRes) ? subRes : []);
      const tchs = tchRes.staff || (Array.isArray(tchRes) ? tchRes : []);

      setClassesList(cls);
      setSubjectsList(subs);
      setTeachersList(tchs);

      setFormData(prev => ({
        ...prev,
        classId: cls[0]?._id || '',
        subjectId: subs[0]?._id || '',
        teacherId: tchs[0]?._id || '',
      }));
    } catch (err) {
      console.error('Failed to load prerequisites:', err);
    }
  };

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
        class: formData.classId || undefined,
        subject: formData.subjectId || undefined,
        teacher: formData.teacherId || undefined,
      });
      showToast('Virtual Classroom created successfully!', 'success');
      navigate('/online-classes');
    } catch (err) {
      showToast(err.message || 'Failed to create virtual classroom.', 'error');
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
                <input type="text" name="title" className="form-input" placeholder="e.g. Mathematics Seminar" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Class / Section *</label>
                <select name="classId" className="form-input" value={formData.classId} onChange={handleChange} required>
                  {classesList.map(c => (
                    <option key={c._id} value={c._id}>{c.name} {c.section || ''}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <select name="subjectId" className="form-input" value={formData.subjectId} onChange={handleChange} required>
                  {subjectsList.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.code || 'Gen'})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Host Teacher</label>
                <select name="teacherId" className="form-input" value={formData.teacherId} onChange={handleChange}>
                  {teachersList.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
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
