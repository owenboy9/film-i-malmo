import React, { useState } from 'react'
import { supabase } from '../supabase'

export default function DbGenericInsert({ table, fields }) {
  // Setup initial values, but skip bucket fields since those will be set automatically when file uploads
  const initialValues = Object.fromEntries(
    fields.map(f => [f.name, f.type === 'checkbox' ? false : ''])
  )
  const [values, setValues] = useState(initialValues)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadingField, setUploadingField] = useState(null)

  const handleChange = (e, type) => {
    const { name, value, checked } = e.target
    let newValue = value

    if (type === 'checkbox') {
      newValue = checked
    } else if (type === 'number') {
      newValue = Number(value)
    } else if (type === 'select' && (value === 'true' || value === 'false')) {
      newValue = value === 'true'
    }

    setValues(prev => ({
      ...prev,
      [name]: newValue
    }))
  }

  const handleGenericFileChange = async (e, field) => {
  const file = e.target.files[0]
  if (!file) return

  const bucket = field.bucket
  if (!bucket) {
    alert(`Missing 'bucket' for field "${field.name}".`)
    return
  }

  const filePath = `${Date.now()}_${file.name}`
  setUploadingField(field.name)

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(filePath, file)

  setUploadingField(null)

  if (error) {
    alert('Upload error: ' + error.message)
  } else {
    // Figure out the bucket field name (e.g. img_path -> img_bucket)
    const bucketFieldName = field.name.replace('_path', '_bucket')

    // Check if bucketFieldName exists in fields config
    const bucketFieldExists = fields.some(f => f.name === bucketFieldName)

    // Build updated values object
    const newValues = {
      ...values,
      [field.name]: filePath
    }

    if (bucketFieldExists) {
      newValues[bucketFieldName] = bucket
    }

    setValues(newValues)
  }
}

  const handleInsert = async (e) => {
    e.preventDefault()

    const insertValues = { ...values }
    // Replace empty strings with nulls for cleaner DB
    for (const key in insertValues) {
      if (insertValues[key] === '') insertValues[key] = null
    }

    setLoading(true)
    const { data, error } = await supabase
      .from(table)
      .insert([insertValues])
      .select()

    setResult({ data, error })
    setLoading(false)

    if (!error) setValues(initialValues)
  }

  // Helper to get full URL for preview from bucket + path
  const getPreviewUrl = (fieldName) => {
    const path = values[fieldName]
    const bucket = values[`${fieldName.replace('_path', '_bucket')}`]
    if (bucket && path) {
      return `https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/${bucket}/${path}`
    }
    return null
  }

  return (
    <div>
      <h3>Add content to <code>{table}</code></h3>
      <form onSubmit={handleInsert}>
        {fields.map(field => (
          <div key={field.name} style={{ marginBottom: 12 }}>
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
                    onChange={e => handleGenericFileChange(e, field)}
                    disabled={uploadingField === field.name}
                    required={field.required ?? false}
                  />
                  {uploadingField === field.name && <p>Uploading...</p>}

                  {/* Show preview image built from bucket + path */}
                  {getPreviewUrl(field.name) && (
                    <div>
                      <img
                        src={getPreviewUrl(field.name)}
                        alt="preview"
                        style={{ maxWidth: 100, marginTop: 8 }}
                      />
                      {/* Show file path */}
                      <input
                        name={field.name}
                        type="text"
                        value={values[field.name]}
                        readOnly
                      />
                    </div>
                  )}
                </div>
              ) : field.type === 'checkbox' ? (
                <input
                  name={field.name}
                  type="checkbox"
                  checked={values[field.name]}
                  onChange={e => handleChange(e, field.type)}
                />
              ) : (
                <input
                  name={field.name}
                  type={field.type}
                  value={values[field.name]}
                  onChange={e => handleChange(e, field.type)}
                  required={field.required ?? false}
                />
              )}
            </label>
          </div>
        ))}

        <button type="submit" disabled={loading || uploadingField}>
          {loading ? 'Adding...' : 'Add'}
        </button>
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
