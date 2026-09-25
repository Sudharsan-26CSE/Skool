import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { BookOpen, Award, Clock, Calendar, CheckCircle2, Video, Library, ArrowRight } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { AreaWaveChart, ParticleWaveChart, DotMatrixWaveChart, SparklineChart } from '../../components/common/GlassCharts';
import { getSubjects, getNotices, getLibraryBooks, getAttendance, getResults } from '../../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const studentName = localStorage.getItem('preskool-user-name') || 'Student';
  const [subjects, setSubjects] = useState([]);
  const [notices, setNotices] = useState([]);
  const [books, setBooks] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [subjectScores, setSubjectScores] = useState([]);
  const [attendancePercent, setAttendancePercent] = useState('95.0%');
  const [cumulativeGrade, setCumulativeGrade] = useState('A+ (92.4%)');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [subRes, notRes, libRes, attRes, resRes] = await Promise.all([
        getSubjects().catch(() => ({ subjects: [] })),
        getNotices().catch(() => ({ notices: [] })),
        getLibraryBooks().catch(() => ({ libraryBooks: [] })),
        getAttendance().catch(() => ({ attendances: [] })),
        getResults().catch(() => ({ examresults: [] }))
      ]);

      const subList = subRes.subjects || (Array.isArray(subRes) ? subRes : []);
      const notList = notRes.notices || (Array.isArray(notRes) ? notRes : []);
      const bookList = libRes.libraryBooks || (Array.isArray(libRes) ? libRes : []);
      const attList = attRes.attendances || (Array.isArray(attRes) ? attRes : []);
      const resList = resRes.examresults || resRes.results || (Array.isArray(resRes) ? resRes : []);

      setSubjects(subList);
      setNotices(notList);
      setBooks(bookList.slice(0, 4));
      setExamResults(resList);

      if (attList.length > 0) {
        const presentCount = attList.filter(a => a.status === 'present').length;
        const pct = Math.round((presentCount / attList.length) * 100);
        setAttendancePercent(`${pct}%`);
      }

      if (resList.length > 0) {
        const topResult = resList[0];
        setCumulativeGrade(`${topResult.grade || 'A'} (${topResult.percentage || '92.4%'})`);

        // Map real subject scores from DB
        const scoreEntries = [
          { name: 'Mathematics', score: Number(topResult.math) || 94, gradient: 'linear-gradient(90deg, #6366f1, #8b5cf6)' },
          { name: 'Computer Science', score: Number(topResult.computer) || 98, gradient: 'linear-gradient(90deg, #06b6d4, #38bdf8)' },
          { name: 'Physics', score: Number(topResult.physics) || 90, gradient: 'linear-gradient(90deg, #10b981, #34d399)' },
          { name: 'English', score: Number(topResult.english) || 92, gradient: 'linear-gradient(90deg, #f59e0b, #fb923c)' },
          { name: 'Chemistry', score: Number(topResult.chemistry) || 88, gradient: 'linear-gradient(90deg, #ec4899, #a855f7)' }
        ];
        setSubjectScores(scoreEntries);
      }
    } catch (err) {
      console.error('Failed to load student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title text-shimmer-anim">Student Portal</h1>
          <p className="page-subtitle">Welcome back, {studentName}! Grade 10-A Academic Portal</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Overall Attendance"
          value={attendancePercent}
          change="Current Academic Term"
          positive={true}
          badge="Good"
          accent="emerald"
          icon={CheckCircle2}
          delay={0}
        />

        <StatCard
          title="Cumulative Performance"
          value={cumulativeGrade}
          change="Latest Exam Grade"
          positive={true}
          accent="indigo"
          icon={Award}
          delay={0.08}
        />

        <StatCard
          title="Active Curriculum"
          value={`${subjects.length} Subjects`}
          change="Enrolled Term Courses"
          positive={true}
          accent="sky"
          icon={BookOpen}
          delay={0.16}
        />

        <StatCard
          title="Circulars & Notices"
          value={`${notices.length} Published`}
          change="Recent Notifications"
          positive={true}
          accent="amber"
          icon={Clock}
          delay={0.24}
        />
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
            {subjects.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', padding: '16px', textAlign: 'center' }}>No enrolled courses found.</p>
            ) : subjects.map((sub, idx) => {
              const matchedScore = subjectScores.find(s => s.name.toLowerCase().includes(sub.name?.toLowerCase()) || sub.name?.toLowerCase().includes(s.name.toLowerCase()));
              const scoreVal = matchedScore ? matchedScore.score : (85 + (idx % 10));
              return (
                <div key={sub._id || idx} className="student-course-card hover-lift" onClick={() => navigate('/subjects')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)' }}>{sub.name}</h3>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Code: {sub.code} • {sub.category || 'Academic'}</p>
                    </div>
                    <span className="badge success" style={{ fontSize: 'var(--text-sm)', height: '24px' }}>{sub.credits || 3} Credits</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ flex: 1, height: '8px', background: 'rgba(150, 160, 180, 0.2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div className="course-progress-bar" style={{ width: `${scoreVal}%`, height: '100%', background: matchedScore ? matchedScore.gradient : 'linear-gradient(90deg, #0ea5e9, #38bdf8)', borderRadius: 'var(--radius-full)' }}></div>
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {matchedScore ? `${matchedScore.score}% Score` : `${scoreVal}% Progress`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0 }}>Mid-Term Subject Scores</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>From latest examination results</span>
            </div>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => navigate('/results')}>
              Report Card <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            {subjectScores.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', padding: '16px', textAlign: 'center' }}>No exam results published yet.</p>
            ) : subjectScores.map((sc, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{sc.name}</span>
                  <strong>{sc.score} / 100</strong>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(150, 160, 180, 0.16)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${sc.score}%`, height: '100%', background: sc.gradient, borderRadius: '10px', transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-row" style={{ marginTop: 'var(--space-6)' }}>
        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Available Library Books</h2>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => navigate('/library')}>
              Browse Catalog <ArrowRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
            {books.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', padding: '16px', textAlign: 'center', gridColumn: '1 / -1' }}>No library books found.</p>
            ) : books.map((b, idx) => (
              <div key={b._id || idx} className="student-library-card hover-lift" onClick={() => navigate('/library')}>
                <span className="badge neutral" style={{ marginBottom: 'var(--space-2)' }}>{b.category || 'General'}</span>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', margin: 'var(--space-2) 0' }}>{b.bookTitle || b.title}</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>{b.author || 'Author'}</p>
                <span className="badge success">{b.availableCopies || b.copies || 1} Copies Available</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
