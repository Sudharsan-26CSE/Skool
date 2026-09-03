import React, { useRef, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, UploadCloud, CalendarDays, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';

const AssignmentPage = () => {
  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isTeacher = role === 'teacher' || role === 'staff';
  const isStudent = role === 'student';
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState({});
  const fileInputRef = useRef(null);

  const assignments = [
    { id: 'algebra-polynomials', title: 'Algebra II Polynomials Problem Set', class: 'Grade 10-A', subject: 'Mathematics', startDate: 'May 10, 2024', dueDate: 'May 16, 2024', status: 'Active', submissions: '28/34' },
    { id: 'mechanics-newton-laws', title: 'Mechanics & Newton Laws Report', class: 'Grade 11-A', subject: 'Physics', startDate: 'May 12, 2024', dueDate: 'May 18, 2024', status: 'Active', submissions: '15/30' },
    { id: 'shakespeare-hamlet', title: 'Shakespeare Hamlet Essay', class: 'Grade 10-B', subject: 'English', startDate: 'May 14, 2024', dueDate: 'May 20, 2024', status: 'Draft', submissions: '0/28' },
  ];

  const selectedAssignment = assignments.find((assignment) => assignment.id === assignmentId);

  const selectedSubmission = selectedAssignment
    ? submissions[selectedAssignment.id]
    : null;

  const handleFile = (file) => {
    if (file) {
      setSubmissions((current) => ({
        ...current,
        [selectedAssignment.id]: {
          file,
          isSubmitted: false,
          fileUrl: URL.createObjectURL(file),
        },
      }));
    }
  };

  const submitAssignment = () => {
    if (!selectedAssignment || !selectedSubmission) return;
    setSubmissions((current) => ({
      ...current,
      [selectedAssignment.id]: { ...selectedSubmission, isSubmitted: true },
    }));
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          {isStudent && selectedAssignment && (
            <button className="btn btn-ghost assignment-back-btn" type="button" onClick={() => navigate('/assignments')}>
              <ArrowLeft size={16} /> All assignments
            </button>
          )}
          <h1 className="page-title">{selectedAssignment?.title || 'Homework & Assignments'}</h1>
          <p className="page-subtitle">{selectedAssignment ? `${selectedAssignment.subject} | ${selectedAssignment.class}` : 'Track, assign, and collect student coursework'}</p>
        </div>
        {isTeacher && !selectedAssignment && <button className="btn btn-primary" type="button" onClick={() => navigate('/assignments/add')}><Plus size={16} /> Create Assignment</button>}
      </div>

      {!selectedAssignment && <div className="detail-grid">
        {assignments.map((asgn, idx) => (
          <button
            key={idx}
            type="button"
            className={`detail-card assignment-card ${isStudent ? 'assignment-card-clickable' : ''}`}
            onClick={() => isStudent && navigate(`/assignments/${asgn.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="badge info">{asgn.subject}</span>
              {isStudent ? (
                <span className={`badge ${submissions[asgn.id]?.isSubmitted ? 'success' : 'error'}`}>
                  {submissions[asgn.id]?.isSubmitted ? 'Uploaded' : 'Not uploaded'}
                </span>
              ) : (
                <span className={`badge ${asgn.status === 'Active' ? 'success' : 'neutral'}`}>{asgn.status}</span>
              )}
            </div>
            <h3 style={{ border: 'none', padding: 0, margin: 'var(--space-2) 0' }}>{asgn.title}</h3>
            <div className="detail-row">
              <span className="detail-label">Assigned Class</span>
              <span className="detail-value">{asgn.class}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Due Date</span>
              <span className="detail-value" style={{ color: 'var(--error)' }}>{asgn.dueDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Submissions</span>
              <span className="detail-value">{asgn.submissions}</span>
            </div>
          </button>
        ))}
      </div>}

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
              <a href={selectedSubmission.fileUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
                Open file
              </a>
            </div>
          )}

          <button
            className={`assignment-dropzone ${selectedSubmission ? 'has-file' : ''}`}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              handleFile(event.dataTransfer.files[0]);
            }}
          >
            <UploadCloud size={30} />
            <strong>{selectedSubmission ? 'Replace uploaded file' : 'Drag and drop your file here'}</strong>
            <span>or click to browse from your device</span>
            <input ref={fileInputRef} type="file" hidden onChange={(event) => handleFile(event.target.files[0])} />
          </button>

          <div className="assignment-submit-actions">
            <button className="btn btn-primary" type="button" disabled={!selectedSubmission} onClick={submitAssignment}>
              <CheckCircle2 size={16} /> {selectedSubmission?.isSubmitted ? 'Submitted' : 'Submit Assignment'}
            </button>
          </div>
        </section>
      )}
      {isTeacher && (
        <button className="assignment-give-mark btn btn-primary" type="button">
          <CheckCircle2 size={16} /> Give Mark
        </button>
      )}
    </DashboardLayout>
  );
};

export default AssignmentPage;
