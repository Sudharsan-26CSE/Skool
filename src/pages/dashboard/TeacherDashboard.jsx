import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Users, BookOpen, Clock, Calendar, CheckSquare, ArrowUpRight, ChevronRight, Video, ClipboardCheck } from 'lucide-react';
import { ParticleWaveChart, DotMatrixWaveChart, AreaWaveChart, SparklineChart } from '../../components/common/GlassCharts';
import { getClasses, getStudents, getTimetables, getAssignments, getAttendance } from '../../services/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const teacherName = localStorage.getItem('preskool-user-name') || 'Faculty';
  const [selectedClass, setSelectedClass] = useState(0);
  const [classesList, setClassesList] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [pendingGrading, setPendingGrading] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState('95.0%');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const [clsRes, stuRes, timeRes, assignRes, attRes] = await Promise.all([
        getClasses().catch(() => ({ classes: [] })),
        getStudents().catch(() => ({ students: [] })),
        getTimetables().catch(() => ({ timetables: [] })),
        getAssignments().catch(() => ({ assignments: [] })),
        getAttendance().catch(() => ({ attendances: [] }))
      ]);

      const cls = clsRes.classes || (Array.isArray(clsRes) ? clsRes : []);
      const stus = stuRes.students || (Array.isArray(stuRes) ? stuRes : []);
      const times = timeRes.timetables || (Array.isArray(timeRes) ? timeRes : []);
      const assigns = assignRes.assignments || (Array.isArray(assignRes) ? assignRes : []);
      const atts = attRes.attendances || (Array.isArray(attRes) ? attRes : []);

      setClassesList(cls);
      setTotalStudents(stus.length);

      // Map timetables to schedule items
      const mappedSchedule = times.map(t => ({
        name: `${t.class?.name || 'Class'} ${t.class?.section || ''} - ${t.subject?.name || 'Subject'}`,
        students: stus.filter(s => s.class?.name === t.class?.name || s.grade === t.class?.name).length || 25,
        room: t.roomNo || 'Room 101',
        time: `${t.startTime || '09:00'} - ${t.endTime || '10:00'}`
      }));
      setSchedule(mappedSchedule);

      // Map assignments to pending grading
      const mappedAssigns = assigns.map(a => ({
        title: a.title,
        class: a.class?.name || a.class || 'All Sections',
        submissions: `${a.submissions?.length || 0} Submitted`,
        dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'Active'
      }));
      setPendingGrading(mappedAssigns);

      // Attendance percentage
      if (atts.length > 0) {
        const present = atts.filter(a => a.status === 'present').length;
        setAttendanceRate(`${Math.round((present / atts.length) * 100)}%`);
      }
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title text-shimmer-anim">Teacher Portal</h1>
          <p className="page-subtitle">Welcome back, {teacherName}! Academic Department</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Active Classes</h3>
            <span className="live-pulse-badge"><span className="live-dot" /> Live Term</span>
          </div>
          <div className="stat-value text-glow-anim">{classesList.length} Classes</div>
          <div className="stat-change positive">{totalStudents} Total Students</div>
          <div className="stat-chart-container">
            <ParticleWaveChart color="#38bdf8" />
          </div>
        </div>

        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Weekly Periods</h3>
          </div>
          <div className="stat-value text-glow-anim">{schedule.length * 5} Periods</div>
          <div className="stat-change positive">Active schedule in DB</div>
          <div className="stat-chart-container">
            <AreaWaveChart color="#34d399" />
          </div>
        </div>

        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Assignments</h3>
          </div>
          <div className="stat-value text-glow-anim">{pendingGrading.length} Active</div>
          <div className="stat-change neutral">Coursework tasks in DB</div>
          <div className="stat-chart-container">
            <SparklineChart color="#f59e0b" />
          </div>
        </div>

        <div className="stat-card glass-card hover-lift">
          <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 className="stat-title">Class Attendance</h3>
          </div>
          <div className="stat-value text-glow-anim">{attendanceRate}</div>
          <div className="stat-change positive">From registered logs</div>
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
          <ClipboardCheck size={16} /> Mark Attendance
        </button>
      </div>

      <div className="dashboard-row">
        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header">
            <h2>Teaching Schedule</h2>
          </div>
          <div className="dashboard-list">
            {schedule.length === 0 ? (
              <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No schedule entries found in database</p>
            ) : (
              schedule.map((cls, idx) => (
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
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header">
            <h2>Assignments & Grading</h2>
          </div>
          <div className="pending-list">
            {pendingGrading.length === 0 ? (
              <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No assignments registered in database</p>
            ) : (
              pendingGrading.map((item, idx) => (
                <div key={idx} className="pending-item hover-lift">
                  <h4 className="pending-title">{item.title}</h4>
                  <p className="pending-meta">{item.class} • {item.submissions}</p>
                  <div className="pending-actions">
                    <span className="pending-due">Due: {item.dueDate}</span>
                    <button className="btn btn-primary btn-sm" type="button" onClick={() => navigate('/assignments')}>Review <ArrowUpRight size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
