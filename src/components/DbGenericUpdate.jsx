import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function DbGenericUpdate({ table, fields, optionLabels = [] }) {
  const [rows, setRows] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [values, setValues] = useState({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [search, setSearch] = useState('')
  const [uploadingField, setUploadingField] = useState(null)

  useEffect(() => {
    fetchRows()
  }, [table, fields])

  const fetchRows = async () => {
    const allFieldNames = [
      'id',
      ...fields.map(f => f.name),
      ...fields.filter(f => f.bucket).map(f => f.name.replace('_path', '_bucket'))
    ]

    const { data, error } = await supabase
      .from(table)
      .select(allFieldNames.join(', '))
      .order('id', { ascending: false })

    if (!error) setRows(data || [])
  }

  useEffect(() => {
    if (!selectedId) return
    const row = rows.find(r => String(r.id) === String(selectedId))
    if (row) {
      const init = {}
      fields.forEach(f => {
        init[f.name] = row[f.name]
        if (f.bucket) {
          init[f.name.replace('_path', '_bucket')] = row[f.name.replace('_path', '_bucket')]
        }
      })
      setValues(init)
    }
  }, [selectedId, rows, fields])

  const handleChange = (e, type) => {
    const { name, value, checked } = e.target
    let val = value

    if (type === 'checkbox') {
      val = checked
    } else if (type === 'number') {
      val = value === '' ? '' : Number(value)
    } else if (type === 'select' && (value === 'true' || value === 'false')) {
      val = value === 'true'
    }

    setValues(prev => ({ ...prev, [name]: val }))
  }

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return

    const bucket = field.bucket
    if (!bucket) {
      alert(`Missing 'bucket' for field "${field.name}".`)
      return
    }

    const bucketFieldName = field.name.replace('_path', '_bucket')
    const filePath = `${Date.now()}_${file.name}`

    setUploadingField(field.name)

    if (values[field.name]) {
      await supabase.storage.from(bucket).remove([values[field.name]])
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    setUploadingField(null)

    if (uploadError) {
      alert('Upload error: ' + uploadError.message)
      return
    }

    const updateValues = {
      [field.name]: filePath,
      [bucketFieldName]: bucket
    }

    const { data, error } = await supabase
      .from(table)
      .update(updateValues)
      .eq('id', selectedId)
      .select()

    setResult({ data, error })
    setValues(prev => ({
      ...prev,
      ...updateValues
    }))
    fetchRows()
  }

  const handleRemoveImage = async (field) => {
    const path = values[field.name]
    const bucket = values[field.name.replace('_path', '_bucket')]
    if (!path || !bucket) return

    await supabase.storage.from(bucket).remove([path])

    const updateValues = {
      [field.name]: null,
      [field.name.replace('_path', '_bucket')]: null
    }

    const { data, error } = await supabase
      .from(table)
      .update(updateValues)
      .eq('id', selectedId)
      .select()

    setResult({ data, error })
    setValues(prev => ({
      ...prev,
      ...updateValues
    }))
    fetchRows()
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    const updateData = { ...values }
    for (const key in updateData) {
      if (updateData[key] === '') updateData[key] = null
    }

    setLoading(true)
    const { data, error } = await supabase
      .from(table)
      .update(updateData)
      .eq('id', selectedId)
      .select()

    setResult({ data, error })
    setLoading(false)
    fetchRows()
  }

  const getPreviewUrl = (fieldName) => {
    const path = values[fieldName]
    const bucket = values[fieldName.replace('_path', '_bucket')]
    if (bucket && path) {
      return `https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/${bucket}/${path}`
    }
    return null
  }

  const filteredRows = rows.filter(row =>
    optionLabels.length > 0
      ? optionLabels.some(label =>
          String(row[label] ?? '').toLowerCase().includes(search.toLowerCase())
        )
      : fields.some(f =>
          String(row[f.name] ?? '').toLowerCase().includes(search.toLowerCase())
        )
  )

  return (
    <div>
      <h3>Update {table}</h3>
      <form onSubmit={handleUpdate}>
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
          <option value="">Choose row...</option>
          {filteredRows.map(row => (
            <option key={row.id} value={row.id}>
              {optionLabels.length > 0
                ? optionLabels.map(label => row[label]).join(' | ')
                : fields.map(f => row[f.name]).join(' | ')}
            </option>
          ))}
        </select>

        {selectedId && fields.map(field => (
          <div key={field.name} style={{ marginTop: 10 }}>
            <label>
              {field.name}:{' '}
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={values[field.name]}
                  onChange={e => handleChange(e, field.type)}
                  required={field.required ?? false}
                >
                  <option value="">Choose...</option>
                  {field.options.map(opt =>
                    typeof opt === 'object' ? (
                      <option key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </option>
                    ) : (
                      <option key={opt} value={opt}>{opt}</option>
                    )
                  )}
                </select>
              ) : field.type === 'file' ? (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange(e, field)}
                    disabled={uploadingField === field.name}
                  />
                  {uploadingField === field.name && <p>Uploading...</p>}

                  {getPreviewUrl(field.name) && (
                    <div>
                      <img
                        src={getPreviewUrl(field.name)}
                        alt="preview"
                        style={{ maxWidth: 100, marginTop: 8 }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(field)}
                        disabled={loading}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
              ) : field.type === 'checkbox' ? (
                <input
                  name={field.name}
                  type="checkbox"
                  checked={values[field.name] || false}
                  onChange={e => handleChange(e, field.type)}
                />
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  value={values[field.name] ?? ''}
                  onChange={e => handleChange(e, field.type)}
                  required={field.required ?? false}
                />
              )}
            </label>
          </div>
        ))}

        {selectedId && (
          <button type="submit" disabled={loading || uploadingField}>
            {loading ? 'Updating...' : 'Update'}
          </button>
        )}
      </form>

      {result && (
        <div style={{ marginTop: 16 }}>
          <strong>Result:</strong>
          <pre style={{ background: '#eee', padding: 10 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
