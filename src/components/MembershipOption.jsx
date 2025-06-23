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
        border: selected ? '2px solid green' : '2px solid #ccc',
        padding: '16px',
        marginBottom: '12px',
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: selected ? '#f0fff0' : '#fff',
        transition: '0.2s ease'
      }}
    >
      <h3 style={{ margin: '0 0 8px' }}>{label}</h3>
      <p style={{ margin: 0 }}>{price} SEK</p>
    </div>
  )
}
