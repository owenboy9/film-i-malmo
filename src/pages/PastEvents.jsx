import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import CalendarTile from '../components/CalendarTile';

export default function PastEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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

  return (
    <div>
      <h2>Past Events</h2>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'flex-start'
      }}>
        {events.map(ev => (
          <CalendarTile key={ev.id} event={ev} />
        ))}
      </div>
      {loading && <div>Loading...</div>}
      {!hasMore && <div style={{ margin: 32, color: '#888' }}>No more events.</div>}
    </div>
  );
}
