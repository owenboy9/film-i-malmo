import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

// Read the token synchronously on first render
function getTokenFromHash() {
  if (!window.location.hash) return null
  const params = new URLSearchParams(window.location.hash.substring(1))
  return params.get('access_token')
}

export default function ResetEmailPage() {
  const navigate = useNavigate()
  // Capture the token synchronously
  const [token] = useState(getTokenFromHash())
  const [email, setEmail] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !confirm) {
      setError('Please enter your new email twice.')
      return
    }
    if (email !== confirm) {
      setError('Emails do not match.')
      return
    }
    // Supabase session is already authenticated via the token in the hash
    const { error } = await supabase.auth.updateUser({ email })
    if (error) {
      setError(error.message)
    } else {
      setSuccess('A confirmation email has been sent to your new address. Please confirm to complete the change.')
      setTimeout(() => navigate('/'), 3000)
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
      <h2>Change Your Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="New email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br/>
        <input
          type="email"
          placeholder="Confirm new email"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        /><br/>
        <button type="submit">Set New Email</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>{success}</p>}
    </div>
  )
}