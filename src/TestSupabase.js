// src/TestSupabase.js
import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function TestSupabase() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('your_table').select('*')
      if (error) console.error('Supabase error:', error)
      else setData(data)
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>Supabase Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}