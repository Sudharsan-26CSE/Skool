import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

const AttendancePage = () => {
  const attendanceList = [
    { id: 'STU-1001', name: 'Janet Adebayo', class: '10-A', status: 'Present', time: '08:15 AM' },
    { id: 'STU-1002', name: 'Marcus Chen', class: '10-A', status: 'Present', time: '08:20 AM' },
    { id: 'STU-1003', name: 'Sophia Smith', class: '10-A', status: 'Late', time: '08:45 AM' },
    { id: 'STU-1004', name: 'Lucas Williams', class: '10-A', status: 'Absent', time: '-' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Daily Attendance Tracker</h1>
          <p className="page-subtitle">Grade 10-A Attendance for Today (May 12, 2024)</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <input type="date" className="form-input" defaultValue="2024-05-12" style={{ width: 'auto' }} />
          <button className="btn btn-primary">Save Attendance</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Class</th>
              <th>Check-in Time</th>
              <th>Status</th>
              <th>Quick Mark</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.map((att) => (
              <tr key={att.id}>
                <td><strong>{att.id}</strong></td>
                <td><strong>{att.name}</strong></td>
                <td>{att.class}</td>
                <td>{att.time}</td>
                <td>
                  <span className={`badge ${att.status === 'Present' ? 'success' : att.status === 'Late' ? 'warning' : 'error'}`}>
                    {att.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--success)' }}>P</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--warning)' }}>L</button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }}>A</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;
