import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FileText, Plus, Calendar, Tag } from 'lucide-react';

const NoticeBoardPage = () => {
  const navigate = useNavigate();
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
        <button className="btn btn-primary" type="button" onClick={() => navigate('/notice-board/add')}>
          <Plus size={16} /> Post New Notice
        </button>
      </div>

      <div className="notice-list teacher-card-grid">
        {notices.map((n, idx) => (
          <div key={idx} className="detail-card teacher-grid-card">
            <div className="notice-card-header">
              <span className="badge info">{n.category}</span>
              <span className="notice-date"><Calendar size={12} />{n.date}</span>
            </div>
            <h3 className="notice-title">{n.title}</h3>
            <p className="notice-content">{n.content}</p>
            <p className="notice-author">Issued by: <strong>{n.author}</strong></p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default NoticeBoardPage;
