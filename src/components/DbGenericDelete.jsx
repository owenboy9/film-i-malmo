import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const STORAGE_BUCKET = 'public-media' // byt till din bucket om du har en annan

export default function DbGenericDelete({ table, fields, optionLabels = [] }) {
  const [rows, setRows] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [search, setSearch] = useState('');

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

  const filteredRows = rows.filter(row =>
  optionLabels.length > 0
    ? optionLabels.some(label =>
        String(row[label] ?? '')
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : fields.some(f =>
        String(row[f.name] ?? '')
          .toLowerCase()
          .includes(search.toLowerCase())
      )
);

  // Hjälpfunktion för att ta bort bild från Storage
  const removeImageFromStorage = async (imageUrl) => {
    if (!imageUrl) return
    // Extrahera path efter bucket-namnet
    const urlParts = imageUrl.split(`${STORAGE_BUCKET}/`)
    if (urlParts.length < 2) return
    const filePath = urlParts[1].split('?')[0]
    await supabase.storage.from(STORAGE_BUCKET).remove([filePath])
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Hämta raden som ska tas bort för att få ev. image_url
    const row = rows.find(r => String(r.id) === String(selectedId))
    if (row && row.image_url) {
      await removeImageFromStorage(row.image_url)
    }
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