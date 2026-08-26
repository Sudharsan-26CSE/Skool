import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarPage = () => {
  // Dummy data for a calendar view
  const monthName = "June 2024";
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Simple representation of days in a month grid
  const calendarDays = [
    { day: 26, isCurrentMonth: false }, { day: 27, isCurrentMonth: false }, { day: 28, isCurrentMonth: false }, { day: 29, isCurrentMonth: false }, { day: 30, isCurrentMonth: false }, { day: 31, isCurrentMonth: false }, { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true }, { day: 3, isCurrentMonth: true }, { day: 4, isCurrentMonth: true }, { day: 5, isCurrentMonth: true }, { day: 6, isCurrentMonth: true }, { day: 7, isCurrentMonth: true }, { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true }, { day: 10, isCurrentMonth: true }, { day: 11, isCurrentMonth: true, event: { title: 'Science Fair', color: 'blue' } }, { day: 12, isCurrentMonth: true }, { day: 13, isCurrentMonth: true }, { day: 14, isCurrentMonth: true }, { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true }, { day: 17, isCurrentMonth: true }, { day: 18, isCurrentMonth: true }, { day: 19, isCurrentMonth: true }, { day: 20, isCurrentMonth: true, event: { title: 'Staff Meeting', color: 'green' } }, { day: 21, isCurrentMonth: true }, { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true }, { day: 24, isCurrentMonth: true }, { day: 25, isCurrentMonth: true }, { day: 26, isCurrentMonth: true }, { day: 27, isCurrentMonth: true }, { day: 28, isCurrentMonth: true, event: { title: 'Sports Day', color: 'orange' } }, { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true }, { day: 1, isCurrentMonth: false }, { day: 2, isCurrentMonth: false }, { day: 3, isCurrentMonth: false }, { day: 4, isCurrentMonth: false }, { day: 5, isCurrentMonth: false }, { day: 6, isCurrentMonth: false },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">School Calendar</h1>
          <p className="page-subtitle">View and manage school events and holidays</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add New Event
        </button>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <button className="btn btn-ghost btn-sm"><ChevronLeft size={18} /></button>
          <h2>{monthName}</h2>
          <button className="btn btn-ghost btn-sm"><ChevronRight size={18} /></button>
        </div>
        <div className="calendar-grid">
          {daysOfWeek.map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
          {calendarDays.map((dayInfo, index) => (
            <div key={index} className={`calendar-day ${!dayInfo.isCurrentMonth ? 'not-current-month' : ''}`}>
              <span className="day-number">{dayInfo.day}</span>
              {dayInfo.event && (
                <div className={`calendar-event ${dayInfo.event.color}`}>{dayInfo.event.title}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;