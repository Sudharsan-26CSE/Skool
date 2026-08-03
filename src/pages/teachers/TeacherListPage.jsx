import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Plus, Search, Filter, Mail, Phone, BookOpen } from 'lucide-react';

const TeacherListPage = () => {
  const teachers = [
    { id: 'TCH-201', name: 'Dr. Sarah Connor', subject: 'Mathematics', class: 'Grade 10-A, 9-B', email: 'sarah.c@preskool.edu', phone: '+1 555-0192', experience: '8 Years', status: 'Active' },
    { id: 'TCH-202', name: 'Prof. Albert Vance', subject: 'Physics', class: 'Grade 11-A, 12-A', email: 'albert.v@preskool.edu', phone: '+1 555-0193', experience: '12 Years', status: 'Active' },
    { id: 'TCH-203', name: 'Ms. Emma Watson', subject: 'English', class: 'Grade 8-B, 10-B', email: 'emma.w@preskool.edu', phone: '+1 555-0194', experience: '5 Years', status: 'Active' },
    { id: 'TCH-204', name: 'Mr. Alan Turing', subject: 'Computer Science', class: 'Grade 11-B, 12-B', email: 'alan.t@preskool.edu', phone: '+1 555-0195', experience: '15 Years', status: 'On Leave' },
    { id: 'TCH-205', name: 'Mrs. Maria Garcia', subject: 'Chemistry', class: 'Grade 9-A, 10-A', email: 'maria.g@preskool.edu', phone: '+1 555-0196', experience: '7 Years', status: 'Active' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Teacher Directory</h1>
          <p className="page-subtitle">Manage teaching faculty and department allocations</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add Teacher
        </button>
      </div>

      <div className="data-table-container">
        <div className="data-table-header">
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-placeholder)' }} />
            <input
              type="text"
              placeholder="Search by teacher name or subject..."
              style={{ width: '100%', padding: 'var(--space-2) var(--space-4)', paddingLeft: '36px', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', outline: 'none' }}
            />
          </div>
          <div className="data-table-actions">
            <button className="btn btn-secondary">
              <Filter size={16} /> Filter Department
            </button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Teacher</th>
              <th>Subject</th>
              <th>Classes Assigned</th>
              <th>Contact Phone</th>
              <th>Experience</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((tch) => (
              <tr key={tch.id}>
                <td><strong>{tch.id}</strong></td>
                <td>
                  <div className="table-user">
                    <div className="table-avatar" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>{tch.name.charAt(0)}</div>
                    <div className="table-user-info">
                      <span className="table-user-name">{tch.name}</span>
                      <span className="table-user-email">{tch.email}</span>
                    </div>
                  </div>
                </td>
                <td><span className="badge info">{tch.subject}</span></td>
                <td>{tch.class}</td>
                <td>{tch.phone}</td>
                <td>{tch.experience}</td>
                <td>
                  <span className={`badge ${tch.status === 'Active' ? 'success' : 'warning'}`}>
                    {tch.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default TeacherListPage;
