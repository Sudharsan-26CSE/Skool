import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react';

const CalendarPage = () => {
  const months = [
    { label: 'May 2024', days: 31, startsOn: 3 },
    { label: 'June 2024', days: 30, startsOn: 6 },
    { label: 'July 2024', days: 31, startsOn: 1 },
  ];
  const events = {
    'May 2024-15': { title: 'Sports Day', type: 'event', location: 'Main field' },
    'May 2024-18': { title: 'Mid-term exams', type: 'exam', location: 'Exam hall' },
    'June 2024-11': { title: 'Science Fair', type: 'event', location: 'Innovation lab' },
    'June 2024-20': { title: 'Staff Meeting', type: 'meeting', location: 'Conference room' },
    'June 2024-28': { title: 'Sports Day', type: 'event', location: 'Main field' },
    'July 2024-8': { title: 'New term begins', type: 'academic', location: 'All classrooms' },
  };
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [monthIndex, setMonthIndex] = useState(1);
  const [selectedDay, setSelectedDay] = useState(20);
  const month = months[monthIndex];
  const calendarDays = [
    ...Array.from({ length: month.startsOn }, (_, index) => ({ day: null, key: `empty-${index}` })),
    ...Array.from({ length: month.days }, (_, index) => ({ day: index + 1, key: `${month.label}-${index + 1}` })),
  ];
  const selectedEvent = events[`${month.label}-${selectedDay}`];

  const changeMonth = (offset) => {
    setMonthIndex((current) => Math.min(Math.max(current + offset, 0), months.length - 1));
    setSelectedDay(null);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">School Calendar</h1>
          <p className="page-subtitle">Academic events, holidays, and examination schedules</p>
        </div>
        <button className="btn btn-primary" type="button">
          <Plus size={16} /> Add Calendar Event
        </button>
      </div>

      <div className="calendar-layout">
        <section className="calendar-widget">
        <div className="calendar-header">
          <div className="calendar-title">
            <div className="calendar-title-icon"><CalendarIcon size={18} /></div>
            <div><span>Academic calendar</span><h2>{month.label}</h2></div>
          </div>
          <div className="calendar-nav">
            <button className="btn btn-secondary btn-sm" type="button" aria-label="Previous month" onClick={() => changeMonth(-1)} disabled={monthIndex === 0}><ChevronLeft size={16} /></button>
            <button className="btn btn-secondary btn-sm" type="button" onClick={() => { setMonthIndex(1); setSelectedDay(20); }}>Today</button>
            <button className="btn btn-secondary btn-sm" type="button" aria-label="Next month" onClick={() => changeMonth(1)} disabled={monthIndex === months.length - 1}><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="calendar-grid">
          {days.map(d => <div key={d} className="calendar-day-label">{d}</div>)}
          {calendarDays.map(({ day, key }) => {
            const event = day ? events[`${month.label}-${day}`] : null;
            return (
            <button key={key} type="button" disabled={!day} onClick={() => setSelectedDay(day)} className={`calendar-day ${day === selectedDay ? 'selected' : ''} ${day === 12 && monthIndex === 0 ? 'today' : ''}`}>
              {day && <><span className="day-number">{day}</span>{event && <span className={`calendar-event-dot ${event.type}`} title={event.title}>{event.title}</span>}</>}
            </button>
            );
          })}
        </div>
        </section>

        <aside className="calendar-agenda">
          <div className="agenda-heading"><div><span>Selected day</span><h2>{selectedDay ? `${month.label.split(' ')[0]} ${selectedDay}` : 'Choose a date'}</h2></div><CalendarIcon size={20} /></div>
          {selectedEvent ? (
            <div className={`agenda-event ${selectedEvent.type}`}>
              <span className="agenda-event-type">{selectedEvent.type}</span>
              <h3>{selectedEvent.title}</h3>
              <p><MapPin size={14} /> {selectedEvent.location}</p>
            </div>
          ) : <div className="agenda-empty">No events scheduled for this day.</div>}
          <div className="agenda-legend"><span><i className="event-dot event"></i>Events</span><span><i className="event-dot exam"></i>Exams</span><span><i className="event-dot meeting"></i>Meetings</span></div>
        </aside>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
