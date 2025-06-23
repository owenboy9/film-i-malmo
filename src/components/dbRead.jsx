import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function DbRead() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('id', { ascending: false })
      if (!error) setMovies(data)
      setLoading(false)
    }
    fetchMovies()
  }, [])

  return (
    <div>
      <h3>Filmlista</h3>
      {loading ? (
        <p>Laddar filmer...</p>
      ) : (
        <ul>
          {movies.map(movie => (
            <li key={movie.id}>
              <strong>{movie.title}</strong>: {movie.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}