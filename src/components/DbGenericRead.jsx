import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function DbGenericRead({ table, fields = [], filter }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)

  // Replace with your own Supabase project ref
  const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'

  useEffect(() => {
    const fetchRows = async () => {
      if (!table || !fields || fields.length === 0) {
        setErrorMsg('Missing table name or fields for reading.')
        setLoading(false)
        return
      }

      setLoading(true)
      setErrorMsg(null)

      let query = supabase
        .from(table)
        .select(['id', ...fields.map(f => f.name)].join(', '))
        .order('id', { ascending: false })

      if (typeof filter === 'function') {
        query = filter(query)
      }

      const { data, error } = await query

      if (error) {
        console.error(`Error fetching from ${table}:`, error)
        setErrorMsg(error.message)
      } else {
        setRows(data)
      }

      setLoading(false)
    }

    fetchRows()
  }, [table, fields, filter])

  const renderFieldValue = (row, field) => {
    const { name } = field

    // Auto-detect if this is a "path" field and there's a matching bucket
    if (name.endsWith('_path')) {
      const bucketField = name.replace('_path', '_bucket')
      const bucket = row[bucketField]
      const path = row[name]

      if (bucket && path) {
        const fullUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
        return (
          <img
            src={fullUrl}
            alt={row.title || 'image'}
            style={{ maxWidth: 100, verticalAlign: 'middle' }}
          />
        )
      }
    }

    // If field is a URL, render clickable
    if (typeof row[name] === 'string' && row[name]?.startsWith('http')) {
      return (
        <a href={row[name]} target="_blank" rel="noopener noreferrer">
          {row[name]}
        </a>
      )
    }

    return String(row[name] ?? '')
  }

  return (
    <div>
      <h3>Content of {table}</h3>
      {loading ? (
        <p>Loading...</p>
      ) : errorMsg ? (
        <p style={{ color: 'red' }}>Error: {errorMsg}</p>
      ) : rows.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <ul className="db-generic-read">
          {rows.map(row => (
            <li key={row.id}>
              {fields.map(f => (
                <span key={`${row.id}-${f.name}`} style={{ display: 'block' }}>
                  <strong>{f.name}:</strong>{' '}
                  {renderFieldValue(row, f)}
                </span>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
