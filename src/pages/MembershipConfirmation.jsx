import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase' 

export default function MembershipConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)

  const selectedPlan = location.state?.selectedPlan
  const validThrough = location.state?.validThrough

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

  // Redirect after 5 seconds on success
  useEffect(() => {
    if (selectedPlan && validThrough) {
      const timer = setTimeout(() => {
        navigate('/my-membership')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [navigate, selectedPlan, validThrough])

  // Redirect after 3 seconds on missing data error
  useEffect(() => {
    if (!selectedPlan || !validThrough) {
      const timer = setTimeout(() => {
        navigate('/payment')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [navigate, selectedPlan, validThrough])

  if (!selectedPlan || !validThrough) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <p>Missing confirmation data. Redirecting to payment page...</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Payment Successful!</h2>
      <p>
        You've purchased the <strong>{selectedPlan.label}</strong> plan for <strong>{selectedPlan.price} SEK</strong>.
      </p>
      <p>
        Your membership is valid through <strong>{new Date(validThrough).toLocaleDateString()}</strong>.
      </p>
      <p>Redirecting you to your membership page...</p>
    </div>
  )
}
