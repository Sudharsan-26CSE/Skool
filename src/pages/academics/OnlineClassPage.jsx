import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Video, Plus, Clock, Users } from 'lucide-react';

const OnlineClassPage = () => {
  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isStudent = role === 'student';

  const virtualClasses = [
    { title: 'Calculus Advanced Problem Solving', teacher: 'Dr. Sarah Connor', class: 'Grade 12-A', time: '10:00 AM - 11:30 AM', status: 'Live Now' },
    { title: 'Quantum Mechanics Intro', teacher: 'Prof. Albert Vance', class: 'Grade 11-A', time: '02:00 PM - 03:30 PM', status: 'Scheduled' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Virtual Classrooms</h1>
          <p className="page-subtitle">{isStudent ? 'Join live online video lectures and study sessions' : 'Schedule and join live online video lectures'}</p>
        </div>
        {!isStudent && (
          <button className="btn btn-primary">
            <Plus size={16} /> Schedule Live Session
          </button>
        )}
      </div>

      <div className="detail-grid teacher-card-grid">
        {virtualClasses.map((vc, idx) => (
          <div key={idx} className="detail-card teacher-grid-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <span className={`badge ${vc.status === 'Live Now' ? 'error' : 'info'}`}>
                <Video size={12} style={{ marginRight: '4px' }} />{vc.status}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{vc.time}</span>
            </div>
            <h3 style={{ border: 'none', padding: 0, margin: 'var(--space-2) 0' }}>{vc.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
              Instructor: {vc.teacher} • {vc.class}
            </p>
            <button className={`btn ${vc.status === 'Live Now' ? 'btn-danger' : 'btn-primary'}`} style={{ width: '100%' }}>
              {vc.status === 'Live Now' ? 'Join Live Meeting' : 'View Link & Details'}
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default OnlineClassPage;
