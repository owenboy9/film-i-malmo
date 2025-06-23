import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import MembershipOption from '../components/MembershipOption'

export default function BuyMembership() {
  const [user, setUser] = useState(null)
  const [membership, setMembership] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const navigate = useNavigate()

  // Check if user is authenticated
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

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan)
  }

  const handleGoBack = () => {
    setSelectedPlan(null)
  }

  const handleProceed = () => {
    // pass selected plan to payment page, e.g., via URL param or context
    navigate('/payment', { state: { selectedPlan } })
  }

  if (!user) return null // don't render until user is verified
  
  const today = new Date()
  const validThroughDate = membership?.valid_through ? new Date(membership.valid_through) : null
  const isMembershipValid = validThroughDate && validThroughDate > today

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

        {isMembershipValid && (
            <p>
                Your membership is still valid through{' '}
                <strong>{validThroughDate.toLocaleDateString()}</strong>. Do you want to add a new
                membership period of{' '}
                <strong>
                    {selectedPlan.duration === '2m' ? '2 months' : 'one year'}
                </strong>{' '}
                to it?
            </p>    

        )}

          <button onClick={handleGoBack}>Go Back</button>
          <button onClick={handleProceed} style={{ marginLeft: '1rem' }}>
            Proceed to Payment
          </button>
        </div>
      )}
    </div>
  )
}
