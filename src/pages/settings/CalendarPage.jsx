import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  ExternalLink,
  Download,
  Share2,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';
import { getNotices } from '../../services/api';
import {
  generateGoogleCalendarUrl,
  openGoogleCalendar,
  exportEventToIcs
} from '../../services/googleCalendarService';

const CalendarPage = () => {
  const role = (localStorage.getItem('preskool-role') || 'admin').toLowerCase();
  const isStudent = role === 'student';
  const [events, setEvents] = useState({});
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // New Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'event',
    time: '10:00 AM',
    location: 'Campus Auditorium',
    content: ''
  });

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

  const showNotification = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

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
          content: n.content,
          rawDate: d
        };
      });

      // Default sample educational events if empty
      if (Object.keys(mapped).length === 0) {
        const curMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        mapped[`${curMonth}-5`] = {
          title: 'Science Fair & Tech Expo',
          type: 'event',
          location: 'Innovation Hall',
          content: 'Annual student science and robotics project exhibition.',
          rawDate: new Date(year, monthIdx, 5, 9, 30)
        };
        mapped[`${curMonth}-15`] = {
          title: 'Mid-Term Examinations',
          type: 'exam',
          location: 'Main Exam Halls',
          content: 'Official mid-semester examinations for secondary classes.',
          rawDate: new Date(year, monthIdx, 15, 10, 0)
        };
        mapped[`${curMonth}-22`] = {
          title: 'Staff Academic Council Meeting',
          type: 'meeting',
          location: 'Conference Room B',
          content: 'Quarterly review of curriculum pacing and syllabus coverage.',
          rawDate: new Date(year, monthIdx, 22, 14, 0)
        };
      }

      setEvents(mapped);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const calendarDays = [
    ...Array.from({ length: firstDayOfWeek }, (_, index) => ({ day: null, key: `empty-${index}` })),
    ...Array.from({ length: totalDays }, (_, index) => ({ day: index + 1, key: `${monthName}-${index + 1}` })),
  ];

  const selectedEventKey = `${monthName}-${selectedDay}`;
  const selectedEvent = events[selectedEventKey];

  // Helper to open selected event in Google Calendar API
  const handleAddToGoogleCalendar = (ev) => {
    if (!ev && !selectedDay) return;
    const targetDate = ev?.rawDate || new Date(year, monthIdx, selectedDay, 10, 0);
    const url = generateGoogleCalendarUrl({
      title: ev?.title || `School Schedule - ${monthName.split(' ')[0]} ${selectedDay}`,
      description: ev?.content || 'Academic schedule and session.',
      location: ev?.location || 'School Campus',
      startDate: targetDate,
      allDay: !ev
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Helper to save new custom event
  const handleCreateNewEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    const eventDate = new Date(year, monthIdx, selectedDay || new Date().getDate(), 10, 0);
    const key = `${monthName}-${selectedDay || new Date().getDate()}`;

    setEvents(prev => ({
      ...prev,
      [key]: {
        title: newEvent.title,
        type: newEvent.type,
        location: newEvent.location,
        content: newEvent.content,
        rawDate: eventDate
      }
    }));

    setShowAddModal(false);
    showNotification('Event added to school calendar!');

    // Prompt to also sync to Google Calendar
    const googleUrl = generateGoogleCalendarUrl({
      title: newEvent.title,
      description: newEvent.content,
      location: newEvent.location,
      startDate: eventDate,
      allDay: false
    });
    window.open(googleUrl, '_blank', 'noopener,noreferrer');

    setNewEvent({
      title: '',
      type: 'event',
      time: '10:00 AM',
      location: 'Campus Auditorium',
      content: ''
    });
  };

  return (
    <DashboardLayout>
      <div className="page-header glass-header-section">
        <div>
          <div className="badge glass-badge info" style={{ marginBottom: '6px' }}>
            <CalendarIcon size={12} style={{ marginRight: '4px' }} /> Academic Calendar & Google Sync
          </div>
          <h1 className="page-title text-shimmer-anim">School Calendar</h1>
          <p className="page-subtitle">Academic events, circulars, and official schedules</p>
        </div>

        {/* Google Calendar Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className="btn btn-secondary glass-btn"
            type="button"
            title="Open Google Calendar in a new tab"
            onClick={() => openGoogleCalendar()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ExternalLink size={15} /> Google Calendar
          </button>
          {!isStudent && (
            <button
              className="btn btn-primary glass-btn-primary"
              type="button"
              onClick={() => setShowAddModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Add Event
            </button>
          )}
        </div>
      </div>

      {toastMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.14)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#10b981',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Google Calendar Integration Highlight Banner */}
      <div
        className="glass-card hover-lift"
        style={{
          padding: '14px 20px',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          borderLeft: '4px solid #38bdf8'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CalendarIcon size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>Google Calendar Linked</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Click any scheduled event to instantly push to Google Calendar or export an .ics file.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-outline btn-sm glass-btn"
            type="button"
            onClick={() => handleAddToGoogleCalendar(selectedEvent)}
            title="Push selected event to Google Calendar"
          >
            <Sparkles size={14} /> Link to Google Calendar
          </button>
          <button
            className="btn btn-secondary btn-sm glass-btn"
            type="button"
            onClick={() => {
              if (selectedEvent) exportEventToIcs(selectedEvent);
              else showNotification('Select an event first to export .ics');
            }}
            title="Download .ics file compatible with Google and Apple Calendar"
          >
            <Download size={14} /> Export .ics
          </button>
        </div>
      </div>

      <div className="calendar-layout">
        <section className="calendar-widget glass-card hover-lift">
          <div className="calendar-header">
            <div className="calendar-title">
              <div className="calendar-title-icon"><CalendarIcon size={18} /></div>
              <div><span>Academic Term</span><h2>{monthName}</h2></div>
            </div>
            <div className="calendar-nav">
              <button className="btn btn-secondary btn-sm glass-btn" type="button" aria-label="Previous month" onClick={() => { setMonthOffset(m => m - 1); setSelectedDay(null); }}>
                <ChevronLeft size={16} />
              </button>
              <button className="btn btn-secondary btn-sm glass-btn" type="button" onClick={() => { setMonthOffset(0); setSelectedDay(new Date().getDate()); }}>
                Today
              </button>
              <button className="btn btn-secondary btn-sm glass-btn" type="button" aria-label="Next month" onClick={() => { setMonthOffset(m => m + 1); setSelectedDay(null); }}>
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

        <aside className="calendar-agenda glass-card hover-lift">
          <div className="agenda-heading">
            <div>
              <span>Selected Day Agenda</span>
              <h2>{selectedDay ? `${monthName.split(' ')[0]} ${selectedDay}` : 'Choose a date'}</h2>
            </div>
            <CalendarIcon size={20} />
          </div>

          {selectedEvent ? (
            <div className={`agenda-event ${selectedEvent.type} glass-card`} style={{ padding: '16px', borderRadius: '12px' }}>
              <span className="agenda-event-type">{selectedEvent.type.toUpperCase()}</span>
              <h3 style={{ margin: '8px 0 4px 0' }}>{selectedEvent.title}</h3>
              <p style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                <MapPin size={14} /> {selectedEvent.location}
              </p>
              {selectedEvent.content && (
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.9 }}>
                  {selectedEvent.content}
                </p>
              )}

              {/* Direct Google Calendar Link Button */}
              <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-primary glass-btn-primary"
                  onClick={() => handleAddToGoogleCalendar(selectedEvent)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <ExternalLink size={13} /> Add to Google Calendar
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline glass-btn"
                  onClick={() => exportEventToIcs(selectedEvent)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <Download size={13} /> .ics
                </button>
              </div>
            </div>
          ) : (
            <div className="agenda-empty" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <p>No scheduled events for this date.</p>
              {selectedDay && (
                <button
                  className="btn btn-sm btn-outline glass-btn"
                  type="button"
                  onClick={() => handleAddToGoogleCalendar(null)}
                  style={{ marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                >
                  <Plus size={13} /> Schedule in Google Calendar
                </button>
              )}
            </div>
          )}

          <div className="agenda-legend" style={{ marginTop: '20px' }}>
            <span><i className="event-dot event"></i>Academic Events</span>
            <span><i className="event-dot exam"></i>Urgent / Exams</span>
            <span><i className="event-dot meeting"></i>Meetings</span>
          </div>
        </aside>
      </div>

      {/* Add New Event Modal with instant Google Calendar API Sync */}
      {showAddModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="modal-content glass-card" style={{
            maxWidth: '480px',
            width: '100%',
            borderRadius: '16px',
            padding: '24px',
            background: 'var(--bg-primary)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Schedule School Event</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateNewEvent}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Event Title</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  placeholder="e.g. Science Exhibition, Sports Meet"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Event Category</label>
                  <select
                    className="form-control glass-select"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  >
                    <option value="event">School Event</option>
                    <option value="exam">Examination</option>
                    <option value="meeting">Staff Meeting</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Event Time</label>
                  <input
                    type="text"
                    className="form-control glass-input"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label">Campus Location</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label className="form-label">Description / Details</label>
                <textarea
                  className="form-control glass-input"
                  rows="3"
                  placeholder="Notes, agenda, or student instructions..."
                  value={newEvent.content}
                  onChange={(e) => setNewEvent({ ...newEvent, content: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn btn-secondary glass-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary glass-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarIcon size={16} /> Save & Sync to Google Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CalendarPage;
