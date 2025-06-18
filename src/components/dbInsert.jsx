import React, { useState } from 'react'
import { supabase } from '../supabase'

export default function DbInsert() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInsert = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase
      .from('movies')
      .insert([{ title, description }])
      .select()
    setResult({ data, error })
    setLoading(false)
    if (!error) {
      setTitle('')
      setDescription('')
    }
  }

  return (
    <div>
      <h3>Lägg till film</h3>
      <form onSubmit={handleInsert}>
        <input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Beskrivning"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Lägger till...' : 'Lägg till film'}
        </button>
      </form>
      <pre>{result && JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}