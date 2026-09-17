import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { BookOpen, Award, Clock, Calendar, CheckCircle2, Video, Library, ArrowRight } from 'lucide-react';
import { AreaWaveChart, ParticleWaveChart, DotMatrixWaveChart, SparklineChart } from '../../components/common/GlassCharts';

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
          <h1 className="page-title text-shimmer-anim">Student Portal</h1>
          <p className="page-subtitle">Welcome back, Alex Student! Grade 10-A</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Overall Attendance</h3>
            <span className="live-pulse-badge"><span className="live-dot" /> On Track</span>
          </div>
          <div className="stat-value text-glow-anim">96.8%</div>
          <div className="stat-change positive">Present 48 of 50 days</div>
          <div className="stat-chart-container">
            <AreaWaveChart color="#34d399" />
          </div>
        </div>

        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Cumulative Percentage</h3>
          </div>
          <div className="stat-value text-glow-anim">91.24%</div>
          <div className="stat-change positive">Top 5% of Grade</div>
          <div className="stat-chart-container">
            <ParticleWaveChart color="#818cf8" />
          </div>
        </div>

        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Active Curriculum</h3>
          </div>
          <div className="stat-value text-glow-anim">6 Subjects</div>
          <div className="stat-change positive">All active courses</div>
          <div className="stat-chart-container">
            <DotMatrixWaveChart color="#38bdf8" />
          </div>
        </div>

        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Upcoming Tasks</h3>
          </div>
          <div className="stat-value text-glow-anim">3 Pending</div>
          <div className="stat-change negative">2 Due this week</div>
          <div className="stat-chart-container">
            <SparklineChart color="#f87171" />
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
        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>My Enrolled Courses</h2>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => navigate('/subjects')}>
              View All <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {courses.map((course, idx) => (
              <div key={idx} className="student-course-card hover-lift" onClick={() => navigate('/subjects')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>{course.name}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Instructor: {course.teacher}</p>
                  </div>
                  <span className="badge success" style={{ fontSize: 'var(--text-sm)', height: '24px' }}>Grade: {course.grade}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ flex: 1, height: '8px', background: 'rgba(150, 160, 180, 0.2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div className="course-progress-bar" style={{ width: `${course.progress}%`, height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)', borderRadius: 'var(--radius-full)' }}></div>
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{course.progress}% Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Upcoming Exams & Events</h2>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => navigate('/calendar')}>
              Calendar <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {upcomingExams.map((exam, idx) => (
              <div key={idx} className="student-exam-card hover-lift" onClick={() => navigate('/calendar')}>
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
        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Library Books for You</h2>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => navigate('/library')}>
              Browse Catalog <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="student-library-card hover-lift" onClick={() => navigate('/library')}>
              <span className="badge neutral" style={{ marginBottom: 'var(--space-2)' }}>Computer Science</span>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', margin: 'var(--space-2) 0' }}>The C Programming Language</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>Brian W. Kernighan</p>
              <span className="badge success">8 Available Left</span>
            </div>
            <div className="student-library-card hover-lift" onClick={() => navigate('/library')}>
              <span className="badge neutral" style={{ marginBottom: 'var(--space-2)' }}>Literature</span>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', margin: 'var(--space-2) 0' }}>1984</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>George Orwell</p>
              <span className="badge success">19 Available Left</span>
            </div>
            <div className="student-library-card hover-lift" onClick={() => navigate('/library')}>
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
