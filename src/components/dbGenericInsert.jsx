import React, { useState } from 'react'
import { supabase } from '../supabase'

export default function DbGenericInsert({ table, fields }) {
  const initialValues = Object.fromEntries(
    fields.map(f => [f.name, f.type === 'checkbox' ? false : ''])
  )
  const [values, setValues] = useState(initialValues)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e, type) => {
    const { name, value, checked } = e.target
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked
        : type === 'number' ? Number(value)
        : value
    })
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
              {field.type === 'checkbox' ? (
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
        <button type="submit" disabled={loading}>
          {loading ? 'Lägger till...' : 'Lägg till'}
        </button>
      </form>
      <pre>{result && JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}