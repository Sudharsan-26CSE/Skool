import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, Users, UserRoundMinus } from 'lucide-react';

const ClassManagementPage = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([
    { name: 'Janet Adebayo', rollNumber: 'STU-1001', className: 'Grade 9' },
    { name: 'Marcus Chen', rollNumber: 'STU-1002', className: 'Grade 9' },
    { name: 'Sophia Smith', rollNumber: 'STU-1003', className: 'Grade 10' },
    { name: 'Lucas Williams', rollNumber: 'STU-1004', className: 'Grade 10' },
    { name: 'Olivia Johnson', rollNumber: 'STU-1005', className: 'Grade 11' },
    { name: 'Noah Wilson', rollNumber: 'STU-1006', className: 'Grade 11' },
  ]);
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

      {!selectedClass ? <div className="detail-grid teacher-card-grid">
        {classes.map((cls, idx) => (
          <button key={idx} type="button" className="detail-card teacher-grid-card" onClick={() => setSelectedClass(cls.grade)}>
            <div className="detail-card-header">
              <h3 className="detail-card-title">{cls.grade}</h3>
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
            <div className="detail-card-actions">
              <span className="btn btn-secondary btn-sm">View Students</span>
              <span className="btn btn-ghost btn-sm">View Schedule</span>
            </div>
          </button>
        ))}
      </div> : (
        <section className="student-grid-panel">
          <div className="page-header">
            <div><h2 className="page-title">{selectedClass} Students</h2><p className="page-subtitle">Student names and roll numbers</p></div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelectedClass(null)}>Back to Classes</button>
          </div>
          <div className="student-grid">
            {students.filter((student) => student.className === selectedClass).map((student) => (
              <div className="student-grid-card" key={student.rollNumber}>
                <div><strong>{student.name}</strong><span>{student.rollNumber}</span></div>
                <button type="button" className="icon-btn danger" title={`Remove ${student.name}`} onClick={() => setStudents((current) => current.filter((item) => item.rollNumber !== student.rollNumber))}><UserRoundMinus size={16} /></button>
              </div>
            ))}
          </div>
          <button type="button" className="floating-add-btn" title="Add student" onClick={() => setStudents((current) => [...current, { name: 'New Student', rollNumber: `STU-${1001 + current.length}`, className: selectedClass }])}><Plus size={20} /></button>
        </section>
      )}
    </DashboardLayout>
  );
};

export default ClassManagementPage;
