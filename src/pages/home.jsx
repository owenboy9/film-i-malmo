import React, { useEffect, useState } from 'react'
import Auth from '../components/Auth'
import { supabase } from '../supabase'

export default function Home() {
  const [user, setUser] = useState(null);
  const [fontSize, setFontSize] = useState(16); // default 16px

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const increase = () => setFontSize(size => Math.min(size + 2, 40));
  const decrease = () => setFontSize(size => Math.max(size - 2, 10));

  if (!user) {
    return <Auth />;
  }

  const isAdmin = user.user_metadata?.role === 'admin';
  const displayName = user.user_metadata?.display_name || user.email;


  return (
    <div>
      <h1>Welcome to Film i Malmö {displayName}!</h1>
      <p>Your go-to platform for all things cinema in Malmö.</p>
      <p>Explore movie schedules, book tickets, and enjoy the latest films.</p>
      <p>Stay tuned for updates and new features!</p>
      {isAdmin ? (
        <button>admin</button>
      ) : (
        <button>not admin</button>
      )}
      <button onClick={() => supabase.auth.signOut()}>Logout</button>
    </div>
  )
}

// Call this function as the user you want to update
async function makeMeAdmin() {
  const { error } = await supabase.auth.updateUser({
    data: { role: 'admin' }
  });
  if (error) alert(error.message)
  else alert('You are now admin!')
}
