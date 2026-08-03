import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, BookOpen, Clock, Calendar, CheckSquare } from 'lucide-react';

const TeacherDashboard = () => {
  const classes = [
    { name: 'Grade 10-A Mathematics', students: 34, room: 'Room 102', time: '09:00 AM - 10:00 AM' },
    { name: 'Grade 9-B Algebra', students: 28, room: 'Room 105', time: '10:30 AM - 11:30 AM' },
    { name: 'Grade 11-C Geometry', students: 31, room: 'Room 201', time: '01:00 PM - 02:00 PM' },
  ];

  const pendingGrading = [
    { title: 'Algebra II Quiz 3', class: 'Grade 10-A', submissions: '34/34', dueDate: 'May 12' },
    { title: 'Geometry Mid-Term Paper', class: 'Grade 11-C', submissions: '25/31', dueDate: 'May 15' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Teacher Portal</h1>
          <p className="page-subtitle">Welcome back, Prof. Sarah Connor! Mathematics Department</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>My Classes</h3>
            <div className="stat-value">5</div>
            <span className="stat-change positive">93 Total Students</span>
          </div>
          <div className="stat-icon blue">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Hours Taught</h3>
            <div className="stat-value">24h</div>
            <span className="stat-change positive">This week</span>
          </div>
          <div className="stat-icon green">
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Pending Grading</h3>
            <div className="stat-value">2</div>
            <span className="stat-change negative">Assignments awaiting review</span>
          </div>
          <div className="stat-icon orange">
            <CheckSquare size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Attendance Rate</h3>
            <div className="stat-value">94.2%</div>
            <span className="stat-change positive">Above school average</span>
          </div>
          <div className="stat-icon teal">
            <Users size={24} />
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Today's Teaching Schedule</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {classes.map((cls, idx) => (
              <div key={idx} style={{ padding: 'var(--space-4)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>{cls.name}</h3>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    <span><Users size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{cls.students} Students</span>
                    <span>Location: {cls.room}</span>
                  </div>
                </div>
                <span className="badge info"><Clock size={12} style={{ marginRight: '4px' }} />{cls.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Pending Grading</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {pendingGrading.map((item, idx) => (
              <div key={idx} style={{ padding: 'var(--space-3)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{item.title}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>{item.class} • Submissions: {item.submissions}</p>
                <div style={{ marginTop: 'var(--space-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--error)' }}>Due: {item.dueDate}</span>
                  <button className="btn btn-primary btn-sm">Grade Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
