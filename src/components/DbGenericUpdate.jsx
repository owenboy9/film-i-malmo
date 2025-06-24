import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const STORAGE_BUCKET = 'public-media'

export default function DbGenericUpdate({ table, fields, optionLabels = [] }) {
  const [rows, setRows] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)

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

  useEffect(() => {
    if (!selectedId) return
    // Jämför id som strängar för att alltid hitta rätt rad
    const row = rows.find(r => String(r.id) === String(selectedId))
    if (row) {
      setValues(fields.reduce((acc, f) => ({ ...acc, [f.name]: row[f.name] }), {}))
    }
  }, [selectedId, rows, fields])

  const handleChange = (e, type) => {
    const { name, value, checked } = e.target
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked
        : type === 'number' ? Number(value)
        : value
    })
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

  // Ta bort bild från Storage och tabell
  const handleRemoveImage = async () => {
    setRemoving(true)
    await removeImageFromStorage(values.image_url)
    // Uppdatera raden i databasen
    const { data, error } = await supabase
      .from(table)
      .update({ ...values, image_url: '' })
      .eq('id', selectedId)
      .select()
    setResult({ data, error })
    setValues(v => ({ ...v, image_url: '' }))
    setRemoving(false)
    fetchRows()
  }

  // Ladda upp ny bild och ersätt ev. gammal
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    // Ta bort gammal bild om den finns
    if (values.image_url) await removeImageFromStorage(values.image_url)
    // Ladda upp ny bild
    const filePath = `${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file)
    if (uploadError) {
      alert('Fel vid uppladdning: ' + uploadError.message)
      setUploading(false)
      return
    }
    // Hämta publika URL:en
    const { data: urlData } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)
    // Uppdatera raden i databasen
    const { data, error } = await supabase
      .from(table)
      .update({ ...values, image_url: urlData.publicUrl })
      .eq('id', selectedId)
      .select()
    setResult({ data, error })
    setValues(v => ({ ...v, image_url: urlData.publicUrl }))
    setUploading(false)
    fetchRows()
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase
      .from(table)
      .update(values)
      .eq('id', selectedId)
      .select()
    setResult({ data, error })
    setLoading(false)
    fetchRows()
  }

  // --- Sökfunktion ---
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
  )

  return (
    <div>
      <h3>Uppdatera i {table}</h3>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Sök..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          required
        >
          <option value="">Välj rad...</option>
          {filteredRows.map(row => (
            <option key={row.id} value={row.id}>
              {optionLabels.length > 0
                ? optionLabels.map(label => row[label]).join(' | ')
                : fields.map(f => row[f.name]).join(' | ')
              }
            </option>
          ))}
        </select>
        {fields.map(field => (
          <div key={field.name}>
            <label>
              {field.name}:{' '}
              {field.name === 'image_url' ? (
                <div>
                  {values[field.name] ? (
                    <>
                      <img
                        src={values[field.name]}
                        alt="Förhandsvisning"
                        style={{ maxWidth: 100, verticalAlign: 'middle' }}
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={removing || !selectedId}
                        style={{ marginLeft: 8 }}
                      >
                        {removing ? 'Tar bort...' : 'Ta bort bild'}
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading || !selectedId}
                        style={{ marginLeft: 8 }}
                      />
                    </>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading || !selectedId}
                    />
                  )}
                  <input
                    name="image_url"
                    type="text"
                    value={values[field.name] ?? ''}
                    onChange={e => handleChange(e, 'text')}
                    placeholder="Bildens URL"
                    disabled={!selectedId}
                    readOnly
                    style={{ marginLeft: 8 }}
                  />
                </div>
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={values[field.name] ?? ''}
                  onChange={e => handleChange(e, field.type)}
                  required
                  disabled={!selectedId}
                >
                  <option value="">Välj...</option>
                  {field.options && field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <input
                  name={field.name}
                  type="checkbox"
                  checked={!!values[field.name]}
                  onChange={e => handleChange(e, field.type)}
                  disabled={!selectedId}
                />
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  value={values[field.name] ?? ''}
                  onChange={e => handleChange(e, field.type)}
                  required
                  disabled={!selectedId}
                />
              )}
            </label>
          </div>
        ))}
        <button type="submit" disabled={loading || !selectedId}>
          {loading ? 'Uppdaterar...' : 'Uppdatera'}
        </button>
      </form>
      <pre>{result && JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}