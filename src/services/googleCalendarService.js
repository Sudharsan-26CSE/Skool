/**
 * Google Calendar API & Web Integration Service for Skool ERP
 * Supports direct web creation URLs, event syncing, and iCal / ICS exports.
 */

/**
 * Format a Date object into Google Calendar date format (YYYYMMDDTHHmmssZ)
 */
export const formatGoogleCalendarDate = (date) => {
  const d = new Date(date);
  return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
};

/**
 * Generate a direct Google Calendar Web API creation URL
 */
export const generateGoogleCalendarUrl = ({
  title = 'Skool Academic Event',
  description = '',
  location = 'School Campus',
  startDate = new Date(),
  endDate = null,
  allDay = false
}) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(start.getTime() + 60 * 60 * 1000); // 1 hour default

  let datesParam;
  if (allDay) {
    const pad = (n) => String(n).padStart(2, '0');
    const startStr = `${start.getFullYear()}${pad(start.getMonth() + 1)}${pad(start.getDate())}`;
    const nextDay = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    const endStr = `${nextDay.getFullYear()}${pad(nextDay.getMonth() + 1)}${pad(nextDay.getDate())}`;
    datesParam = `${startStr}/${endStr}`;
  } else {
    datesParam = `${formatGoogleCalendarDate(start)}/${formatGoogleCalendarDate(end)}`;
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: datesParam,
    details: `${description}\n\nSynced from Skool ERP`,
    location: location,
    add: ''
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Open Google Calendar in a new browser tab
 */
export const openGoogleCalendar = (date = null) => {
  if (date) {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    window.open(`https://calendar.google.com/calendar/u/0/r/day/${y}/${m}/${day}`, '_blank', 'noopener,noreferrer');
  } else {
    window.open('https://calendar.google.com/calendar/', '_blank', 'noopener,noreferrer');
  }
};

/**
 * Export an event as an .ics (iCalendar) file compatible with Google Calendar and Apple/Outlook
 */
export const exportEventToIcs = (event) => {
  const start = event.startDate ? new Date(event.startDate) : new Date();
  const end = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 60 * 60 * 1000);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Skool ERP//Academic Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).substring(2, 9)}@skool.edu`,
    `DTSTAMP:${formatGoogleCalendarDate(new Date())}`,
    `DTSTART:${formatGoogleCalendarDate(start)}`,
    `DTEND:${formatGoogleCalendarDate(end)}`,
    `SUMMARY:${event.title || 'Skool Academic Event'}`,
    `DESCRIPTION:${(event.description || event.content || 'Skool Event').replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location || 'School Campus'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(event.title || 'event').toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
