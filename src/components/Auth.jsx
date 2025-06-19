import React, { useState } from 'react'
import { supabase } from '../supabase'

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
  const [payment, setPayment] = useState('Credit Card')
  const [newsletter, setNewsletter] = useState(false)
  const [error, setError] = useState(null)
  const [signupMessage, setSignupMessage] = useState('')
  const [resetMessage, setResetMessage] = useState('')

  const handleSignUp = async () => {
    setError(null)
    setSignupMessage('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    const displayName = `${firstName} ${lastName}`.trim()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          birth_date: birthDate,
          phone: phone || null,
          address,
          payment,
          newsletter,
        }
      }
    })
    if (error) {
      setError(error.message)
    } else {
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
      setPayment('Credit Card')
      setNewsletter(false)
    }
  }

  const handleSignIn = async () => {
    setError(null)
    setSignupMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setError(error?.message)
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
          /><br/>
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e.target.value)}
          /><br/>
          <label>
            Payment info:&nbsp;
            <select value={payment} onChange={e => setPayment(e.target.value)}>
              <option value="Credit Card">Credit Card</option>
              <option value="Swish">Swish</option>
              <option value="Paypal">Paypal</option>
              <option value="Apple Pay">Apple Pay</option>
            </select>
          </label>
          <br/>
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