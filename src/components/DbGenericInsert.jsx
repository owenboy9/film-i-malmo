// DbGenericInsert.js
import React, { useState } from 'react'
import { supabase } from '../supabase'

export default function DbGenericInsert({ table, fields }) {
  const initialValues = Object.fromEntries(
    fields.map(f => [f.name, f.type === 'checkbox' ? false : ''])
  )
  const [values, setValues] = useState(initialValues)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

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

    setValues({
      ...values,
      [name]: newValue
    })
  }

  const handleGenericFileChange = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    const bucket = field.bucket
    if (!bucket) {
      alert(`Ingen bucket angiven för fältet "${field.name}". Lägg till 'bucket' i fältdefinitionen.`)
      return
    }

    setUploading(true)
    const filePath = `${Date.now()}_${file.name}`

    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file)

    setUploading(false)

    if (error) {
      alert('Fel vid uppladdning: ' + error.message)
    } else {
      const { data: urlData } = supabase
        .storage
        .from(bucket)
        .getPublicUrl(filePath)

      setValues(v => ({ ...v, [field.name]: urlData.publicUrl }))
    }
  }

  const handleInsert = async (e) => {
    e.preventDefault()
    const insertValues = { ...values }
    Object.keys(insertValues).forEach(key => {
      if (insertValues[key] === '') insertValues[key] = null
    })
    setLoading(true)
    const { data, error } = await supabase
      .from(table)
      .insert([insertValues])
      .select()
    setResult({ data, error })
    setLoading(false)
    if (!error) setValues(initialValues)
  }

  return (
    <div>
      <h3>add content to {table}</h3>
      <form onSubmit={handleInsert}>
        {fields.map(field => (
          <div key={field.name}>
            <label>
              {field.name}:{' '}
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={values[field.name]}
                  onChange={e => handleChange(e, field.type)}
                  required={field.required ?? false}
                >
                  <option value="">Välj...</option>
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
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleGenericFileChange(e, field)}
                    disabled={uploading}
                    required={field.required ?? false}
                  />
                  {values[field.name] && (
                    <>
                      <img
                        src={values[field.name]}
                        alt="Förhandsvisning"
                        style={{ maxWidth: 100, marginTop: 8 }}
                      />
                      <input
                        name={field.name}
                        type="text"
                        value={values[field.name]}
                        onChange={e => handleChange(e, 'text')}
                        readOnly
                      />
                    </>
                  )}
                </>
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
        <button type="submit" disabled={loading || uploading}>
          {loading ? 'Lägger till...' : 'Lägg till'}
        </button>
      </form>
      <pre>{result && JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
