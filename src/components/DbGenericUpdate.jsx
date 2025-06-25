import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

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

  const removeImageFromStorage = async (imageUrl, bucket) => {
    if (!imageUrl || !bucket) return
    const urlParts = imageUrl.split(`${bucket}/`)
    if (urlParts.length < 2) return
    const filePath = urlParts[1].split('?')[0]
    await supabase.storage.from(bucket).remove([filePath])
  }

  const handleRemoveImage = async (field) => {
    const bucket = field.bucket
    if (!bucket) {
      alert(`Ingen bucket angiven för fältet "${field.name}". Lägg till 'bucket' i fältdefinitionen.`)
      return
    }

    setRemoving(true)
    await removeImageFromStorage(values[field.name], bucket)
    const { data, error } = await supabase
      .from(table)
      .update({ ...values, [field.name]: '' })
      .eq('id', selectedId)
      .select()
    setResult({ data, error })
    setValues(v => ({ ...v, [field.name]: '' }))
    setRemoving(false)
    fetchRows()
  }

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0]
    const bucket = field.bucket
    if (!file || !bucket) {
      alert(`Ingen bucket angiven för fältet "${field.name}". Lägg till 'bucket' i fältdefinitionen.`)
      return
    }

    setUploading(true)

    if (values[field.name]) {
      await removeImageFromStorage(values[field.name], bucket)
    }

    const filePath = `${Date.now()}_${file.name}`
    const { error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) {
      alert('Fel vid uppladdning: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(filePath)

    const newValue = urlData.publicUrl

    const { data, error } = await supabase
      .from(table)
      .update({ ...values, [field.name]: newValue })
      .eq('id', selectedId)
      .select()

    setResult({ data, error })
    setValues(v => ({ ...v, [field.name]: newValue }))
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
              {field.type === 'file' ? (
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
                        onClick={() => handleRemoveImage(field)}
                        disabled={removing || !selectedId}
                        style={{ marginLeft: 8 }}
                      >
                        {removing ? 'Tar bort...' : 'Ta bort bild'}
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileChange(e, field)}
                        disabled={uploading || !selectedId}
                        style={{ marginLeft: 8 }}
                      />
                    </>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(e, field)}
                      disabled={uploading || !selectedId}
                      required={field.required ?? false}
                    />
                  )}
                  <input
                    name={field.name}
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
                  disabled={!selectedId}
                  required={field.required ?? false}
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
                  required={field.required ?? false}
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
