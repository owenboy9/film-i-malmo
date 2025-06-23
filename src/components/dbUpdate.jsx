import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function DbUpdate() {
  const [movies, setMovies] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('id', { ascending: false })
      if (!error) setMovies(data)
    }
    fetchMovies()
  }, [])

  // När användaren väljer en film, fyll i fälten
  useEffect(() => {
    if (!selectedId) return
    const movie = movies.find(m => m.id === Number(selectedId))
    if (movie) {
      setTitle(movie.title)
      setDescription(movie.description)
    }
  }, [selectedId, movies])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase
      .from('movies')
      .update({ title, description })
      .eq('id', selectedId)
      .select()
    setResult({ data, error })
    setLoading(false)
  }

  return (
    <div>
      <h3>Uppdatera film</h3>
      <form onSubmit={handleUpdate}>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          required
        >
          <option value="">Välj film...</option>
          {movies.map(movie => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Ny titel"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          disabled={!selectedId}
        />
        <input
          type="text"
          placeholder="Ny beskrivning"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          disabled={!selectedId}
        />
        <button type="submit" disabled={loading || !selectedId}>
          {loading ? 'Uppdaterar...' : 'Uppdatera'}
        </button>
      </form>
      <pre>{result && JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}