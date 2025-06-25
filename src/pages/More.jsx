import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase' // adjust path if needed

export default function More() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  return (
    <div>
      <h2>More Links</h2>
      {user && (
        <button onClick={() => navigate('/upload-private-media')} style={{ marginBottom: 12 }}>
          Upload Files to Private-Media
        </button>
      )}
      <br />
      <button onClick={() => navigate('/past-events')}>
        View Past Events
      </button>
    </div>
  )
}
