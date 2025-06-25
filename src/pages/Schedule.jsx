import React from 'react'
import DbGenericRead from '../components/DbGenericRead'
import { crudConfigs } from '../components/GenericCrudProps'

export default function schedule() {
  return (
    <div>Schedule
      <DbGenericRead table={crudConfigs.events} fields={crudConfigs.events} />
    </div>
  )
}
