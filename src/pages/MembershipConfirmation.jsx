import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../supabase' 

export default function MembershipConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useState(null)
  const [membership, setMembership] = useState(null)
  const selectedPlan = location.state?.selectedPlan
  const validThrough = membership?.valid_through ? new Date(membership.valid_through) : null

  useEffect(() => {
    const getUserAndMembership = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        navigate('/login')
        return
      }
      setUser(userData.user)

      const { data: membershipData, error: membershipError } = await supabase
        .from('user_membership')
        .select('last_payment, valid_through')
        .eq('id', userData.user.id)
        .single()

      if (!membershipError && membershipData) {
        setMembership(membershipData)
      }
    }
    getUserAndMembership()
  }, [navigate])

  // Redirect after 5 seconds on success
  useEffect(() => {
    if (selectedPlan && validThrough) {
      const timer = setTimeout(() => {
        navigate('/account-settings')
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
