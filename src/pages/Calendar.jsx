import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import CalendarTile from '../components/CalendarTile';

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

  return (
    <div>
      <h2>Calendar</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 16 }}>
        {days.map(date => (
          <CalendarTile key={date} event={eventsByDate[date]} />
        ))}
      </div>
    </div>
  );
}