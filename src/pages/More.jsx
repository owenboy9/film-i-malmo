import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function More() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>More Links</h2>
      <button onClick={() => navigate('/upload-private-media')} style={{ marginBottom: 12 }}>
        Upload Files to Private-Media
      </button>
      <br />
      <button onClick={() => navigate('/calendar')} style={{ marginBottom: 12 }}>
        Go to Calendar
      </button>
      <br />
      <button onClick={() => navigate('/past-events')}>
        View Past Events
      </button>
    </div>
  )
}
