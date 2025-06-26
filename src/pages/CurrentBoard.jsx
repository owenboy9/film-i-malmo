import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { crudConfigs } from '../components/GenericCrudProps'
import '../styles/CurrentBoard.css' 

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
        key={row.id} className='person'
      >
        <div>
          {url && (
            <img
              src={url}
              alt={row.name || 'image'}
            />
          )}
        </div>
        <div>
          <h2>{row.name}</h2>
          <h3>{row.role}</h3>
          <p>{row.pronouns}</p>
          <p>{row.bio}</p>
        </div>
      </div>
    )
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>

  return (
    <div className='current-board'>
      <h1>The People Behind Film i Malmö</h1>

      <h2>Board Members {currentYear}</h2>
      <div className='people board-members'>
        {boardMembers.length === 0 && <p >No board members found.</p>}
        {boardMembers.map(renderPerson)}
      </div>
      <h2>Good to know others</h2>
      <div className='people others'>
      {others.length === 0 && <p>No others found.</p>}
      {others.map(renderPerson)}
      </div>
    </div>
  )
}