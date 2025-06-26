import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import CalendarTile from '../components/CalendarTile';
import '../styles/Calendar.css';

// Get 21 consecutive days starting today
function getCalendarDays() {
  const today = new Date();
  const days = [];
  for (let i = 0; i < 21; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default function Calendar() {
  const [events, setEvents] = useState([]);
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
    tiles.push(
      <CalendarTile
        key={date}
        event={eventsByDate[date]}
        date={date}
      />
    );
  }

  return (
    <div>
      <h2>Calendar</h2>
      <div className="calendar-grid">
        {tiles}
      </div>
    </div>
  );
}