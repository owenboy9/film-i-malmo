import React from 'react';
import { supabase } from '../supabase';
import { ReactComponent as FilmiMalmoLogo } from '../assets/logo_fim.svg';

export default function CalendarTile({ event, date, faded, onClick }) {
  const tileClass = `calendar-tile${!event ? ' empty' : ''}${faded ? ' faded' : ''}`;

  if (!event) {
    // Show weekday and date for empty cells
    const dateObj = date ? new Date(date) : new Date();
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    return (
      <div className={tileClass}>
        <div><b>{weekday}, {dateStr}</b></div>
        <div>
          <FilmiMalmoLogo className="calendar-fim-logo" />
        </div>
        <div>Nothing scheduled yet</div>
      </div>
    );
  }

  // Use the image_path from the event row
  let imageUrl = '/placeholder.jpg';
  if (event.image_path) {
    const { data } = supabase.storage.from('public-media').getPublicUrl(event.image_path);
    imageUrl = data.publicUrl;
  }

  const dateObj = new Date(event.starts_at);
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={tileClass} onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
      <div><b>{weekday}, {dateStr}</b></div>
      <div>{timeStr}</div>
      <img
        src={imageUrl}
        alt={event.title}
        style={{
          width: '160px',
          height: '160px',
          objectFit: 'cover',
          borderRadius: '8px'
        }}
      />
      <br></br>
      <div><b>{event.title}</b></div>
      <div>{event.genre}</div>
      <div>{event.director}</div>
      <div>
        {event.country} / {event.year}, {event.length}'<br />
        {event.language} {event.subtitles ? `with ${event.subtitles} subtitles` : ''}
      </div>
      <div>{event.short_description}</div>
    </div>
  );
}

export function Calendar({ days, eventForDay }) {
  return (
    <div className="calendar-grid">
      {days.map(day => (
        <CalendarTile key={day} event={eventForDay(day)} date={day} />
      ))}
    </div>
  );
}