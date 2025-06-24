import React, { useState } from 'react'
import { supabase } from '../supabase'

export default function DbGenericInsert({ table, fields, storageBucket = 'public-media' }) {
  const initialValues = Object.fromEntries(
    fields.map(f => [f.name, f.type === 'checkbox' ? false : ''])
  )
  const [values, setValues] = useState(initialValues)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleChange = (e, type) => {
    const { name, value, checked } = e.target
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked
        : type === 'number' ? Number(value)
        : value
    })
  }

  // Hantera filuppladdning
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const filePath = `${Date.now()}_${file.name}`
    const { data, error } = await supabase
      .storage
      .from(storageBucket)
      .upload(filePath, file)
    setUploading(false)
    if (error) {
      alert('Fel vid uppladdning: ' + error.message)
    } else {
      // Hämta publika URL:en
      const { data: urlData } = supabase
        .storage
        .from(storageBucket)
        .getPublicUrl(filePath)
      setValues(v => ({ ...v, image_url: urlData.publicUrl }))
    }
  }

  const handleInsert = async (e) => {
    e.preventDefault()
    const insertValues = { ...values }
    // Konvertera tomma strängar till null om du vill
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
      <h3>Lägg till i {table}</h3>
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
                  required
                >
                  <option value="">Välj...</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                
                ) : field.name === 'image_url' ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  {values.image_url && (
                    <img src={values.image_url} alt="Förhandsvisning" style={{maxWidth: 100}} />
                  )}
                  <input
                    name="image_url"
                    type="text"
                    value={values.image_url}
                    onChange={e => handleChange(e, 'text')}
                    placeholder="Bildens URL"
                    readOnly
                  />
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
                  required
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