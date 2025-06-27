import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import CalendarTile from '../components/CalendarTile';
import '../styles/Calendar.css';

// Get 21 consecutive days starting today
function getCalendarDays() {
  const today = new Date();
  const dayOfWeek = (today.getDay() + 6) % 7; // 0=Monday, 6=Sunday
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek);
  const days = [];
  for (let i = 0; i < 21; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // <-- Add this
  const days = getCalendarDays();

  useEffect(() => {
    // Fetch all events in the next 21 days
    supabase
      .from('events')
      .select('*')
      .gte('starts_at', days[0])
      .lte('starts_at', days[days.length - 1] + 'T23:59:59')
      .then(({ data }) => setEvents(data || []));
  }, []);

  // Map events by date for quick lookup
  const eventsByDate = {};
  events.forEach(ev => {
    const date = ev.starts_at.slice(0, 10);
    eventsByDate[date] = ev;
  });

  // Calculate padding for the first week
  const firstDateObj = new Date(days[0]);
  const firstWeekday = firstDateObj.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  // If you want weeks to start on Monday:
  const padDays = (firstWeekday + 6) % 7; // 0=Monday, 6=Sunday

  // Build the grid: pad empty days, then 21 days
  const tiles = [];
  for (let i = 0; i < padDays; i++) {
    tiles.push(<div key={`pad-${i}`} className="calendar-tile" style={{ visibility: 'hidden' }} />);
  }
  for (let i = 0; i < days.length; i++) {
    const date = days[i];
    const isPast =
      new Date(date) < new Date(new Date().toISOString().slice(0, 10)) &&
      i < 7; // Only fade days in the first week that are before today
    tiles.push(
      <CalendarTile
        key={date}
        event={eventsByDate[date]}
        date={date}
        faded={isPast}
        onClick={eventsByDate[date] ? () => handleTileClick(eventsByDate[date]) : undefined}
      />
    );
  }

  const handleTileClick = (event) => {
    if (event) setSelectedEvent(event);
  };

  const closePopup = () => setSelectedEvent(null);

  return (
    <div>
      <h2>Calendar</h2>
      <div className="calendar-grid">
        {tiles}
      </div>
      {selectedEvent && (
        <div
          className="calendar-popup-overlay"
          onClick={closePopup}
        >
          <div
            className="calendar-popup"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closePopup}
              style={{
                position: 'absolute',
                top: 12, right: 12,
                background: 'transparent',
                border: 'none',
                fontSize: 24,
                cursor: 'pointer'
              }}
              aria-label="Close"
            >×</button>
            <img
              src={
                selectedEvent.image_path
                  ? supabase.storage.from('public-media').getPublicUrl(selectedEvent.image_path).data.publicUrl
                  : '/placeholder.jpg'
              }
              alt={selectedEvent.title}
              className="calendar-popup-img"
            />
            <div className="calendar-popup-content">
              <h2>{selectedEvent.title}</h2>
              <div className="calendar-popup-details">
                <div><b>Production year:</b> {selectedEvent.year}</div>
                <div><b>Director:</b> {selectedEvent.director}</div>
                <div><b>Duration:</b> {selectedEvent.length}'</div>
                <div><b>Language:</b> {selectedEvent.language}</div>
                <div><b>Subtitles:</b> {selectedEvent.subtitles}</div>
              </div>
              <div style={{ margin: '66px 0' }}>
                <br />
                {selectedEvent.long_description || selectedEvent.description || selectedEvent.short_description}
              </div>
              {selectedEvent.age_restriction && (
                <div><b>Age Restriction:</b> {selectedEvent.age_restriction}</div>
              )}
              {selectedEvent.content_warning && (
                <div><b>Content Warning:</b> {selectedEvent.content_warning}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}