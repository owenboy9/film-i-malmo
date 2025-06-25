import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { crudConfigs } from '../components/GenericCrudProps'

const SUPABASE_URL = 'https://llslxcymbxcvwrufjaqm.supabase.co'

export default function CurrentBoard() {
  const currentYear = new Date().getFullYear()
  const { table } = crudConfigs.rope_runners
  const [boardMembers, setBoardMembers] = useState([])
  const [others, setOthers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true)
      setError(null)
      const selectFields = [
        'id',
        'name',
        'role',
        'pronouns',
        'bio',
        'image_path',
        'image_bucket',
        'board_member'
      ].join(', ')
      const { data, error } = await supabase
        .from(table)
        .select(selectFields)
        .order('id', { ascending: true })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setBoardMembers(data.filter(r => r.board_member))
      setOthers(data.filter(r => !r.board_member))
      setLoading(false)
    }
    fetchPeople()
  }, [table])

  const renderPerson = (row) => {
    const url =
      row.image_path && row.image_bucket
        ? `${SUPABASE_URL}/storage/v1/object/public/${row.image_bucket}/${row.image_path}`
        : null

    return (
      <div
        key={row.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          {url && (
            <img
              src={url}
              alt={row.name || 'image'}
              style={{
                maxHeight: 120,
                width: 'auto',
                display: 'block'
              }}
            />
          )}
        </div>
        <div style={{ color: 'white', marginLeft: 24 }}>
          <h2 style={{ margin: 0 }}>{row.name}</h2>
          <h3 style={{ margin: '0.25rem 0' }}>{row.role}</h3>
          <p style={{ margin: '0.25rem 0', fontStyle: 'italic' }}>{row.pronouns}</p>
          <p style={{ margin: '1rem 0 0 0' }}>{row.bio}</p>
        </div>
      </div>
    )
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>

  return (
    <div>
      <h1 style={{ color: 'white' }}>The People Behind Film i Malmö</h1>

      <h2 style={{ color: 'white' }}>Board Members {currentYear}</h2>
      {boardMembers.length === 0 && <p style={{ color: 'white' }}>No board members found.</p>}
      {boardMembers.map(renderPerson)}

      <h2 style={{ color: 'white' }}>Good to know others</h2>
      {others.length === 0 && <p style={{ color: 'white' }}>No others found.</p>}
      {others.map(renderPerson)}
    </div>
  )
}