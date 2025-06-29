import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function DbGenericRead({ table, fields }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRows = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from(table)
        .select(['id', ...fields.map(f => f.name)].join(', '))
        .order('id', { ascending: false })
      if (!error) setRows(data)
      setLoading(false)
    }
    fetchRows()
  }, [table, fields])

  return (
    <div>
      <h3>Lista: {table}</h3>
      {loading ? (
        <p>Laddar...</p>
      ) : (
        <ul>
          {rows.map(row => (
            <li key={row.id}>
              {fields.map(f => (
                <span key={`${row.id}-${f.name}`}>
                  <strong>{f.name}:</strong> {String(row[f.name])}{' '}
                </span>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}