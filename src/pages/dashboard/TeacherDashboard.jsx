import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Users, BookOpen, Clock, Calendar, CheckSquare, ArrowUpRight,
  Video, ClipboardCheck, FileSpreadsheet, RefreshCw,
  CheckCircle2, Plus
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { getClasses, getStudents, getTimetables, getAssignments, getAttendance, getOnlineClasses } from '../../services/api';
import { exportToExcel } from '../../utils/exportToExcel';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const teacherName = localStorage.getItem('preskool-user-name') || 'Faculty';
  const [selectedClass, setSelectedClass] = useState(0);
  const [classesList, setClassesList] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [pendingGrading, setPendingGrading] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState('0%');
  const [onlineClassesCount, setOnlineClassesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const [clsRes, stuRes, timeRes, assignRes, attRes, onlineRes] = await Promise.all([
        getClasses().catch(() => ({ classes: [] })),
        getStudents().catch(() => ({ students: [] })),
        getTimetables().catch(() => ({ timetables: [] })),
        getAssignments().catch(() => ({ assignments: [] })),
        getAttendance().catch(() => ({ attendances: [] })),
        getOnlineClasses().catch(() => ({ onlineClasses: [] }))
      ]);

      const cls = clsRes.classes || (Array.isArray(clsRes) ? clsRes : (clsRes.items || []));
      const stus = stuRes.students || (Array.isArray(stuRes) ? stuRes : (stuRes.items || []));
      const times = timeRes.timetables || (Array.isArray(timeRes) ? timeRes : (timeRes.items || []));
      const assigns = assignRes.assignments || (Array.isArray(assignRes) ? assignRes : (assignRes.items || []));
      const atts = attRes.attendances || (Array.isArray(attRes) ? attRes : (attRes.items || []));
      const onlines = onlineRes.onlineClasses || (Array.isArray(onlineRes) ? onlineRes : (onlineRes.items || []));

      setClassesList(cls);
      setTotalStudents(stus.length);
      setOnlineClassesCount(onlines.length);

      // Map timetables to schedule items strictly from database
      const mappedSchedule = times.map(t => {
        const clsName = t.class?.name || t.className || 'Class';
        const matchCount = stus.filter(s => (s.className || s.class?.name || '').includes(clsName)).length;
        return {
          name: `${clsName} ${t.class?.section || ''} - ${t.subject?.name || t.subject || 'Subject'}`,
          className: clsName,
          subject: t.subject?.name || t.subject || 'Academic Session',
          students: matchCount || stus.length || 0,
          room: t.roomNo || t.room || 'Room N/A',
          time: t.time || `${t.startTime || '09:00 AM'} - ${t.endTime || '10:00 AM'}`
        };
      });
      setSchedule(mappedSchedule);

      // Map assignments to pending grading directly from database
      const mappedAssigns = assigns.map(a => ({
        id: a._id,
        title: a.title,
        class: a.className || a.class?.name || a.class || 'Class',
        submissions: `${a.submissions || '0'} Submitted`,
        dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'Active'
      }));
      setPendingGrading(mappedAssigns);

      // Real Attendance calculation from database logs
      if (atts.length > 0) {
        const present = atts.filter(a => (a.status || '').toLowerCase() === 'present').length;
        const rate = Math.round((present / atts.length) * 100);
        setAttendanceRate(`${rate}%`);
      } else {
        setAttendanceRate('0%');
      }
    } catch (err) {
      console.error('Error fetching real DB teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Export entire Teacher Dashboard data to Excel (Google Sheets compatible)
  const handleExportDashboardExcel = () => {
    const exportRows = [];

    // Schedule rows
    schedule.forEach(s => {
      exportRows.push({
        Section: 'Teaching Schedule',
        Topic_Or_Class: s.name,
        Subject: s.subject,
        Students_Or_Room: `${s.students} Students | Room: ${s.room}`,
        Time_Or_DueDate: s.time,
        Status: 'Scheduled'
      });
    });

    // Assignments rows
    pendingGrading.forEach(a => {
      exportRows.push({
        Section: 'Coursework & Grading',
        Topic_Or_Class: a.title,
        Subject: a.class,
        Students_Or_Room: a.submissions,
        Time_Or_DueDate: a.dueDate,
        Status: 'Pending Review'
      });
    });

    if (exportRows.length === 0) {
      exportRows.push({
        Section: 'Overview',
        Topic_Or_Class: 'No active records found',
        Subject: 'N/A',
        Students_Or_Room: 'N/A',
        Time_Or_DueDate: 'N/A',
        Status: 'Empty'
      });
    }

    const success = exportToExcel(
      exportRows,
      `Teacher_Dashboard_${new Date().toISOString().split('T')[0]}`,
      'Teacher Overview'
    );

    if (success) {
      setToastMessage('Teacher dashboard data exported successfully!');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Launch Google Meet
  const handleStartGoogleMeet = () => {
    window.open('https://meet.google.com/new', '_blank', 'noopener,noreferrer');
  };

  return (
    <DashboardLayout>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Teacher Academic Portal</h1>
          <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>
            Welcome back, {teacherName}! Academic Department · Overview & Today's Schedule
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            type="button"
            title="Refresh records"
            onClick={fetchTeacherData}
            disabled={loading}
          >
            <RefreshCw size={15} className={loading ? 'spin-icon' : ''} /> {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            title="Download Excel spreadsheet compatible with Google Sheets"
            onClick={handleExportDashboardExcel}
          >
            <FileSpreadsheet size={15} /> Export to Sheets
          </button>
          <button
            className="btn btn-primary"
            type="button"
            title="Launch an instant Google Meet room"
            onClick={handleStartGoogleMeet}
          >
            <Video size={15} /> Launch GMeet
          </button>
        </div>
      </div>

      {toastMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#10b981',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Real DB Stats Grid ── */}
      <div className="stats-grid">
        <StatCard
          title="Active Classes"
          value={classesList.length > 0 ? `${classesList.length} Classes` : '0 Classes'}
          change={totalStudents > 0 ? `${totalStudents} Total Students Enrolled` : 'Sorry ! Not Available Data.'}
          positive={classesList.length > 0}
          badge={classesList.length > 0 ? `${classesList.length} Active` : 'No Data'}
          accent="sky"
          icon={BookOpen}
          delay={0}
        />

        <StatCard
          title="Weekly Periods"
          value={schedule.length > 0 ? `${schedule.length * 5} Periods` : '0 Periods'}
          change={schedule.length > 0 ? 'Assigned weekly timetable slots' : 'Sorry ! Not Available Data.'}
          positive={schedule.length > 0}
          badge={schedule.length > 0 ? `${schedule.length} Slots` : 'No Data'}
          accent="indigo"
          icon={Calendar}
          delay={0.08}
        />

        <StatCard
          title="Assignments"
          value={pendingGrading.length > 0 ? `${pendingGrading.length} Active` : '0 Active'}
          change={pendingGrading.length > 0 ? 'Coursework & student submissions' : 'Sorry ! Not Available Data.'}
          positive={pendingGrading.length > 0}
          badge={pendingGrading.length > 0 ? `${pendingGrading.length} Active` : 'No Data'}
          accent="amber"
          icon={ClipboardCheck}
          delay={0.16}
        />

        <StatCard
          title="Class Attendance"
          value={attendanceRate}
          change={attendanceRate !== '0%' ? 'Term attendance record' : 'Sorry ! Not Available Data.'}
          positive={attendanceRate !== '0%'}
          badge={attendanceRate !== '0%' ? 'Term Average' : 'No Data'}
          accent="emerald"
          icon={CheckSquare}
          delay={0.24}
        />
      </div>

      {/* ── Quick Actions ── */}
      <div className="dashboard-quick-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleStartGoogleMeet}
          style={{ background: 'linear-gradient(135deg, var(--primary, #0284c7) 0%, var(--primary-600, #0369a1) 100%)' }}
        >
          <Video size={16} /> Start Google Meet (GMeet)
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => window.open('https://calendar.google.com/', '_blank')}
        >
          <Calendar size={16} /> Google Calendar
        </button>
        <button className="btn btn-secondary" type="button" onClick={() => navigate('/online-classes')}>
          <BookOpen size={16} /> Online Classroom
        </button>
        <button className="btn btn-secondary" type="button" onClick={() => navigate('/attendance')}>
          <ClipboardCheck size={16} /> Mark Attendance
        </button>
      </div>

      {/* ── Teaching Schedule & Assignments Rows ── */}
      <div className="dashboard-row">
        {/* Schedule */}
        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Teaching Schedule</h2>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleStartGoogleMeet}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Video size={13} /> GMeet Room
            </button>
          </div>
          <div className="dashboard-list">
            {schedule.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Sorry ! Not Available Data.
                </p>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                  No timetable schedule entries found in the database.
                </span>
              </div>
            ) : (
              schedule.map((cls, idx) => (
                <div
                  key={idx}
                  className={`dashboard-list-item ${selectedClass === idx ? 'selected' : ''}`}
                  onClick={() => setSelectedClass(idx)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div>
                    <h3 className="item-title">{cls.name}</h3>
                    <div className="item-meta">
                      <span className="item-meta-item"><Users size={12} />{cls.students} Students</span>
                      <span className="item-meta-item">Location: {cls.room}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge info item-badge"><Clock size={12} />{cls.time}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      title="Start Google Meet for this period"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open('https://meet.google.com/new', '_blank');
                      }}
                      style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                    >
                      <Video size={12} /> Join
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assignments */}
        <div className="dashboard-card glass-card">
          <div className="dashboard-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Coursework & Grading</h2>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={() => navigate('/assignments')}
            >
              All Coursework →
            </button>
          </div>
          <div className="pending-list">
            {pendingGrading.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Sorry ! Not Available Data.
                </p>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginTop: '4px', display: 'block' }}>
                  No coursework assignments found in the database.
                </span>
              </div>
            ) : (
              pendingGrading.map((item, idx) => (
                <div key={idx} className="pending-item hover-lift">
                  <h4 className="pending-title">{item.title}</h4>
                  <p className="pending-meta">{item.class} • {item.submissions}</p>
                  <div className="pending-actions">
                    <span className="pending-due">Due: {item.dueDate}</span>
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={() => navigate('/assignments')}
                    >
                      Review & Grade <ArrowUpRight size={14} />
                    </button>
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
