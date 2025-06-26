import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function DbGenericRead({ table, fields = [], filter, hideHeaders = false, renderRow }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)

  const SUPABASE_URL = 'https://llslxcymbxcvwrufjaqm.supabase.co'

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
  const { name, bucketField, bucket } = field

  // If this is a file/image field
  if (name.endsWith('_path')) {
    // Use the bucketField from the field definition, fallback to 'image_bucket'
    const bucketCol = bucketField || name.replace('_path', '_bucket')
    const bucketName = row[bucketCol] || bucket // fallback to static bucket if present
    const path = row[name]

    if (bucketName && path) {
      const fullUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucketName}/${path}`
      return (
        <img
          src={fullUrl}
          alt={row.name || 'image'}
          style={{ maxWidth: 300, width: '100%', height: 'auto'}}
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
      {/* ...loading/error logic... */}
      <ul className="db-generic-read">
        {rows.map(row => (
          <li key={row.id}>
            {renderRow
              ? renderRow(row)
              : fields.map(f => (
                  <span key={`${row.id}-${f.name}`} style={{ display: 'block' }}>
                    {!hideHeaders && (
                      <>
                        <strong>{f.name}:</strong>{' '}
                      </>
                    )}
                    {renderFieldValue(row, f)}
                  </span>
                ))}
          </li>
        ))}
      </ul>
    </div>
  )
}
