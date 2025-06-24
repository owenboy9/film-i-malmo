import logo from './logo.svg';
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/home'
import Contact from './pages/contact'
import About from './pages/about';
import TestDb from './pages/testdb';
import TestSupabase from './TestSupabase'
import ResetPasswordPage from './pages/ResetPasswordPage'
import AccountSettings from './pages/AccountSettings'
import EditAccountSettings from './pages/EditAccountSettings'
import { supabase } from './supabase';
import Calendar from './pages/Calendar';
import PastEvents from './pages/PastEvents';

function HashRedirector() {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const type = params.get('type');
      if (type === 'recovery') {
        navigate('/reset-password' + window.location.hash, { replace: true });
      }
      // else: do nothing, let the user go to home or handle confirmation
    }
  }, [navigate]);
  return null;
}

// --- Add this sync logic to App.js ---
function useSyncUserProfile(user) {
  useEffect(() => {
    async function syncUserProfile() {
      if (!user) return;
      // Fetch user row from users table
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('first_name, last_name, birth_date, address_street, address_st_num, address_city, newsletter')
        .eq('id', user.id)
        .single();

      // Get latest from Auth metadata
      const displayName = user.user_metadata?.display_name || '';
      const [firstName, ...lastNameArr] = displayName.split(' ');
      const lastName = lastNameArr.join(' ');

      const birth_date = user.user_metadata?.birth_date || null;
      const address_street = user.user_metadata?.address_street || '';
      const address_st_num = user.user_metadata?.address_st_num || '';
      const address_city = user.user_metadata?.address_city || '';
      const newsletter = user.user_metadata?.newsletter ?? false;

      // If dbUser doesn't exist, insert it
      if (!dbUser) {
        await supabase.from('users').insert([{
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          email: user.email,
          birth_date,
          address_street,
          address_st_num,
          address_city,
          newsletter,
          created_at: new Date().toISOString()
        }]);
      } else {
        // If any field differs, update users table
        if (
          dbUser.first_name !== firstName ||
          dbUser.last_name !== lastName ||
          dbUser.birth_date !== birth_date ||
          dbUser.address_street !== address_street ||
          dbUser.address_st_num !== address_st_num ||
          dbUser.address_city !== address_city ||
          dbUser.newsletter !== newsletter
        ) {
          await supabase.from('users').update({
            first_name: firstName,
            last_name: lastName,
            birth_date,
            address_street,
            address_st_num,
            address_city,
            newsletter
          }).eq('id', user.id);
        }
      }
    }
    syncUserProfile();
  }, [user]);
}

function useSyncUserMembership(user) {
  useEffect(() => {
    async function syncUserMembership() {
      if (!user) return;
      // Check if user already exists in user_membership
      const { data: membership, error } = await supabase
        .from('user_membership')
        .select('uid')
        .eq('uid', user.id)
        .single();

      if (!membership) {
        // Insert new membership row with defaults
        await supabase.from('user_membership').insert([{
          id: user.id,
          last_payment: null,
          valid_through: null,
          is_member: false,
          role: 'user'
        }]);
      }
    }
    syncUserMembership();
  }, [user]);
}

function App() {
  const [user, setUser] = useState(null);

  // Listen for auth state changes globally
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Always sync user profile with database
  useSyncUserProfile(user);

  // Always sync user membership with database
  useSyncUserMembership(user);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><HashRedirector /><Home /></>} />
          <Route path="/contact" element={ <Contact /> } />
          <Route path="/about" element={ <About /> } />
          <Route path="/testdb" element={ <TestDb /> } />
          <Route path="/test" element={<TestSupabase />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/edit-account-settings" element={<EditAccountSettings />} />
          <Route path="/calendar" element={<Calendar />} /> {/* Add the Calendar route */}
          <Route path="/past-events" element={<PastEvents />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
