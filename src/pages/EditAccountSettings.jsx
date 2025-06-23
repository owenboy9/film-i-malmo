import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Auth from '../components/Auth'
import { useNavigate } from 'react-router-dom'

export default function EditAccountSettings() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressStNum, setAddressStNum] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        const [first, ...last] = (user.user_metadata?.display_name || '').split(' ');
        setFirstName(first || '');
        setLastName(last.join(' ') || '');
        setAddressStreet(user.user_metadata?.address_street || '');
        setAddressStNum(user.user_metadata?.address_st_num || '');
        setAddressCity(user.user_metadata?.address_city || '');
        setPhone(user.user_metadata?.phone || '');
        setBirthDate(user.user_metadata?.birth_date || '');
        setEmail(user.email || '');
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!user) {
    return <Auth />;
  }

  const handleSave = async () => {
    setError('');
    setSuccess('');
    const display_name = `${firstName} ${lastName}`.trim();
    const { error } = await supabase.auth.updateUser({
      email,
      data: {
        display_name,
        address_street: addressStreet,
        address_st_num: addressStNum,
        address_city: addressCity,
        phone,
        birth_date: birthDate
      }
    });
    if (error) {
      setError(error.message);
    } else {
      if (email !== user.email) {
        setSuccess('A confirmation email has been sent to your new address. Please confirm to complete the change.');
      } else {
        setSuccess('Account updated!');
        setTimeout(() => navigate('/account-settings'), 1000);
      }
    }
  };

  const handleResetPassword = async () => {
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setSuccess('Password reset email sent!');
  };

  return (
    <div>
      <h2>Edit Account Settings</h2>
      <input
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="Street"
        value={addressStreet}
        onChange={e => setAddressStreet(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="Street Number"
        value={addressStNum}
        onChange={e => setAddressStNum(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="City"
        value={addressCity}
        onChange={e => setAddressCity(e.target.value)}
      /><br />
      <input
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      /><br />
      <input
        type="date"
        placeholder="Birth date"
        value={birthDate}
        onChange={e => setBirthDate(e.target.value)}
      /><br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      /><br />
      <button onClick={handleResetPassword}>Reset Password</button>
      <br /><br />
      <button onClick={handleSave}>Save</button>
      <button onClick={() => navigate('/account-settings')} style={{ marginLeft: 8 }}>Cancel</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}