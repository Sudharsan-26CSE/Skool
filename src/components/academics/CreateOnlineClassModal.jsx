import React, { useState, useEffect } from 'react';
import { 
  X, 
  Video, 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { createOnlineClass, getClasses, getSubjects, getStaff } from '../../services/api';
import { useToast } from '../common/ToastContext';

const DURATION_PRESETS = ['30 mins', '45 mins', '60 mins', '90 mins', '120 mins'];

const CreateOnlineClassModal = ({ isOpen, onClose, onClassCreated }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [classesList, setClassesList] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);

  // Form State - only user-supplied class details (NO meeting link field)
  const [formData, setFormData] = useState({
    title: '',
    classId: '',
    className: '',
    subjectId: '',
    subjectName: '',
    teacherId: '',
    teacherName: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    duration: '60 mins',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchPrerequisites();
      // Set default start time to the next full hour
      const now = new Date();
      const nextHour = (now.getHours() + 1) % 24;
      const formattedTime = `${String(nextHour).padStart(2, '0')}:00`;
      setFormData(prev => ({
        ...prev,
        scheduledDate: now.toISOString().split('T')[0],
        startTime: formattedTime
      }));
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchPrerequisites = async () => {
    try {
      const [clsRes, subRes, tchRes] = await Promise.all([
        getClasses().catch(() => ({ classes: [] })),
        getSubjects().catch(() => ({ subjects: [] })),
        getStaff('teacher').catch(() => ({ staff: [] })),
      ]);

      const cls = clsRes.classes || (Array.isArray(clsRes) ? clsRes : (clsRes.items || []));
      const subs = subRes.subjects || (Array.isArray(subRes) ? subRes : (subRes.items || []));
      const tchs = tchRes.staff || tchRes.staffs || (Array.isArray(tchRes) ? tchRes : (tchRes.items || []));

      setClassesList(cls);
      setSubjectsList(subs);
      setTeachersList(tchs);

      if (cls.length > 0) {
        const firstCls = cls[0];
        setFormData(prev => ({
          ...prev,
          classId: firstCls._id || firstCls.id || '',
          className: firstCls.name ? `${firstCls.name} ${firstCls.section || ''}`.trim() : (prev.className || 'Grade 10-A')
        }));
      }

      if (subs.length > 0) {
        const firstSub = subs[0];
        setFormData(prev => ({
          ...prev,
          subjectId: firstSub._id || firstSub.id || '',
          subjectName: firstSub.name || prev.subjectName || 'General Mathematics'
        }));
      }

      if (tchs.length > 0) {
        const firstTch = tchs[0];
        setFormData(prev => ({
          ...prev,
          teacherId: firstTch._id || firstTch.id || '',
          teacherName: firstTch.name || prev.teacherName || 'Assigned Teacher'
        }));
      }
    } catch (err) {
      console.warn('Prerequisites loading fallback:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-update human-readable names when dropdowns change
    if (name === 'classId') {
      const found = classesList.find(c => (c._id || c.id) === value);
      const cName = found ? `${found.name} ${found.section || ''}`.trim() : value;
      setFormData(prev => ({ ...prev, classId: value, className: cName }));
    } else if (name === 'subjectId') {
      const found = subjectsList.find(s => (s._id || s.id) === value);
      const sName = found ? found.name : value;
      setFormData(prev => ({ ...prev, subjectId: value, subjectName: sName }));
    } else if (name === 'teacherId') {
      const found = teachersList.find(t => (t._id || t.id) === value);
      const tName = found ? found.name : value;
      setFormData(prev => ({ ...prev, teacherId: value, teacherName: tName }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDurationSelect = (dur) => {
    setFormData(prev => ({ ...prev, duration: dur }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a session title or topic', 'warning');
      return;
    }

    try {
      setLoading(true);

      // Compute endTime based on start time & duration
      const [hStr, mStr] = (formData.startTime || '10:00').split(':');
      let durMins = 60;
      const parsedDur = parseInt(formData.duration, 10);
      if (!isNaN(parsedDur) && parsedDur > 0) durMins = parsedDur;
      const startMinutes = (parseInt(hStr, 10) || 10) * 60 + (parseInt(mStr, 10) || 0);
      const endMinutes = startMinutes + durMins;
      const endH = Math.floor(endMinutes / 60) % 24;
      const endM = endMinutes % 60;
      const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

      // Payload contains only classroom details; Google Meet link generation is handled strictly by the backend
      const payload = {
        title: formData.title.trim(),
        topic: formData.title.trim(),
        class: formData.classId || undefined,
        className: formData.className || 'General Class',
        subject: formData.subjectId || undefined,
        subjectName: formData.subjectName || 'General',
        teacher: formData.teacherId || undefined,
        teacherName: formData.teacherName || 'Instructor',
        scheduledDate: formData.scheduledDate,
        date: formData.scheduledDate,
        startTime: formData.startTime,
        time: formData.startTime,
        endTime,
        duration: formData.duration,
        description: formData.description.trim(),
        status: 'Scheduled',
        platform: 'Google Meet'
      };

      const result = await createOnlineClass(payload);

      showToast('Virtual Classroom provisioned with Google Meet!', 'success');
      if (onClassCreated) {
        onClassCreated(result?.onlineClass || result?.onlineClasses || result?.item || result);
      }
      onClose();
    } catch (err) {
      console.error('Failed to create virtual classroom:', err);
      showToast(err.message || 'Failed to create virtual classroom', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="glass-modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="glass-modal-container">
        {/* Ambient Glass Glow Orbs */}
        <div className="glass-glow-orb orb-primary" />
        <div className="glass-glow-orb orb-emerald" />

        {/* Modal Header */}
        <div className="glass-modal-header">
          <div className="glass-header-left">
            <div className="google-meet-badge-icon">
              <Video size={22} className="meet-cam-icon" />
              <span className="live-sparkle"><Sparkles size={12} /></span>
            </div>
            <div>
              <h2 id="modal-title" className="glass-modal-title">Schedule Live Classroom</h2>
              <p className="glass-modal-subtitle">
                Enter your class lecture details below. The backend server will securely generate your dedicated Google Meet room.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            className="glass-close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Informational Glass Banner regarding Backend Process */}
        <div className="glass-info-banner">
          <div className="info-icon-wrapper">
            <ShieldCheck size={18} />
          </div>
          <div className="info-content">
            <strong>Automated Backend Process</strong>
            <p>
              Google Meet meeting link will be created, configured, and stored on the server upon scheduling. No manual URL input is required.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="glass-modal-form">
          <div className="glass-form-body">
            
            {/* Title / Topic */}
            <div className="glass-form-group full-width">
              <label htmlFor="session-title">
                Session Topic / Title <span className="req-star">*</span>
              </label>
              <div className="glass-input-wrapper">
                <FileText size={17} className="field-icon" />
                <input 
                  id="session-title"
                  type="text" 
                  name="title" 
                  className="glass-input" 
                  placeholder="e.g. Organic Chemistry: Hydrocarbons & Reactions" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  autoFocus
                />
              </div>
            </div>

            {/* Class & Subject */}
            <div className="glass-form-grid-2">
              <div className="glass-form-group">
                <label htmlFor="class-select">Class / Grade <span className="req-star">*</span></label>
                <div className="glass-input-wrapper">
                  <Layers size={17} className="field-icon" />
                  <select 
                    id="class-select"
                    name="classId" 
                    className="glass-select" 
                    value={formData.classId} 
                    onChange={handleChange} 
                    required
                  >
                    {classesList.length > 0 ? (
                      classesList.map(c => (
                        <option key={c._id || c.id} value={c._id || c.id}>
                          {c.name} {c.section ? `(${c.section})` : ''}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Grade 10-A">Grade 10 - Section A</option>
                        <option value="Grade 11-A">Grade 11 - Section A</option>
                        <option value="Grade 12-B">Grade 12 - Section B</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="glass-form-group">
                <label htmlFor="subject-select">Subject <span className="req-star">*</span></label>
                <div className="glass-input-wrapper">
                  <BookOpen size={17} className="field-icon" />
                  <select 
                    id="subject-select"
                    name="subjectId" 
                    className="glass-select" 
                    value={formData.subjectId} 
                    onChange={handleChange} 
                    required
                  >
                    {subjectsList.length > 0 ? (
                      subjectsList.map(s => (
                        <option key={s._id || s.id} value={s._id || s.id}>
                          {s.name} {s.code ? `[${s.code}]` : ''}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="English">English</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Host Teacher */}
            <div className="glass-form-group full-width">
              <label htmlFor="teacher-select">Host Instructor / Teacher</label>
              <div className="glass-input-wrapper">
                <Users size={17} className="field-icon" />
                <select 
                  id="teacher-select"
                  name="teacherId" 
                  className="glass-select" 
                  value={formData.teacherId} 
                  onChange={handleChange}
                >
                  {teachersList.length > 0 ? (
                    teachersList.map(t => (
                      <option key={t._id || t.id} value={t._id || t.id}>
                        {t.name} {t.designation ? `— ${t.designation}` : (t.department ? `(${t.department})` : '')}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Sarah Connor">Sarah Connor (Mathematics)</option>
                      <option value="Albert Vance">Albert Vance (Physics)</option>
                      <option value="Gomathi Sudhan">Gomathi Sudhan (Lead Instructor)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Date & Start Time */}
            <div className="glass-form-grid-2">
              <div className="glass-form-group">
                <label htmlFor="session-date">Session Date <span className="req-star">*</span></label>
                <div className="glass-input-wrapper">
                  <Calendar size={17} className="field-icon" />
                  <input 
                    id="session-date"
                    type="date" 
                    name="scheduledDate" 
                    className="glass-input" 
                    value={formData.scheduledDate} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>

              <div className="glass-form-group">
                <label htmlFor="start-time">Start Time <span className="req-star">*</span></label>
                <div className="glass-input-wrapper">
                  <Clock size={17} className="field-icon" />
                  <input 
                    id="start-time"
                    type="time" 
                    name="startTime" 
                    className="glass-input" 
                    value={formData.startTime} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
              </div>
            </div>

            {/* Duration Pills */}
            <div className="glass-form-group full-width">
              <label>Estimated Duration</label>
              <div className="duration-pill-group">
                {DURATION_PRESETS.map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    className={`duration-pill ${formData.duration === dur ? 'active' : ''}`}
                    onClick={() => handleDurationSelect(dur)}
                  >
                    {formData.duration === dur && <CheckCircle2 size={13} className="pill-check" />}
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* Agenda / Topic Notes */}
            <div className="glass-form-group full-width">
              <label htmlFor="description">Session Agenda / Instructions (Optional)</label>
              <textarea 
                id="description"
                name="description" 
                rows="2" 
                className="glass-textarea" 
                placeholder="Share lecture outline, preparation instructions, or materials needed..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="glass-modal-footer">
            <button 
              type="button" 
              className="glass-btn glass-btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="glass-btn glass-btn-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="glass-spinner" />
                  <span>Provisioning Google Meet...</span>
                </>
              ) : (
                <>
                  <Video size={17} />
                  <span>Schedule Class & Generate Meet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOnlineClassModal;
