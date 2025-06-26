import React, { useEffect, useState } from 'react'
import Auth from '../components/Auth'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import CalendarTile from '../components/CalendarTile';
import '../styles/Home.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [members, setMembers] = useState([]);
  const [membership, setMembership] = useState(null);
  const [events, setEvents] = useState([]);


  useEffect(() => {
    // Get current user on mount
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setShowAuth(false); // Hide Auth on logout
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Fetch membership info for the logged-in user
    if (user) {
      supabase
        .from('user_membership')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          setMembership(data);
          console.log('Membership role from DB:', data?.role); // <-- Add this line
        });
    }
  }, [user]);

  const fetchMembers = async () => {
    if (user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'superuser') {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (!error) setMembers(data.users);
    }
  };

  // Fetch all members if admin or superuser
  useEffect(() => {
    fetchMembers();
  }, [user]);

  useEffect(() => {
    // Fetch upcoming events, sorted by starts_at, limit 4
    supabase
      .from('events')
      .select('*')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(4)
      .then(({ data }) => setEvents(data || []));
  }, []);

  if (showAuth) {
    return <Auth />;
  }

  const displayName = user?.user_metadata?.display_name || '';
  
  // Example usage: show admin button only for admins/superusers
  const isAdminRole = membership?.role === 'admin' || membership?.role === 'superuser';

  return (
    <div>
      <h1>Welcome to Film i Malmö{user ? ` ${displayName}` : ''}!</h1>
      <p>Your go-to platform for all things cinema in Malmö.</p>
      <p>Explore movie schedules, book tickets, and enjoy the latest films.</p>
      <p>Stay tuned for updates and new features!</p>


      <h2>Upcoming Screenings</h2>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        {[0, 1, 2, 3].map(i => (
          <CalendarTile key={i} event={events[i]} />
        ))}
      </div>
    </div>
  )
}
