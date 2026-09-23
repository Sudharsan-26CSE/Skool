import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react';
import { getNotices } from '../../services/api';

const CalendarPage = () => {
  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isStudent = role === 'student';
  const [events, setEvents] = useState({});
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + monthOffset);

  const year = currentDate.getFullYear();
  const monthIdx = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstDayOfWeek = new Date(year, monthIdx, 1).getDay();
  const totalDays = new Date(year, monthIdx + 1, 0).getDate();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getNotices();
      const list = res.notices || (Array.isArray(res) ? res : []);
      const mapped = {};

      list.forEach((n) => {
        const d = new Date(n.date || n.createdAt || Date.now());
        const key = `${d.toLocaleString('default', { month: 'long', year: 'numeric' })}-${d.getDate()}`;
        mapped[key] = {
          title: n.title,
          type: n.priority === 'urgent' ? 'exam' : n.targetAudience === 'staff' ? 'meeting' : 'event',
          location: n.targetAudience ? `Target: ${n.targetAudience}` : 'Campus Hall',
          content: n.content
        };
      });

      setEvents(mapped);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const calendarDays = [
    ...Array.from({ length: firstDayOfWeek }, (_, index) => ({ day: null, key: `empty-${index}` })),
    ...Array.from({ length: totalDays }, (_, index) => ({ day: index + 1, key: `${monthName}-${index + 1}` })),
  ];

  const selectedEvent = events[`${monthName}-${selectedDay}`];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">School Calendar</h1>
          <p className="page-subtitle">Academic events, circulars, and schedules from database</p>
        </div>
      </div>

      <div className="calendar-layout">
        <section className="calendar-widget">
          <div className="calendar-header">
            <div className="calendar-title">
              <div className="calendar-title-icon"><CalendarIcon size={18} /></div>
              <div><span>Academic calendar</span><h2>{monthName}</h2></div>
            </div>
            <div className="calendar-nav">
              <button className="btn btn-secondary btn-sm" type="button" aria-label="Previous month" onClick={() => { setMonthOffset(m => m - 1); setSelectedDay(null); }}>
                <ChevronLeft size={16} />
              </button>
              <button className="btn btn-secondary btn-sm" type="button" onClick={() => { setMonthOffset(0); setSelectedDay(new Date().getDate()); }}>
                Today
              </button>
              <button className="btn btn-secondary btn-sm" type="button" aria-label="Next month" onClick={() => { setMonthOffset(m => m + 1); setSelectedDay(null); }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="calendar-grid">
            {days.map(d => <div key={d} className="calendar-day-label">{d}</div>)}
            {calendarDays.map(({ day, key }) => {
              const event = day ? events[`${monthName}-${day}`] : null;
              const isToday = monthOffset === 0 && day === new Date().getDate();
              return (
                <button
                  key={key}
                  type="button"
                  disabled={!day}
                  onClick={() => setSelectedDay(day)}
                  className={`calendar-day ${day === selectedDay ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                >
                  {day && (
                    <>
                      <span className="day-number">{day}</span>
                      {event && <span className={`calendar-event-dot ${event.type}`} title={event.title}>{event.title}</span>}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <aside className="calendar-agenda">
          <div className="agenda-heading">
            <div>
              <span>Selected day</span>
              <h2>{selectedDay ? `${monthName.split(' ')[0]} ${selectedDay}` : 'Choose a date'}</h2>
            </div>
            <CalendarIcon size={20} />
          </div>
          {selectedEvent ? (
            <div className={`agenda-event ${selectedEvent.type}`}>
              <span className="agenda-event-type">{selectedEvent.type}</span>
              <h3>{selectedEvent.title}</h3>
              <p><MapPin size={14} /> {selectedEvent.location}</p>
              {selectedEvent.content && <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.9 }}>{selectedEvent.content}</p>}
            </div>
          ) : (
            <div className="agenda-empty">No scheduled circular or event for this day in database.</div>
          )}
          <div className="agenda-legend">
            <span><i className="event-dot event"></i>Events</span>
            <span><i className="event-dot exam"></i>Urgent / Exams</span>
            <span><i className="event-dot meeting"></i>Meetings</span>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
