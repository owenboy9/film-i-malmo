import { useState } from 'react'
import DbGenericInsert from '../components/DbGenericInsert'
import DbGenericRead from '../components/DbGenericRead'
import DbGenericUpdate from '../components/DbGenericUpdate'
import DbGenericDelete from '../components/DbGenericDelete'
import {crudConfigs} from '../components/GenericCrudProps'


export default function Admin() {
  const [selectedTable, setSelectedTable] = useState('')
  const [selectedAction, setSelectedAction] = useState('')

  const renderComponent = () => {
    if (!selectedTable || !selectedAction) return null

    const props = crudConfigs[selectedTable]
    if (!props) return <p>Error: invalid table config</p>

    console.log('Rendering:', selectedAction, 'with props:', props)

    const key = `${selectedTable}-${selectedAction}`

    switch (selectedAction) {
      case 'insert':
        return <DbGenericInsert key={key} {...props} />
      case 'read':
        return <DbGenericRead key={key} {...props} />
      case 'update':
        return <DbGenericUpdate key={key} {...props} />
      case 'delete':
        return <DbGenericDelete key={key} {...props} />
      default:
        return null
    }
  }

  return (
    <div className="generic-container">
      <p>This page is for admin to handle page contents.</p>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Select table:{' '}
          <select
            value={selectedTable}
            onChange={e => {
              setSelectedTable(e.target.value)
              setSelectedAction('') // reset action on table change
            }}
          >
            <option value="">-- Choose table --</option>
            {Object.keys(crudConfigs).map(key => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedTable && (
        <div style={{ marginBottom: '1rem' }}>
          <label>
            Select action:{' '}
            <select
              value={selectedAction}
              onChange={e => setSelectedAction(e.target.value)}
            >
              <option value="">-- Choose action --</option>
              <option value="insert">Insert</option>
              <option value="read">Read</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
            </select>
          </label>
        </div>
      )}

      {renderComponent()}
    </div>
  )
}
