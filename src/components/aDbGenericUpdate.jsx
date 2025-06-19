import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function DbGenericUpdate({ table, fields, optionLabels = [] }) {
  const [rows, setRows] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [values, setValues] = useState({})
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

  return (
    <div>
      <h3>Uppdatera i {table}</h3>
      <form onSubmit={handleUpdate}>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          required
        >
          <option value="">Välj rad...</option>
          {rows.map(row => (
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
              {field.type === 'select' ? (
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