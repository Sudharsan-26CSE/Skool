import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar, Clock, Filter, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../components/common/ToastContext';
import { getTimetables, deleteTimetable } from '../../services/api';

const TimetablePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isAdmin = role === 'admin';

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const data = await getTimetables();
      setScheduleData(data.timetables || []);
    } catch (err) {
      showToast('Failed to load timetable. Using offline mode.', 'warning');
      setScheduleData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;
    try {
      await deleteTimetable(id);
      showToast('Slot deleted successfully', 'success');
      fetchTimetable();
    } catch (err) {
      showToast(err.message || 'Failed to delete slot', 'error');
    }
  };

  // Group by time slots to build rows
  const slots = {};
  scheduleData.forEach(entry => {
    const timeKey = `${entry.startTime} - ${entry.endTime}`;
    if (!slots[timeKey]) {
      slots[timeKey] = { time: timeKey, mon: null, tue: null, wed: null, thu: null, fri: null };
    }
    const dayPrefix = entry.day.toLowerCase().substring(0, 3); // mon, tue, wed...
    slots[timeKey][dayPrefix] = entry;
  });
  const rowData = Object.values(slots).sort((a, b) => a.time.localeCompare(b.time));



  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Class Timetable</h1>
          <p className="page-subtitle">Weekly schedule for Grade 10-A</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <select style={{ padding: '8px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <option>Grade 10</option>
            <option>Grade 9</option>
            <option>Grade 11</option>
          </select>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => navigate('/timetable/add')}>
              <Plus size={16} /> Add Slot
            </button>
          )}
          <button className="btn btn-secondary">Print</button>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading timetable...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Time Slot</th>
                {days.map(d => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {rowData.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sorry ! Not Available Data.</td></tr>
              ) : rowData.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.time}</strong></td>
                  {['mon', 'tue', 'wed', 'thu', 'fri'].map(d => (
                    <td key={d}>
                      {row[d] ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className="badge info">{row[d].subject?.name || 'Scheduled'}</span>
                          {isAdmin && (
                            <button className="icon-btn danger" style={{ padding: 2 }} onClick={() => handleDelete(row[d]._id)}>
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      ) : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TimetablePage;
