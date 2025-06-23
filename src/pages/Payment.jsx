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
    if (!user) {
        setError('User not loaded yet.');
        return;
    }
    if (!selectedPlan) {
        setError('No membership plan selected.');
        return;
    }

    setIsProcessing(true);
    setError('');

    const { error: rpcError } = await supabase.rpc('update_membership', {
        uid: user.id,
        duration: selectedPlan.duration,
    });

    if (rpcError) {
        setError('Payment failed: ' + rpcError.message);
        setIsProcessing(false);
    } else {
        const today = new Date();
        const validThrough = new Date(today);
        if (selectedPlan.duration === '2m') {
        validThrough.setMonth(validThrough.getMonth() + 2);
        } else if (selectedPlan.duration === '12m') {
        validThrough.setFullYear(validThrough.getFullYear() + 1);
        }

        navigate('/membership-confirmation', { state: { selectedPlan, validThrough } });
    }
  };

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
