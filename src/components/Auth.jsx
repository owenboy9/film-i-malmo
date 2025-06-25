import React, { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [mode, setMode] = useState(null) // null, 'login', 'signup', or 'reset'
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [addressStreet, setAddressStreet] = useState('');
  const [addressStNum, setAddressStNum] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [newsletter, setNewsletter] = useState(false)
  const [error, setError] = useState(null)
  const [signupMessage, setSignupMessage] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError(null)
    setSignupMessage('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Check if email exists in users table
    const { data: existing, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      setError('This email is already registered. Please log in or use another email.');
      return;
    }

    const displayName = `${firstName} ${lastName}`.trim()
    // Try to sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          birth_date: birthDate,
          phone: phone || null,
          address_street: addressStreet,
          address_st_num: addressStNum,
          address_city: addressCity,
          newsletter,
        }
      }
    })

    if (error) {
      // Check for "already registered" error
      if (
        error.message &&
        (error.message.toLowerCase().includes('already registered') ||
         error.message.toLowerCase().includes('user already exists') ||
         error.message.toLowerCase().includes('duplicate key') ||
         error.message.toLowerCase().includes('user already registered'))
      ) {
        setError('This email is already registered. Please log in or use another email.');
      } else {
        setError(error.message)
      }
      return
    }

    setSignupMessage('Please confirm your signup before logging in.')
    setMode(null)
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setBirthDate('')
    setPhone('')
    setAddress('')
    setNewsletter(false)
  }

  const handleSignIn = async () => {
    setError(null)
    setSignupMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      // If the error is about email not confirmed, resend confirmation
      if (error.message && error.message.toLowerCase().includes('confirm')) {
        await handleResendConfirmation(email);
      }
      return;
    }
    window.location.reload(); // Force a full page reload after login
  }

  const handleResetPassword = async () => {
    setError(null)
    setResetMessage('')
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
      setError(error.message)
    } else {
      setResetMessage('If this email exists, a password reset link has been sent.')
      setMode(null)
      setEmail('')
    }
  }

  const handleResendConfirmation = async (email) => {
    setError(null);
    // Supabase does not have a direct resend method in the client SDK,
    // so you need to trigger the signUp endpoint again with the same email.
    // This will resend the confirmation email if the user is not confirmed.
    const { error } = await supabase.auth.signUp({ email, password: 'dummy' });
    if (error) {
      setError('Failed to resend confirmation email: ' + error.message);
    } else {
      setSignupMessage('A new confirmation email has been sent. Please check your inbox.');
    }
  };

  if (signupMessage) {
    return (
      <div>
        <p style={{color: 'green'}}>{signupMessage}</p>
        <button onClick={() => setSignupMessage('')}>Back</button>
      </div>
    )
  }

  if (resetMessage) {
    return (
      <div>
        <p style={{color: 'green'}}>{resetMessage}</p>
        <button onClick={() => setResetMessage('')}>Back</button>
      </div>
    )
  }

  if (!mode) {
    return (
      <div>
        <h2>Welcome guest!</h2>
        <p>Do you wish to Login or Sign Up?</p>
        <button onClick={() => setMode('login')}>Login</button>
        <button onClick={() => setMode('signup')}>Sign Up</button>
      </div>
    )
  }

  if (mode === 'reset') {
    return (
      <div>
        <h2>Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br/>
        <button onClick={handleResetPassword}>Send Reset Link</button>
        <button onClick={() => setMode('login')} style={{marginLeft: 8}}>Back</button>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </div>
    )
  }

  return (
    <div>
      <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      {mode === 'signup' && (
        <>
          <input
            type="text"
            placeholder="First name (e.g. Alice)"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          /><br/>
          <input
            type="text"
            placeholder="Last name (e.g. Andersson)"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          /><br/>
          <label>
            Birth date:&nbsp;
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              required
            />
          </label>
          <br/>
          <input
            type="tel"
            placeholder="Phone (e.g. 0701234567)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
         <br/>
          <input
            type="text"
            placeholder="Street"
            value={addressStreet}
            onChange={e => setAddressStreet(e.target.value)}
          />
          <input
            type="text"
            placeholder="Street Number"
            value={addressStNum}
            onChange={e => setAddressStNum(e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            value={addressCity}
            onChange={e => setAddressCity(e.target.value)}
          /><br/>
        </>
      )}
      <input
        type="email"
        placeholder="Email (e.g. alice@email.com)"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      /><br/>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      /><br/>
      {mode === 'signup' && (
        <>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          /><br/>
          <label>
            <input
              type="checkbox"
              checked={newsletter}
              onChange={e => setNewsletter(e.target.checked)}
            />
            Subscribe to newsletter
          </label>
          <br/>
        </>
      )}
      {mode === 'login' ? (
        <>
          <button onClick={handleSignIn}>Login</button>
          <button onClick={() => setMode('reset')} style={{marginLeft: 8}}>Forgot password?</button>
        </>
      ) : (
        <button onClick={handleSignUp}>Sign Up</button>
      )}
      <button onClick={() => setMode(null)} style={{marginLeft: 8}}>Back</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  )
}