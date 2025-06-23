import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import MembershipOption from '../components/MembershipOption'

export default function BuyMembership() {
  const [user, setUser] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const navigate = useNavigate()

  // Check if user is authenticated
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        navigate('/login') // redirect if not logged in
      } else {
        setUser(data.user)
      }
    }
    getUser()
  }, [navigate])

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan)
  }

  const handleGoBack = () => {
    setSelectedPlan(null)
  }

  const handleProceed = () => {
    // pass selected plan to payment page, e.g., via URL param or context
    navigate(`/payment?plan=${selectedPlan}`)
  }

  if (!user) return null // don't render until user is verified

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Choose Your Membership Plan</h2>

      {!selectedPlan ? (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <MembershipOption
                label="Bi-Monthly Membership"
                price={100}
                onSelect={() =>
                handleSelectPlan({
                    label: 'Bi-Monthly Membership',
                    price: 100,
                    duration: '2m'
                })
                }
                selected={selectedPlan?.label === 'Bi-Monthly Membership'}
            />
            <MembershipOption
                label="Yearly Membership"
                price={500}
                onSelect={() =>
                handleSelectPlan({
                    label: 'Yearly Membership',
                    price: 500,
                    duration: '12m'
                })
                }
                selected={selectedPlan?.label === 'Yearly Membership'}
            />
        </div>

      ) : (
        <div style={{ marginTop: '2rem' }}>
          <p>
            You have chosen to pay for a <strong>{selectedPlan.label}</strong> membership
            for <strong>{selectedPlan.price} SEK</strong>.
        </p>

          <button onClick={handleGoBack}>Go Back</button>
          <button onClick={handleProceed} style={{ marginLeft: '1rem' }}>
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  )
}
