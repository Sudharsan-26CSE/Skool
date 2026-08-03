import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarPage = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dateNumbers = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">School Calendar</h1>
          <p className="page-subtitle">Academic events, holidays, and examination schedules</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add Calendar Event
        </button>
      </div>

      <div className="calendar-widget">
        <div className="calendar-header">
          <h2>May 2024</h2>
          <div className="calendar-nav">
            <button className="btn btn-secondary btn-sm"><ChevronLeft size={16} /></button>
            <button className="btn btn-secondary btn-sm">Today</button>
            <button className="btn btn-secondary btn-sm"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="calendar-grid">
          {days.map(d => <div key={d} className="calendar-day-label">{d}</div>)}
          {dateNumbers.map(n => (
            <div key={n} className={`calendar-day ${n === 12 ? 'today' : ''}`}>
              {n}
              {n === 15 && <div style={{ fontSize: '10px', background: 'var(--primary-100)', color: 'var(--primary)', borderRadius: '2px', marginTop: '2px' }}>Sports Day</div>}
              {n === 18 && <div style={{ fontSize: '10px', background: 'var(--warning-light)', color: 'var(--warning)', borderRadius: '2px', marginTop: '2px' }}>Exams</div>}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
