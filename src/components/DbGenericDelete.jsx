import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const STORAGE_BUCKET = 'public-media' // Change this to your bucket name if different

export default function DbGenericDelete({ table, fields, optionLabels = [] }) {
  const [rows, setRows] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [search, setSearch] = useState('')

  // Fetch rows from the table whenever table or fields change
  useEffect(() => {
    fetchRows()
  }, [table, fields])

  // Load rows from Supabase
  const fetchRows = async () => {
    const { data, error } = await supabase
      .from(table)
      .select(['id', ...fields.map(f => f.name)].join(', '))
      .order('id', { ascending: false })
    if (!error) setRows(data)
  }

  // Filter rows for the search box, using optionLabels or fields
  const filteredRows = rows.filter(row =>
    optionLabels.length > 0
      ? optionLabels.some(label =>
          String(row[label] ?? '').toLowerCase().includes(search.toLowerCase())
        )
      : fields.some(f =>
          String(row[f.name] ?? '').toLowerCase().includes(search.toLowerCase())
        )
  )

  // Remove image from Supabase storage bucket if present
  const removeImageFromStorage = async (imageUrl) => {
    if (!imageUrl) return
    // Extract path after bucket name
    const urlParts = imageUrl.split(`${STORAGE_BUCKET}/`)
    if (urlParts.length < 2) return
    const filePath = urlParts[1].split('?')[0]
    await supabase.storage.from(STORAGE_BUCKET).remove([filePath])
  }

  // Handle delete action for selected row
  const handleDelete = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Find the row to delete
    const row = rows.find(r => String(r.id) === String(selectedId))
    
    // If row contains an image_url field, remove the image from storage
    if (row && row.image_url) {
      await removeImageFromStorage(row.image_url)
    }
    
    // Delete the row from the table
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
      <h3>delete from {table}</h3>
      <form onSubmit={handleDelete}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          required
        >
          <option value="">choose row to delete...</option>
          {filteredRows.map(row => (
            <option key={row.id} value={row.id}>
              {optionLabels.length > 0
                ? optionLabels.map(label => row[label]).join(' | ')
                : fields.map(f => row[f.name]).join(' | ')}
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
