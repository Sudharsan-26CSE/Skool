import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FileText, Plus, Calendar, Tag } from 'lucide-react';

const NoticeBoardPage = () => {
  const notices = [
    { title: 'Annual Sports Day 2024 Registration', date: 'May 15, 2024', category: 'Events', author: 'Sports Dept', content: 'All students interested in track & field events must submit their entry forms by Friday.' },
    { title: 'Mid-Term Examination Schedule', date: 'May 18, 2024', category: 'Academic', author: 'Examination Cell', content: 'Detailed timetable and hall ticket distribution will commence from next Monday.' },
    { title: 'Parent-Teacher Meeting for Grade 10', date: 'May 22, 2024', category: 'Meeting', author: 'Principal Office', content: 'Individual progress reports will be discussed. Attendance is compulsory.' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Notice Board</h1>
          <p className="page-subtitle">School circulars, announcements, and news</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Post New Notice
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {notices.map((n, idx) => (
          <div key={idx} className="detail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="badge info">{n.category}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}><Calendar size={12} style={{ marginRight: '4px' }} />{n.date}</span>
            </div>
            <h3 style={{ border: 'none', padding: 0, margin: 'var(--space-2) 0' }}>{n.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{n.content}</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Issued by: <strong>{n.author}</strong></p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default NoticeBoardPage;
