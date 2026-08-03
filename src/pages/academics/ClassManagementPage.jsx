import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Building2, Plus, Users, BookOpen } from 'lucide-react';

const ClassManagementPage = () => {
  const classes = [
    { grade: 'Grade 9', sections: ['9-A', '9-B', '9-C'], headTeacher: 'Mrs. Maria Garcia', totalStudents: 92 },
    { grade: 'Grade 10', sections: ['10-A', '10-B'], headTeacher: 'Dr. Sarah Connor', totalStudents: 68 },
    { grade: 'Grade 11', sections: ['11-A', '11-B', '11-C'], headTeacher: 'Prof. Albert Vance', totalStudents: 85 },
    { grade: 'Grade 12', sections: ['12-A', '12-B'], headTeacher: 'Mr. Alan Turing', totalStudents: 60 },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Class Management</h1>
          <p className="page-subtitle">Configure classes, sections, and class teacher assignments</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Create New Class
        </button>
      </div>

      <div className="detail-grid">
        {classes.map((cls, idx) => (
          <div key={idx} className="detail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ border: 'none', padding: 0, margin: 0 }}>{cls.grade}</h3>
              <span className="badge info">{cls.totalStudents} Students</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Sections</span>
              <span className="detail-value">{cls.sections.join(', ')}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Grade Supervisor</span>
              <span className="detail-value">{cls.headTeacher}</span>
            </div>
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
              <button className="btn btn-secondary btn-sm">Manage Sections</button>
              <button className="btn btn-ghost btn-sm">View Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ClassManagementPage;
