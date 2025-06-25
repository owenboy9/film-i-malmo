import React from 'react'
import DbGenericRead from '../components/DbGenericRead'
import { crudConfigs } from '../components/GenericCrudProps'

export default function CurrentBoard() {
  const currentYear = new Date().getFullYear()
  const { table, fields } = crudConfigs.rope_runners
  const displayFields = fields.filter(
    f =>
      f.name === 'name' ||
      f.name === 'role' ||
      f.name === 'pronouns' ||
      f.name === 'bio' ||
      f.name === 'image_path' ||
      f.name === 'image_bucket'
  )

  return (
    <div>
      <h1>The People Behind Film i Malmö</h1>

      <h2>Board Members {currentYear}</h2>
      <DbGenericRead
        table={table}
        fields={displayFields}
        filter={query => query.eq('board_member', true)}
        hideHeaders={true}
        renderRow={row => {
  console.log(row); // <-- Add this line
  return (
    <div>
      <div>
        {row.image_path && row.image_bucket && (
          <img
            src={`https://llslxcymbxcvwrufjaqm.supabase.co/storage/v1/object/public/${row.image_bucket}/${row.image_path}`}
            alt={row.name}
            style={{ width: 240, height: 240, objectFit: 'cover', borderRadius: '8px' }}
          />
        )}
      </div>
      <h2>{row.name}</h2>
      <h3>{row.role}</h3>
      <p>{row.pronouns}</p>
      <p>{row.bio}</p>
    </div>
  )
}}
      />

      <h2>Good to know others</h2>
      <DbGenericRead
        table={table}
        fields={displayFields}
        filter={query => query.eq('board_member', false)}
        hideHeaders={true}
      />
    </div>
  )
}