import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function DbDelete() {
  const [movies, setMovies] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('id', { ascending: false })
    if (!error) setMovies(data)
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase
      .from('movies')
      .delete()
      .eq('id', selectedId)
      .select()
    setResult({ data, error })
    setLoading(false)
    setSelectedId('')
    fetchMovies()
  }

  return (
    <div>
      <h3>Ta bort film</h3>
      <form onSubmit={handleDelete}>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          required
        >
          <option value="">Välj film att ta bort...</option>
          {movies.map(movie => (
            <option key={movie.id} value={movie.id}>
              {movie.title}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading || !selectedId}>
          {loading ? 'Tar bort...' : 'Ta bort'}
        </button>
      </form>
      <pre>{result && JSON.stringify(result, null, 2)}</pre>
    </div>
      )
}