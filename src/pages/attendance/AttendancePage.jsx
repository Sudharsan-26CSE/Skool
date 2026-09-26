import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar, CheckCircle2, XCircle, Clock, PieChart, Download, FileSpreadsheet } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getStudents, getStaff, getClasses, getAttendance, createAttendance, updateAttendance } from '../../services/api';
import { exportToExcel } from '../../utils/exportToExcel';

const AttendancePage = () => {
  const { showToast } = useToast();
  const [attendanceList, setAttendanceList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userType, setUserType] = useState('student');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('All');

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [userType, date, selectedClass]);

  const fetchClasses = async () => {
    try {
      const data = await getClasses();
      const list = data.classes || (Array.isArray(data) ? data : []);
      setClassesList(list);
    } catch (err) {
      console.error('Failed to load classes', err);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // 1. Fetch real existing attendance logs
      const attRes = await getAttendance().catch(() => ({ attendances: [] }));
      const allAtt = attRes.attendances || (Array.isArray(attRes) ? attRes : []);
      
      const targetDate = new Date(date).toISOString().split('T')[0];
      const dayLogs = allAtt.filter(a => {
        if (!a.date) return false;
        const d = new Date(a.date).toISOString().split('T')[0];
        return d === targetDate;
      });

      if (userType === 'student') {
        // Fetch real students from MongoDB
        const stuRes = await getStudents().catch(() => ({ students: [] }));
        const students = stuRes.students || (Array.isArray(stuRes) ? stuRes : []);
        
        let filtered = students;
        if (selectedClass && selectedClass !== 'All') {
          filtered = students.filter(s => {
            const cName = s.class?.name || s.grade;
            return cName === selectedClass;
          });
        }

        const items = filtered.map(s => {
          const log = dayLogs.find(l => (l.student?._id || l.student) === s._id);
          return {
            id: s.admissionNumber || s.rollNumber || s._id.slice(-6).toUpperCase(),
            mongoId: s._id,
            logId: log?._id || null,
            name: s.name,
            class: s.class?.name ? `${s.class.name} ${s.class.section || ''}` : (s.grade || 'General'),
            status: log?.status || 'present',
            time: log ? new Date(log.createdAt || log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:30 AM'
          };
        });
        setAttendanceList(items);
      } else {
        // Fetch real staff / teachers from MongoDB
        const roleFilter = userType === 'teacher' ? 'teacher' : 'staff';
        const stfRes = await getStaff(roleFilter).catch(() => ({ staff: [] }));
        const staff = stfRes.staff || (Array.isArray(stfRes) ? stfRes : []);

        const items = staff.map(st => {
          const log = dayLogs.find(l => (l.staff?._id || l.staff) === st._id);
          return {
            id: st.employeeId || st._id.slice(-6).toUpperCase(),
            mongoId: st._id,
            logId: log?._id || null,
            name: st.name,
            class: st.designation || st.department || userType,
            status: log?.status || 'present',
            time: log ? new Date(log.createdAt || log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:15 AM'
          };
        });
        setAttendanceList(items);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
      showToast('Failed to load attendance records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = (id, status) => {
    setAttendanceList(prev => prev.map(item => item.id === id ? {
      ...item,
      status,
      time: status === 'absent' ? '-' : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : item));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const savePromises = attendanceList.map(item => {
        if (item.logId) {
          return updateAttendance(item.logId, { status: item.status }).catch(() => null);
        } else {
          return createAttendance({
            student: item.mongoId,
            date: new Date(date),
            status: item.status,
            remarks: `Marked via Attendance Tracker on ${date}`
          }).catch(() => null);
        }
      });
      await Promise.all(savePromises);
      showToast('Attendance records saved successfully!', 'success');
      fetchAttendance();
    } catch (err) {
      showToast('Error saving attendance records.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Attendance Report - ${userType.toUpperCase()} - ${date}`, 14, 15);
    const tableColumn = ["ID", "Name", "Class / Dept", "Status", "Time"];
    const tableRows = [];

    attendanceList.forEach(att => {
      const rowData = [
        att.id,
        att.name,
        att.class,
        att.status,
        att.time
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save(`Attendance_${userType}_${date}.pdf`);
    showToast('PDF exported successfully!', 'success');
  };

  const exportExcel = () => {
    if (attendanceList.length === 0) {
      showToast('No attendance records to export.', 'warning');
      return;
    }
    const rows = attendanceList.map(a => ({
      ID: a.rollNo || a.employeeId || '',
      FullName: a.name || '',
      Type: userType.toUpperCase(),
      Date: date,
      Class: a.className || selectedClass || 'N/A',
      Status: a.status ? a.status.toUpperCase() : 'PRESENT',
      Remarks: a.remarks || ''
    }));

    exportToExcel(rows, `Attendance_Report_${userType}_${date}`, 'Attendance');
    showToast('Attendance report exported to Excel (Google Sheets format)!', 'success');
  };

  // Calculate percentages
  const total = attendanceList.length;
  const present = attendanceList.filter(a => a.status === 'present' || a.status === 'late').length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Attendance Tracker</h1>
          <p className="page-subtitle">Track and record attendance for students and staff</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary" onClick={exportExcel} title="Download Excel sheet for Google Sheets">
            <FileSpreadsheet size={16} /> Export to Excel
          </button>
          <button className="btn btn-outline" onClick={exportPDF}>
            <Download size={16} /> PDF
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save Attendance'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <select className="form-input" style={{ width: '200px' }} value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="student">Students</option>
          {isAdmin && <option value="teacher">Teachers</option>}
          {isAdmin && <option value="staff">Staff</option>}
        </select>
        
        {userType === 'student' && (
          <select className="form-input" style={{ width: '200px' }} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="All">All Classes</option>
            {classesList.map(c => (
              <option key={c._id} value={c.name}>{c.name} {c.section || ''}</option>
            ))}
          </select>
        )}
        
        <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '200px' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <PieChart size={18} style={{ marginRight: '8px', color: 'var(--primary)' }} />
          <strong>Attendance Rate: {percentage}%</strong>
        </div>
      </div>

      <div className="data-table-container glass-card hover-lift">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading attendance records...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>{userType === 'student' ? 'Class' : 'Designation / Role'}</th>
                <th>Check-in Time</th>
                <th>Status</th>
                <th>Quick Mark</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sorry ! Not Available Data.</td></tr>
              ) : attendanceList.map((att) => (
                <tr key={att.id}>
                  <td><strong>{att.id}</strong></td>
                  <td><strong>{att.name}</strong></td>
                  <td>{att.class}</td>
                  <td>{att.time}</td>
                  <td>
                    <span className={`badge ${att.status === 'present' ? 'success' : att.status === 'late' ? 'warning' : 'error'}`} style={{ textTransform: 'capitalize' }}>
                      {att.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button className={`btn btn-sm ${att.status === 'present' ? 'btn-primary' : 'btn-ghost'}`} style={{ color: att.status === 'present' ? 'white' : 'var(--success)' }} onClick={() => markAttendance(att.id, 'present')}>P</button>
                      <button className={`btn btn-sm ${att.status === 'late' ? 'btn-warning' : 'btn-ghost'}`} style={{ color: att.status === 'late' ? 'white' : 'var(--warning)' }} onClick={() => markAttendance(att.id, 'late')}>L</button>
                      <button className={`btn btn-sm ${att.status === 'absent' ? 'btn-danger' : 'btn-ghost'}`} style={{ color: att.status === 'absent' ? 'white' : 'var(--error)' }} onClick={() => markAttendance(att.id, 'absent')}>A</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;
