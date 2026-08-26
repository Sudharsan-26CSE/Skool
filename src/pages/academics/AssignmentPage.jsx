import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, BookCheck, Clock, CheckCircle2 } from 'lucide-react';

const AssignmentPage = () => {
  const isTeacher = localStorage.getItem('preskool-role') === 'teacher';
  const assignments = [
    { title: 'Algebra II Polynomials Problem Set', class: 'Grade 10-A', subject: 'Mathematics', dueDate: 'May 16, 2024', status: 'Active', submissions: '28/34' },
    { title: 'Mechanics & Newton Laws Report', class: 'Grade 11-A', subject: 'Physics', dueDate: 'May 18, 2024', status: 'Active', submissions: '15/30' },
    { title: 'Shakespeare Hamlet Essay', class: 'Grade 10-B', subject: 'English', dueDate: 'May 20, 2024', status: 'Draft', submissions: '0/28' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Homework & Assignments</h1>
          <p className="page-subtitle">Track, assign, and collect student coursework</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Create Assignment
        </button>
      </div>

      <div className="detail-grid">
        {assignments.map((asgn, idx) => (
          <div key={idx} className="detail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="badge info">{asgn.subject}</span>
              <span className={`badge ${asgn.status === 'Active' ? 'success' : 'neutral'}`}>{asgn.status}</span>
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
          </div>
        ))}
      </div>
      {isTeacher && (
        <button className="assignment-give-mark btn btn-primary" type="button">
          <CheckCircle2 size={16} /> Give Mark
        </button>
      )}
    </DashboardLayout>
  );
};

export default AssignmentPage;
