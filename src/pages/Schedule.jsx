import React from 'react'
import DbGenericRead from '../components/DbGenericRead'

export default function schedule() {
  const aboutCrudProps = {
    table: 'about',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' }
    ],
    optionLabels: ['title'],
    filter: q => q.eq('title', 'film i malmö')
  };
  return (
    <div>Schedule
      < DbGenericRead {...aboutCrudProps} />
    </div>
  )
}
