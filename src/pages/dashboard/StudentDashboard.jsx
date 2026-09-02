import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { BookOpen, Award, Clock, Calendar, CheckCircle2, Video, Library, ArrowRight } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const courses = [
    { name: 'Mathematics - Algebra II', teacher: 'Dr. Sarah Connor', progress: 85, grade: 'A' },
    { name: 'Physics - Mechanics', teacher: 'Prof. Albert Vance', progress: 72, grade: 'B+' },
    { name: 'English Literature', teacher: 'Ms. Emma Watson', progress: 90, grade: 'A+' },
    { name: 'Computer Science', teacher: 'Mr. Alan Turing', progress: 95, grade: 'A+' },
  ];

  const upcomingExams = [
    { subject: 'Physics Mid-Term Exam', date: 'Tomorrow, 10:00 AM', room: 'Hall 3' },
    { subject: 'Mathematics Quiz', date: 'May 18, 02:00 PM', room: 'Room 204' },
    { subject: 'Computer Science Practical', date: 'May 20, 11:30 AM', room: 'Lab 1' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Portal</h1>
          <p className="page-subtitle">Welcome back, Alex Student! Grade 10-A</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h3>Attendance</h3>
            <div className="stat-value">96%</div>
            <span className="stat-change positive">Present 48 of 50 days</span>
          </div>
          <div className="stat-icon green">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Current GPA</h3>
            <div className="stat-value">3.85</div>
            <span className="stat-change positive">Top 5% of Grade</span>
          </div>
          <div className="stat-icon blue">
            <Award size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Enrolled Subjects</h3>
            <div className="stat-value">6</div>
            <span className="stat-change positive">All active</span>
          </div>
          <div className="stat-icon orange">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h3>Pending Tasks</h3>
            <div className="stat-value">3</div>
            <span className="stat-change negative">2 Due this week</span>
          </div>
          <div className="stat-icon red">
            <Clock size={24} />
          </div>
        </div>
      </div>

      <div className="dashboard-quick-actions" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
        <button className="btn btn-primary" type="button" onClick={() => navigate('/subjects')}>
          <BookOpen size={16} /> Enrolled Subjects
        </button>
        <button className="btn btn-primary" type="button" onClick={() => navigate('/online-classes')}>
          <Video size={16} /> Online Classes
        </button>
        <button className="btn btn-secondary" type="button" onClick={() => navigate('/library')}>
          <Library size={16} /> Library Books
        </button>
        <button className="btn btn-secondary" type="button" onClick={() => navigate('/calendar')}>
          <Calendar size={16} /> School Calendar
        </button>
      </div>

      <div className="dashboard-row">
        <div className="dashboard-card">
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>My Enrolled Courses</h2>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => navigate('/subjects')}>
              View All <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {courses.map((course, idx) => (
              <div key={idx} style={{ padding: 'var(--space-4)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>{course.name}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Instructor: {course.teacher}</p>
                  </div>
                  <span className="badge success" style={{ fontSize: 'var(--text-sm)', height: '24px' }}>Grade: {course.grade}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ flex: 1, height: '8px', background: 'var(--gray-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${course.progress}%`, height: '100%', background: 'var(--primary)' }}></div>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{course.progress}% Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Upcoming Exams & Events</h2>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => navigate('/calendar')}>
              Calendar <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {upcomingExams.map((exam, idx) => (
              <div key={idx} style={{ padding: 'var(--space-3)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--primary)', marginBottom: '4px' }}>
                  <Calendar size={14} />
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)' }}>{exam.date}</span>
                </div>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{exam.subject}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Location: {exam.room}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-row" style={{ marginTop: 'var(--space-6)' }}>
        <div className="dashboard-card">
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Library Books for You</h2>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => navigate('/library')}>
              Browse Catalog <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <span className="badge neutral" style={{ marginBottom: 'var(--space-2)' }}>Computer Science</span>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', margin: 'var(--space-2) 0' }}>The C Programming Language</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>Brian W. Kernighan</p>
              <span className="badge success">8 Available Left</span>
            </div>
            <div style={{ padding: 'var(--space-4)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <span className="badge neutral" style={{ marginBottom: 'var(--space-2)' }}>Literature</span>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', margin: 'var(--space-2) 0' }}>1984</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>George Orwell</p>
              <span className="badge success">19 Available Left</span>
            </div>
            <div style={{ padding: 'var(--space-4)', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
              <span className="badge neutral" style={{ marginBottom: 'var(--space-2)' }}>Science</span>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', margin: 'var(--space-2) 0' }}>University Physics</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>Hugh D. Young</p>
              <span className="badge success">3 Available Left</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
