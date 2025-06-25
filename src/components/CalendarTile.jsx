import React from 'react';
import { supabase } from '../supabase';

export default function CalendarTile({ event }) {
  if (!event) {
    return (
      <div className="calendar-tile empty">
        <img src="/placeholder.jpg" alt="No event" style={{ width: '100%' }} />
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
    <div className="calendar-tile">
      <div><b>{weekday}, {dateStr}</b></div>
      <div>{timeStr}</div>
      <img
        src={imageUrl}
        alt={event.title}
        // style={{
        //   // width: '220px',
        //   // height: '220px',
        //   // objectFit: 'cover',
          
        //   borderRadius: '8px'
        // }}
      />
      <div><b>{event.title}</b></div>
      <div>{event.genre}</div>
      <div>{event.director}</div>
      <div>
        {event.country} / {event.year}, {event.length}'<br />
        {event.language} {event.subtitles ? `with ${event.subtitles} subtitles` : ''}
      </div>
      <div>{event.short_description || event.description}</div>
    </div>
  );
}