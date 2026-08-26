import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar, Clock, Filter } from 'lucide-react';

const TimetablePage = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const schedule = [
    { time: '08:30 AM - 09:30 AM', mon: 'Mathematics', tue: 'Physics', wed: 'English', thu: 'Chemistry', fri: 'Computer Sci' },
    { time: '09:30 AM - 10:30 AM', mon: 'Physics', tue: 'Mathematics', wed: 'Computer Sci', thu: 'English', fri: 'Chemistry' },
    { time: '10:30 AM - 11:00 AM', mon: 'Break', tue: 'Break', wed: 'Break', thu: 'Break', fri: 'Break' },
    { time: '11:00 AM - 12:00 PM', mon: 'English', tue: 'Computer Sci', wed: 'Mathematics', thu: 'Physics', fri: 'Sports' },
    { time: '12:00 PM - 01:00 PM', mon: 'Chemistry', tue: 'History', wed: 'Physics', thu: 'Mathematics', fri: 'Library' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Class Timetable</h1>
          <p className="page-subtitle">Weekly schedule for Grade 10-A</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <select style={{ padding: '8px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <option>Grade 10-A</option>
            <option>Grade 9-B</option>
            <option>Grade 11-A</option>
          </select>
          <button className="btn btn-secondary">Print Schedule</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Time Slot</th>
              {days.map(d => <th key={d}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, idx) => (
              <tr key={idx} style={{ background: row.mon === 'Break' ? 'var(--gray-50)' : 'transparent' }}>
                <td><strong>{row.time}</strong></td>
                <td>{row.mon === 'Break' ? <em>Recess</em> : <span className="badge info">{row.mon}</span>}</td>
                <td>{row.tue === 'Break' ? <em>Recess</em> : <span className="badge info">{row.tue}</span>}</td>
                <td>{row.wed === 'Break' ? <em>Recess</em> : <span className="badge info">{row.wed}</span>}</td>
                <td>{row.thu === 'Break' ? <em>Recess</em> : <span className="badge info">{row.thu}</span>}</td>
                <td>{row.fri === 'Break' ? <em>Recess</em> : <span className="badge info">{row.fri}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default TimetablePage;
