import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function DbGenericRead({ table, fields, filter }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRows = async () => {
      setLoading(true)
      let query = supabase
        .from(table)
        .select(['id', ...fields.map(f => f.name)].join(', '))
        .order('id', { ascending: false })
      // Om filter är en funktion, anropa den med query
      if (typeof filter === 'function') {
        query = filter(query)
      }
      const { data, error } = await query
      if (!error) setRows(data)
      setLoading(false)
    }
    fetchRows()
  }, [table, fields, filter])

  return (
    <div>
      <h3>Lista: {table}</h3>
      {loading ? (
        <p>Laddar...</p>
      ) : (
        <ul className='db-generic-read'>
          {rows.map(row => (
            <li key={row.id}>
              {fields.map(f => (
                <span key={`${row.id}-${f.name}`}>
                  {f.name === 'image_url' && row[f.name] ? (
                    <img
                      src={row[f.name]}
                      alt={row.title || 'bild'}
                      style={{ maxWidth: 100, verticalAlign: 'middle' }}
                    />
                  ) : (
                    <>
                      <strong>{f.name}:</strong> {String(row[f.name])}{' '}
                    </>
                  )}
                </span>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}