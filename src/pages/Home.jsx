import React, { useEffect, useState } from 'react'
import Auth from '../components/Auth'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import CalendarTile from '../components/CalendarTile';

export default function Home() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [members, setMembers] = useState([]);
  const [membership, setMembership] = useState(null);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

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

  const role = membership?.role || 'user';
  const isAdmin = role === 'admin';
  const isSuperuser = role === 'superuser';

  const displayName = user?.user_metadata?.display_name || '';
  const [firstName, ...lastNameArr] = displayName.split(' ');
  const lastName = lastNameArr.join(' ');

  const isActive = user?.user_metadata?.is_active_member === true;

  // Only admin and superuser can make themselves active/inactive
  async function makeMeActiveMember() {
    if (!isAdmin && !isSuperuser) {
      alert('Only admin or superuser can activate themselves for streaming service.');
      return;
    }
    const { error } = await supabase.auth.updateUser({
      data: { is_active_member: true }
    });
    if (error) alert(error.message)
    else alert('You are now an active member!')
  }

  async function makeMeInactiveMember() {
    if (!isAdmin && !isSuperuser) {
      alert('Only admin or superuser can deactivate themselves for streaming service.');
      return;
    }
    const { error } = await supabase.auth.updateUser({
      data: { is_active_member: false }
    });
    if (error) alert(error.message)
    else alert('You are now inactive!');
  }

  // Admin and superuser can make others active/inactive
  async function setMemberActive(uid, memberRole) {
    if (isAdmin && memberRole !== 'user') {
      alert('Admin can only update user roles.');
      return;
    }
    // Superuser can update anyone except other superusers
    if (isSuperuser && memberRole === 'superuser') {
      alert('Superuser cannot update other superusers.');
      return;
    }
    const { error } = await supabase.auth.admin.updateUserById(uid, {
      user_metadata: { is_active_member: true }
    });
    if (error) alert(error.message)
    else alert('Member set to active!');
  }

  async function setMemberInactive(uid, memberRole) {
    if (isAdmin && memberRole !== 'user') {
      alert('Admin can only update user roles.');
      return;
    }
    if (isSuperuser && memberRole === 'superuser') {
      alert('Superuser cannot update other superusers.');
      return;
    }
    const { error } = await supabase.auth.admin.updateUserById(uid, {
      user_metadata: { is_active_member: false }
    });
    if (error) alert(error.message)
    else alert('Member set to inactive!');
  }

  // Example usage: show admin button only for admins/superusers
  const isAdminRole = membership?.role === 'admin' || membership?.role === 'superuser';

  return (
    <div>
      <h1>Welcome to Film i Malmö{user ? ` ${displayName}` : ''}!</h1>
      <p>Your go-to platform for all things cinema in Malmö.</p>
      <p>Explore movie schedules, book tickets, and enjoy the latest films.</p>
      <p>Stay tuned for updates and new features!</p>
      {!user && (
        <>
          <button onClick={() => setShowAuth(true)}>Login</button>
          <button onClick={() => setShowAuth(true)}>Account Settings</button>
        </>
      )}
      {user && (
        <>
          <button>
            {role === 'superuser' ? 'Superuser' : role === 'admin' ? 'Admin' : 'User'}
          </button>
          <button onClick={() => supabase.auth.signOut()}>Logout</button>
          <button onClick={() => navigate('/account-settings')}>My Membership</button>
          <button onClick={() => navigate('/upload-private-media')} style={{ marginLeft: 8 }}>Upload Files to Private-Media</button>
          <button onClick={() => navigate('/calendar')} style={{ marginTop: 16, marginBottom: 16 }}>
            Go to Calendar
          </button>
          <button onClick={() => navigate('/past-events')} style={{ marginTop: 8, marginBottom: 8 }}>
            View Past Events
          </button>
        </>
      )}
      {/* Contact button for all users */}
      <button onClick={() => navigate('/contact')} style={{ marginLeft: 8 }}>Contact</button>

      {/* Admin/Superuser: Manage members' active status */}
      {user && (isAdmin || isSuperuser) && (
        <div style={{ marginTop: 32 }}>
          <div style={{ maxHeight: 200, overflowY: 'auto', border: '1px solid #eee', padding: 8 }}>
            {members
              .filter(m => m.id !== user.id) // Don't show self
              .map(m => {
                const memberRole = m.user_metadata?.role || 'user';
                const canEdit =
                  (isAdmin && memberRole === 'user') ||
                  (isSuperuser && memberRole !== 'superuser');
                return (
                  
                  <div key={m.id} style={{ marginBottom: 8, borderBottom: '1px solid #eee' }}>
                    <b>Name:</b> {m.user_metadata?.display_name || m.email} <br />
                    <b>Role:</b> {memberRole} <br />
                    <b>Status:</b> {m.user_metadata?.is_active_member ? 'Active' : 'Inactive'} <br />
                    {canEdit && (
                      <>
                        <button onClick={() => setMemberActive(m.id, memberRole)} style={{ marginRight: 8 }}>
                          Set Active
                        </button>
                        <button onClick={() => setMemberInactive(m.id, memberRole)}>
                          Set Inactive
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <h2>Upcoming Screenings</h2>
      <div style={{ display: 'flex', gap: 16 }}>
        {[0, 1, 2, 3].map(i => (
          <CalendarTile key={i} event={events[i]} />
        ))}
      </div>
    </div>
  )
}
