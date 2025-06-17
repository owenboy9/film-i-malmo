import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function DbGenericDelete({ table, fields }) {
  const [rows, setRows] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    fetchRows()
  }, [table, fields])

  const fetchRows = async () => {
    const { data, error } = await supabase
      .from(table)
      .select(['id', ...fields.map(f => f.name)].join(', '))
      .order('id', { ascending: false })
    if (!error) setRows(data)
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase
      .from(table)
      .delete()
      .eq('id', selectedId)
      .select()
    setResult({ data, error })
    setLoading(false)
    setSelectedId('')
    fetchRows()
  }

  return (
    <div>
      <h3>Ta bort i {table}</h3>
      <form onSubmit={handleDelete}>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          required
        >
          <option value="">Välj rad att ta bort...</option>
          {rows.map(row => (
            <option key={row.id} value={row.id}>
              {fields.map(f => row[f.name]).join(' | ')}
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