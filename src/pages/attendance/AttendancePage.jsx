import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar, CheckCircle2, XCircle, Clock, PieChart, Download } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AttendancePage = () => {
  const { showToast } = useToast();
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('student');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [className, setClassName] = useState('Grade 10-A'); // For students

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';

  useEffect(() => {
    fetchAttendance();
  }, [userType, date, className]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // Dummy fetch implementation - in a real app, use `getAttendance(userType, date, className)`
      // We will simulate DB data
      setTimeout(() => {
        let dummy = [];
        if (userType === 'student') {
          dummy = [
            { id: 'STU-1001', name: 'Janet Adebayo', class: 'Grade 10-A', status: 'present', time: '08:15 AM' },
            { id: 'STU-1002', name: 'Marcus Chen', class: 'Grade 10-A', status: 'present', time: '08:20 AM' },
            { id: 'STU-1003', name: 'Sophia Smith', class: 'Grade 10-A', status: 'late', time: '08:45 AM' },
            { id: 'STU-1004', name: 'Lucas Williams', class: 'Grade 10-A', status: 'absent', time: '-' },
          ];
        } else if (userType === 'teacher' && isAdmin) {
          dummy = [
            { id: 'TCH-201', name: 'Dr. Sarah Connor', status: 'present', time: '07:50 AM' },
            { id: 'TCH-202', name: 'Prof. Albert Vance', status: 'absent', time: '-' },
          ];
        } else if (userType === 'staff' && isAdmin) {
          dummy = [
            { id: 'STF-301', name: 'Robert Vance', status: 'present', time: '08:00 AM' },
          ];
        }
        setAttendanceList(dummy);
        setLoading(false);
      }, 500);
    } catch (err) {
      showToast('Failed to load attendance.', 'error');
      setLoading(false);
    }
  };

  const markAttendance = (id, status) => {
    setAttendanceList(prev => prev.map(item => item.id === id ? { ...item, status, time: status === 'absent' ? '-' : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) } : item));
  };

  const handleSave = () => {
    // In a real app, send attendanceList to the backend
    showToast('Attendance saved successfully!', 'success');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Attendance Report - ${userType.toUpperCase()} - ${date}`, 14, 15);
    const tableColumn = ["ID", "Name", "Status", "Time"];
    const tableRows = [];

    attendanceList.forEach(att => {
      const rowData = [
        att.id,
        att.name,
        att.status,
        att.time
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save(`Attendance_${userType}_${date}.pdf`);
    showToast('PDF exported successfully!', 'success');
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
          <p className="page-subtitle">Manage attendance records</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn btn-secondary" onClick={exportPDF}>
            <Download size={16} /> Export PDF
          </button>
          <button className="btn btn-primary" onClick={handleSave}>Save Attendance</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        <select className="form-input" style={{ width: '200px' }} value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="student">Students</option>
          {isAdmin && <option value="teacher">Teachers</option>}
          {isAdmin && <option value="staff">Staff</option>}
        </select>
        
        {userType === 'student' && (
          <select className="form-input" style={{ width: '200px' }} value={className} onChange={(e) => setClassName(e.target.value)}>
            <option value="Grade 9-A">Grade 9-A</option>
            <option value="Grade 10-A">Grade 10-A</option>
            <option value="Grade 11-A">Grade 11-A</option>
          </select>
        )}
        
        <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '200px' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', background: 'white', padding: '0 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
          <PieChart size={18} style={{ marginRight: '8px', color: 'var(--primary)' }} />
          <strong>Attendance Rate: {percentage}%</strong>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                {userType === 'student' && <th>Class</th>}
                <th>Check-in Time</th>
                <th>Status</th>
                <th>Quick Mark</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center' }}>No records found for this selection</td></tr>
              ) : attendanceList.map((att) => (
                <tr key={att.id}>
                  <td><strong>{att.id}</strong></td>
                  <td><strong>{att.name}</strong></td>
                  {userType === 'student' && <td>{att.class}</td>}
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
