import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

// Read the token synchronously on first render
function getTokenFromHash() {
  if (!window.location.hash) return null
  const params = new URLSearchParams(window.location.hash.substring(1))
  return params.get('access_token')
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  // Capture the token synchronously
  const [token] = useState(getTokenFromHash())
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    // Supabase session is already authenticated via the token in the hash
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Password updated! Please log in with your new password.')
      await supabase.auth.signOut()
      setTimeout(() => navigate('/'), 2000)
    }
  }

  if (!token) {
    return (
      <div>
        <h2>Invalid or missing reset token</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    )
  }

  return (
    <div>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        /><br/>
        <button type="submit">Set New Password</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>{success}</p>}
    </div>
  )
}