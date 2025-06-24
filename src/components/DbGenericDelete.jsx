import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const STORAGE_BUCKET = 'public-media' // byt till din bucket om du har en annan

export default function DbGenericDelete({ table, fields, optionLabels = [] }) {
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