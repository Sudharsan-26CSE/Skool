import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { createTimetable, getClasses, getSubjects, getStaff } from '../../services/api';

const AddTimetablePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [classesList, setClassesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);

  const [formData, setFormData] = useState({
    day: 'Monday',
    period: 1,
    startTime: '08:30',
    endTime: '09:30',
    roomNo: 'Room 101',
    academicYear: '2023-2024',
    classId: '',
    subjectId: '',
    teacherId: '',
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
        class: formData.classId || undefined,
        subject: formData.subjectId || undefined,
        teacher: formData.teacherId || undefined,
      });
      showToast('Timetable slot saved & published to class schedule!', 'success');
      navigate('/timetable');
    } catch (err) {
      showToast(err.message || 'Failed to save timetable slot.', 'error');
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
          <p className="page-subtitle">Schedule a new class period in the database</p>
        </div>
      </div>
      <div className="form-page">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-grid">
              <div className="form-group">
                <label>Class / Grade *</label>
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
                <label>Teacher *</label>
                <select name="teacherId" className="form-input" value={formData.teacherId} onChange={handleChange} required>
                  {teachersList.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
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
