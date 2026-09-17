import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, BookOpen, Clock, Calendar, CheckSquare, ArrowUpRight, ChevronRight, Video, ClipboardCheck } from 'lucide-react';
import { ParticleWaveChart, DotMatrixWaveChart, AreaWaveChart, SparklineChart } from '../../components/common/GlassCharts';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(0);
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
          <h1 className="page-title text-shimmer-anim">Teacher Portal</h1>
          <p className="page-subtitle">Welcome back, Prof. Sarah Connor! Mathematics Department</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Active Classes</h3>
            <span className="live-pulse-badge"><span className="live-dot" /> Live Term</span>
          </div>
          <div className="stat-value text-glow-anim">5 Classes</div>
          <div className="stat-change positive">93 Total Students</div>
          <div className="stat-chart-container">
            <ParticleWaveChart color="#38bdf8" />
          </div>
        </div>

        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Hours Taught</h3>
          </div>
          <div className="stat-value text-glow-anim">24h</div>
          <div className="stat-change positive">This week on track</div>
          <div className="stat-chart-container">
            <AreaWaveChart color="#34d399" />
          </div>
        </div>

        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Pending Grading</h3>
          </div>
          <div className="stat-value text-glow-anim">2 Batches</div>
          <div className="stat-change negative">Assignments awaiting review</div>
          <div className="stat-chart-container">
            <SparklineChart color="#f59e0b" />
          </div>
        </div>

        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Class Attendance</h3>
          </div>
          <div className="stat-value text-glow-anim">94.2%</div>
          <div className="stat-change positive">Above school average</div>
          <div className="stat-chart-container">
            <DotMatrixWaveChart color="#6366f1" />
          </div>
        </div>
      </div>

      <div className="dashboard-quick-actions">
        <button className="btn btn-primary" type="button" onClick={() => navigate('/online-classes')}>
          <Video size={16} /> Add Online Class
        </button>
        <button className="btn btn-secondary" type="button" onClick={() => navigate('/attendance')}>
          <ClipboardCheck size={16} /> Save Attendance
        </button>
      </div>

      <div className="dashboard-row">
        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header">
            <h2>Today's Teaching Schedule</h2>
          </div>
          <div className="dashboard-list">
            {classes.map((cls, idx) => (
              <button key={idx} type="button" className={`dashboard-list-item ${selectedClass === idx ? 'selected' : ''}`} onClick={() => setSelectedClass(idx)}>
                <div>
                  <h3 className="item-title">{cls.name}</h3>
                  <div className="item-meta">
                    <span className="item-meta-item"><Users size={12} />{cls.students} Students</span>
                    <span className="item-meta-item">Location: {cls.room}</span>
                  </div>
                </div>
                <span className="badge info item-badge"><Clock size={12} />{cls.time}<ChevronRight size={14} /></span>
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header">
            <h2>Pending Grading</h2>
          </div>
          <div className="pending-list">
            {pendingGrading.map((item, idx) => (
              <div key={idx} className="pending-item hover-lift">
                <h4 className="pending-title">{item.title}</h4>
                <p className="pending-meta">{item.class} • Submissions: {item.submissions}</p>
                <div className="pending-actions">
                  <span className="pending-due">Due: {item.dueDate}</span>
                  <button className="btn btn-primary btn-sm" type="button" onClick={() => navigate('/assignments')}>Grade Now <ArrowUpRight size={14} /></button>
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
