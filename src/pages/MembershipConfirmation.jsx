import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase' 

export default function MembershipConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedPlan = location.state?.selectedPlan
  const validThrough = location.state?.validThrough

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        navigate('/login')
      }
    }
    fetchUser()
  }, [navigate])

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/my-membership')
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  if (!selectedPlan || !validThrough) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <p>Missing confirmation data. Redirecting...</p>
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
