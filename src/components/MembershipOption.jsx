import React from 'react'

export default function MembershipOption({
  label,
  price,
  onSelect,
  selected = false
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        borderRadius: '8px',
        cursor: 'pointer',
        padding: '16px',
        width: '100px',
        backgroundColor: '#dbbf8b',
        transition: '0.2s ease',
        opacity: '0.7'
      }}
    >
      <h3 style={{ margin: '0 0 8px' }}>{label}</h3>
      <p style={{ margin: 0 }}>{price} SEK</p>
    </div>
  )
}
