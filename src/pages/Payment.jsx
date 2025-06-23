import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(location.state?.selectedPlan || null)
  const [paymentMethod, setPaymentMethod] = useState('Credit Card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        navigate('/login')
      } else {
        setUser(data.user)
      }
    }
    fetchUser()
  }, [navigate])

  const handleConfirmPayment = async () => {
    setIsProcessing(true)
    setError('')

    const today = new Date()
    const validThrough = new Date(today)

    if (selectedPlan.duration === '2m') {
      validThrough.setMonth(validThrough.getMonth() + 2)
    } else if (selectedPlan.duration === '12m') {
      validThrough.setFullYear(validThrough.getFullYear() + 1)
    }

    const todayDate = today.toISOString().split('T')[0]
    const validThroughDate = validThrough.toISOString().split('T')[0]

    const { error: dbError } = await supabase
      .from('user_membership')
      .upsert({
        user_id: user.id,
        last_payment: todayDate,
        valid_through: validThroughDate
      }, { onConflict: 'user_id' })

    if (dbError) {
      setError('Payment failed: ' + dbError.message)
      setIsProcessing(false)
    } else {
      navigate('/membership-confirmation', { state: { selectedPlan, validThrough } })
    }
  }

  if (!selectedPlan) {
    return (
      <div>
        <p>No membership plan selected.</p>
        <button onClick={() => navigate('/buy-membership')}>Go back</button>
      </div>
    )
  }

  return (
    <div>
      <h2>Payment</h2>
      <p>You're purchasing a <strong>{selectedPlan.label}</strong> membership for <strong>{selectedPlan.price} SEK</strong>.</p>

      <div>
        <label>Choose a payment method:</label><br />
        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          <option value="Credit Card">Credit Card</option>
          <option value="Swish">Swish</option>
          <option value="PayPal">PayPal</option>
          <option value="Apple Pay">Apple Pay</option>
        </select>
      </div>

      {/* Payment method-specific fields (minimal simulation) */}
      {paymentMethod === 'Credit Card' && (
        <div>
          <input placeholder="Card Number" /><br />
          <input placeholder="Cardholder Name" /><br />
          <input placeholder="Expiry Date (MM/YY)" /><br />
          <input placeholder="CVC" /><br />
        </div>
      )}
      {paymentMethod === 'Swish' && (
        <div>
          <input placeholder="Phone Number (Swish)" /><br />
        </div>
      )}
      {paymentMethod === 'PayPal' && (
        <div>
          <input placeholder="PayPal Email" /><br />
        </div>
      )}
      {paymentMethod === 'Apple Pay' && (
        <p>Apple Pay will be processed on supported devices.</p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleConfirmPayment} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Confirm Payment'}
      </button>
      <button onClick={() => navigate('/buy-membership')} style={{ marginLeft: 8 }}>
        Cancel
      </button>
    </div>
  )
}
