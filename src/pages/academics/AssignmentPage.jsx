import React, { useRef, useState, useCallback, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus, UploadCloud, CalendarDays, FileText,
  CheckCircle2, ArrowLeft, X, Paperclip,
  User, BookOpen, Hash, AlignLeft, Sparkles
} from 'lucide-react';
import { getAssignments, createAssignment } from '../../services/api';

/* ─── ADD ASSIGNMENT MODAL ─────────────────────────────────────── */
const AddAssignmentModal = ({ onClose, onAdd }) => {
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: '', rollNo: '', subject: '', className: '',
    dueDate: '', instructions: '',
  });
  const [attachedFile, setAttachedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFile = (file) => {
    if (file) setAttachedFile(file);
  };

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Student name is required';
    if (!form.rollNo.trim())  e.rollNo  = 'Roll no. is required';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.dueDate)        e.dueDate = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setTimeout(() => {
      onAdd({ ...form, file: attachedFile, id: Date.now().toString() });
      onClose();
    }, 1200);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="assign-modal-backdrop" onClick={onClose} />

      {/* Slide-in Panel */}
      <div className="assign-modal-panel" role="dialog" aria-label="Add Assignment">
        {/* Header */}
        <div className="assign-modal-header">
          <div className="assign-modal-title-row">
            <div className="assign-modal-icon-wrap">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="assign-modal-title">Add Assignment</h2>
              <p className="assign-modal-subtitle">Fill in the student & assignment details below</p>
            </div>
          </div>
          <button className="assign-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="assign-modal-form" onSubmit={handleSubmit} noValidate>
          <div className="assign-form-grid">

            {/* Student Name */}
            <div className={`assign-field-group ${focusedField === 'name' ? 'focused' : ''} ${errors.name ? 'has-error' : ''}`}>
              <label className="assign-label">
                <User size={13} /> Student / Assignment Title
              </label>
              <div className="assign-input-wrap">
                <input
                  className="assign-input"
                  type="text"
                  placeholder="e.g. Term Assessment Task"
                  value={form.name}
                  onChange={set('name')}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => { setFocusedField(null); if (form.name) setErrors(e => ({...e, name: ''})); }}
                />
              </div>
              {errors.name && <span className="assign-error">{errors.name}</span>}
            </div>

            {/* Roll No */}
            <div className={`assign-field-group ${focusedField === 'rollNo' ? 'focused' : ''} ${errors.rollNo ? 'has-error' : ''}`}>
              <label className="assign-label">
                <Hash size={13} /> Roll No.
              </label>
              <div className="assign-input-wrap">
                <input
                  className="assign-input"
                  type="text"
                  placeholder="e.g. STU-1042"
                  value={form.rollNo}
                  onChange={set('rollNo')}
                  onFocus={() => setFocusedField('rollNo')}
                  onBlur={() => { setFocusedField(null); if (form.rollNo) setErrors(e => ({...e, rollNo: ''})); }}
                />
              </div>
              {errors.rollNo && <span className="assign-error">{errors.rollNo}</span>}
            </div>

            {/* Subject */}
            <div className={`assign-field-group ${focusedField === 'subject' ? 'focused' : ''} ${errors.subject ? 'has-error' : ''}`}>
              <label className="assign-label">
                <BookOpen size={13} /> Subject
              </label>
              <div className="assign-input-wrap">
                <input
                  className="assign-input"
                  type="text"
                  placeholder="e.g. Mathematics"
                  value={form.subject}
                  onChange={set('subject')}
                  onFocus={() => setFocusedField('subject')}
                  onBlur={() => { setFocusedField(null); if (form.subject) setErrors(e => ({...e, subject: ''})); }}
                />
              </div>
              {errors.subject && <span className="assign-error">{errors.subject}</span>}
            </div>

            {/* Class */}
            <div className={`assign-field-group ${focusedField === 'className' ? 'focused' : ''}`}>
              <label className="assign-label">
                <BookOpen size={13} /> Class
              </label>
              <div className="assign-input-wrap">
                <select
                  className="assign-input assign-select"
                  value={form.className}
                  onChange={set('className')}
                  onFocus={() => setFocusedField('className')}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="">Select class…</option>
                  {['Grade 8-A','Grade 8-B','Grade 9-A','Grade 9-B','Grade 10-A','Grade 10-B','Grade 11-A','Grade 11-B','Grade 12-A'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className={`assign-field-group ${focusedField === 'dueDate' ? 'focused' : ''} ${errors.dueDate ? 'has-error' : ''}`}>
              <label className="assign-label">
                <CalendarDays size={13} /> Due Date
              </label>
              <div className="assign-input-wrap">
                <input
                  className="assign-input"
                  type="date"
                  value={form.dueDate}
                  onChange={set('dueDate')}
                  onFocus={() => setFocusedField('dueDate')}
                  onBlur={() => { setFocusedField(null); if (form.dueDate) setErrors(e => ({...e, dueDate: ''})); }}
                />
              </div>
              {errors.dueDate && <span className="assign-error">{errors.dueDate}</span>}
            </div>

          </div>

          {/* Instructions */}
          <div className={`assign-field-group assign-field-full ${focusedField === 'instructions' ? 'focused' : ''}`}>
            <label className="assign-label">
              <AlignLeft size={13} /> Instructions
            </label>
            <div className="assign-input-wrap">
              <textarea
                className="assign-input assign-textarea"
                placeholder="Enter assignment instructions, guidelines, or notes…"
                value={form.instructions}
                onChange={set('instructions')}
                onFocus={() => setFocusedField('instructions')}
                onBlur={() => setFocusedField(null)}
                rows={3}
              />
            </div>
          </div>

          {/* File Attach */}
          <div className="assign-field-full">
            <label className="assign-label">
              <Paperclip size={13} /> Attach File
            </label>
            <div
              ref={dropRef}
              className={`assign-dropzone ${dragging ? 'dragging' : ''} ${attachedFile ? 'has-file' : ''}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {attachedFile ? (
                <div className="assign-file-info">
                  <div className="assign-file-icon"><FileText size={22} /></div>
                  <div>
                    <strong>{attachedFile.name}</strong>
                    <span>{(attachedFile.size / 1024).toFixed(1)} KB · Ready to attach</span>
                  </div>
                  <button
                    type="button"
                    className="assign-file-remove"
                    onClick={(e) => { e.stopPropagation(); setAttachedFile(null); }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="assign-dropzone-icon"><UploadCloud size={28} /></div>
                  <strong>Drag & drop file here</strong>
                  <span>or <u>click to browse</u> — PDF, DOC, JPG, PNG supported</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="assign-modal-actions">
            <button type="button" className="btn btn-ghost assign-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn assign-submit-btn ${submitted ? 'submitted' : ''}`}
              disabled={submitted}
            >
              {submitted ? (
                <><CheckCircle2 size={16} className="assign-submit-check" /> Assignment Added!</>
              ) : (
                <><Plus size={16} /> Add Assignment</>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

/* ─── MAIN ASSIGNMENT PAGE ─────────────────────────────────────── */
const AssignmentPage = () => {
  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isTeacher = role === 'teacher' || role === 'staff';
  const isStudent = role === 'student';
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState({});
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [fabRipple, setFabRipple] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await getAssignments();
      const list = res.assignments || (Array.isArray(res) ? res : []);
      const mapped = list.map((a) => ({
        id: a._id,
        title: a.title,
        class: a.class?.name ? `${a.class.name} ${a.class.section || ''}` : (a.class || 'All Classes'),
        subject: a.subject?.name || a.subject || 'General',
        startDate: new Date(a.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
        status: a.status || 'Active',
        submissions: `${a.submissions?.length || 0} Submissions`,
        instructions: a.instructions || a.description || '',
      }));
      setAssignments(mapped);
    } catch (err) {
      console.error('Failed to load assignments:', err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const selectedAssignment = assignments.find((a) => a.id === assignmentId);
  const selectedSubmission = selectedAssignment ? submissions[selectedAssignment.id] : null;

  const handleFile = (file) => {
    if (file) {
      setSubmissions((cur) => ({
        ...cur,
        [selectedAssignment.id]: { file, isSubmitted: false, fileUrl: URL.createObjectURL(file) },
      }));
    }
  };

  const submitAssignment = () => {
    if (!selectedAssignment || !selectedSubmission) return;
    setSubmissions((cur) => ({
      ...cur,
      [selectedAssignment.id]: { ...selectedSubmission, isSubmitted: true },
    }));
  };

  const handleFabClick = () => {
    setFabRipple(true);
    setTimeout(() => setFabRipple(false), 600);
    setShowModal(true);
  };

  const handleAddAssignment = useCallback(async (data) => {
    try {
      await createAssignment({
        title: `${data.subject}: ${data.name}`,
        class: data.className || 'General',
        subject: data.subject,
        dueDate: data.dueDate,
        instructions: data.instructions,
      });
      fetchAssignments();
      setToast('✅ Assignment saved to database successfully!');
    } catch (err) {
      // Fallback optimistic local addition
      const newItem = {
        id: Date.now().toString(),
        title: `${data.subject} — ${data.name}`,
        class: data.className || 'N/A',
        subject: data.subject,
        startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dueDate: data.dueDate ? new Date(data.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
        status: 'Active',
        submissions: '0 Submissions',
        studentName: data.name,
      };
      setAssignments((prev) => [newItem, ...prev]);
      setToast('✅ Assignment added!');
    }
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <DashboardLayout>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          {isStudent && selectedAssignment && (
            <button className="btn btn-ghost assignment-back-btn" type="button" onClick={() => navigate('/assignments')}>
              <ArrowLeft size={16} /> All Assignments
            </button>
          )}
          <h1 className="page-title">{selectedAssignment?.title || 'Homework & Assignments'}</h1>
          <p className="page-subtitle">
            {selectedAssignment
              ? `${selectedAssignment.subject} | ${selectedAssignment.class}`
              : 'Track, assign, and collect student coursework'}
          </p>
        </div>
        {/* Teacher desktop button */}
        {isTeacher && !selectedAssignment && (
          <button className="btn btn-primary glass-btn-primary" type="button" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Create Assignment
          </button>
        )}
      </div>

      {/* ── Assignment Cards Grid ── */}
      {!selectedAssignment && (
        <div className="detail-grid assign-cards-grid">
          {assignments.map((asgn, idx) => (
            <button
              key={asgn.id}
              type="button"
              className={`detail-card assignment-card assign-list-card ${isStudent ? 'assignment-card-clickable' : ''}`}
              style={{ animationDelay: `${idx * 0.07}s` }}
              onClick={() => isStudent && navigate(`/assignments/${asgn.id}`)}
            >
              {/* Shimmer overlay */}
              <div className="assign-card-shimmer" />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span className="badge info">{asgn.subject}</span>
                {isStudent ? (
                  <span className={`badge ${submissions[asgn.id]?.isSubmitted ? 'success' : 'error'}`}>
                    {submissions[asgn.id]?.isSubmitted ? '✓ Uploaded' : '✗ Not Uploaded'}
                  </span>
                ) : (
                  <span className={`badge ${asgn.status === 'Active' ? 'success' : 'neutral'}`}>{asgn.status}</span>
                )}
              </div>

              <h3 style={{ border: 'none', padding: 0, margin: 'var(--space-2) 0 var(--space-3)' }}>{asgn.title}</h3>

              {asgn.studentName && (
                <div className="detail-row">
                  <span className="detail-label">Student</span>
                  <span className="detail-value">{asgn.studentName} {asgn.rollNo ? `(${asgn.rollNo})` : ''}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Class</span>
                <span className="detail-value">{asgn.class}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Due Date</span>
                <span className="detail-value" style={{ color: 'var(--error)', fontWeight: 600 }}>{asgn.dueDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Submissions</span>
                <span className="detail-value">{asgn.submissions}</span>
              </div>
            </button>
          ))}

          {/* Empty state */}
          {assignments.length === 0 && (
            <div className="assign-empty-state">
              <FileText size={40} />
              <p>No assignments yet. Click <strong>+</strong> to create one.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Student: View + Submit Assignment ── */}
      {isStudent && selectedAssignment && (
        <section className="assignment-submit-panel" aria-label="Submit assignment">
          <div className="assignment-submit-header">
            <div>
              <span className="badge info">{selectedAssignment.subject}</span>
              <h2>{selectedAssignment.title}</h2>
              <p>{selectedAssignment.class}</p>
            </div>
            <div className="assignment-dates">
              <span><CalendarDays size={16} /> Starts {selectedAssignment.startDate}</span>
              <span className="assignment-due-date"><CalendarDays size={16} /> Due {selectedAssignment.dueDate}</span>
            </div>
          </div>

          {selectedSubmission && (
            <div className="assignment-uploaded-file">
              <FileText size={20} />
              <div>
                <strong>{selectedSubmission.file.name}</strong>
                <span>{selectedSubmission.isSubmitted ? 'Submitted successfully' : 'File ready to submit'}</span>
              </div>
              <a href={selectedSubmission.fileUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                Open file
              </a>
            </div>
          )}

          <button
            className={`assignment-dropzone ${selectedSubmission ? 'has-file' : ''}`}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          >
            <UploadCloud size={30} />
            <strong>{selectedSubmission ? 'Replace uploaded file' : 'Drag and drop your file here'}</strong>
            <span>or click to browse from your device</span>
            <input ref={fileInputRef} type="file" hidden onChange={(e) => handleFile(e.target.files[0])} />
          </button>

          <div className="assignment-submit-actions">
            <button className="btn btn-primary" type="button" disabled={!selectedSubmission} onClick={submitAssignment}>
              <CheckCircle2 size={16} /> {selectedSubmission?.isSubmitted ? 'Submitted ✓' : 'Submit Assignment'}
            </button>
          </div>
        </section>
      )}

      {isTeacher && selectedAssignment && (
        <button className="assignment-give-mark btn btn-primary" type="button">
          <CheckCircle2 size={16} /> Give Mark
        </button>
      )}

      {/* ── Floating + FAB ── */}
      {!selectedAssignment && (
        <button
          className={`assign-fab ${fabRipple ? 'ripple' : ''}`}
          type="button"
          onClick={handleFabClick}
          aria-label="Add Assignment"
          title="Add Assignment"
        >
          <Plus size={24} strokeWidth={2.5} />
          <span className="assign-fab-label">Add</span>
          {fabRipple && <span className="assign-fab-ripple" />}
        </button>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <AddAssignmentModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddAssignment}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="assign-toast">
          <CheckCircle2 size={16} /> {toast}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AssignmentPage;
