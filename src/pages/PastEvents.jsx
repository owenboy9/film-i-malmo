import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import CalendarTile from '../components/CalendarTile';

export default function PastEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null); // <-- Add this

  // Fetch past events in batches of 20, most recent first
  const fetchMore = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('events')
      .select('*')
      .lt('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: false })
      .range(from, from + 19);

    setEvents(prev => {
      // Filter out events with duplicate IDs
      const existingIds = new Set(prev.map(ev => ev.id));
      const newEvents = (data || []).filter(ev => !existingIds.has(ev.id));
      return [...prev, ...newEvents];
    });
    setFrom(prev => prev + 20);
    setHasMore(data && data.length === 20);
    setLoading(false);
  };

  useEffect(() => {
    fetchMore();
    // eslint-disable-next-line
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
      ) {
        fetchMore();
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line
  }, [hasMore, loading]);

  const closePopup = () => setSelectedEvent(null);

  return (
    <div className="generic-container">
      <h2>Past Events</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'flex-start'
      }}>
        {events.map(ev => (
          <CalendarTile
            key={ev.id}
            event={ev}
            onClick={() => setSelectedEvent(ev)}
          />
        ))}
      </div>
      {loading && <div>Loading...</div>}
      {!hasMore && <div style={{ margin: 32, color: '#888' }}>No more events.</div>}

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
