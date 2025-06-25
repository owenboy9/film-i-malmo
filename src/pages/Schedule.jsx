import React from 'react'
import DbGenericRead from '../components/DbGenericRead'
import { crudConfigs } from '../components/GenericCrudProps'

export default function Schedule() {
  const { table, fields } = crudConfigs.events

  return (
    <div>
      <h1>Schedule</h1>
      <DbGenericRead
        table={table}
        fields={fields.filter(f => f.name === 'title' || f.name === 'starts_at')}
        filter={(query) => query.gt('starts_at', new Date().toISOString())}
        hideHeaders={true} // Hide headers for a cleaner look
      />

    </div>
  )
}
