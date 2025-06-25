import { useState } from 'react'
import DbGenericInsert from '../components/DbGenericInsert'
import DbGenericRead from '../components/DbGenericRead'
import DbGenericUpdate from '../components/DbGenericUpdate'
import DbGenericDelete from '../components/DbGenericDelete'
import {crudConfigs} from '../components/GenericCrudProps'

// const crudConfigs = {
//   about: {
//     table: 'about',
//     fields: [
//       { name: 'title', type: 'text' },
//       { name: 'description', type: 'text' }
//     ],
//     optionLabels: ['title']
//   },
//   collaborators: {
//     table: 'collaborators',
//     fields: [
//       { name: 'name', type: 'text' },
//       { name: 'partnership_type', type: 'select', options: ['sponsor', 'collaborator'] },
//       { name: 'logo_path', type: 'file', bucket: 'public-media', bucketField: 'logo_bucket', required: false }
//     ],
//     optionLabels: ['name']
//   },
//   events: {
//     table: 'events',
//     fields: [
//       { name: 'title', type: 'text' },
//       { name: 'image_path', type: 'file', bucket: 'public-media', bucketField: 'image_bucket', required: false },
//       { name: 'starts_at', type: 'timestamp' },
//       { name: 'genre', type: 'text', required: false },
//       { name: 'short_description', type: 'text' },
//       { name: 'long_description', type: 'text' },
//       { name: 'director', type: 'text' },
//       { name: 'country', type: 'text' },
//       { name: 'year', type: 'integer' },
//       { name: 'length', type: 'integer' },
//       { name: 'language', type: 'text' },
//       { name: 'subtitles', type: 'text', required: false },
//       { name: 'age_restriction', type: 'integer', required: false },
//       { name: 'content_warning', type: 'text', required: false }
//     ],
//     optionLabels: ['title']
//   },
//   page_content: {
//     table: 'page_content',
//     fields: [
//       { name: 'page', type: 'select', options: ['press', 'freescreen', 'annual-meeting', 'banner', 'current_board', 'cafe', 'projects', 'about', 'home', 'more'], required: true },
//       { name: 'large_title', type: 'text', required: false },
//       { name: 'small_title_1', type: 'text', required: false },
//       { name: 'description_1', type: 'text', required: false },
//       { name: 'link_name_1', type: 'text', required: false },
//       { name: 'link_1', type: 'text', required: false },
//       { name: 'small_title_2', type: 'text', required: false },
//       { name: 'description_2', type: 'text', required: false },
//       { name: 'link_name_2', type: 'text', required: false },
//       { name: 'link_2', type: 'text', required: false },
//       { name: 'small_title_3', type: 'text', required: false },
//       { name: 'description_3', type: 'text', required: false },
//       { name: 'link_name_3', type: 'text', required: false },
//       { name: 'link_3', type: 'text', required: false },
//       { name: 'img_path', type: 'file', bucket: 'public-media', bucketField: 'img_bucket',required: false }
//     ],
//     optionLabels: ['page']
//   },
//   projects: {
//     table: 'projects',
//     fields: [
//       { name: 'title', type: 'text' },
//       { name: 'description', type: 'text' },
//       { name: 'starts', type: 'date' },
//       { name: 'ends', type: 'date' },
//     ],
//     optionLabels: ['title']
//   },
//   rope_runners: {
//     table: 'rope_runners',
//     fields: [
//       { name: 'name', type: 'text' },
//       { name: 'role', type: 'text' },
//       { name: 'pronouns', type: 'text' },
//       { name: 'bio', type: 'text' },
//       {
//         name: 'board_member',
//         type: 'select',
//         options: [
//           { label: 'yes', value: true },
//           { label: 'no', value: false }
//         ]
//       },
//       { name: 'photo_path', type: 'file', bucket: 'public-media', bucketField: 'photo_bucket', required: false }
//     ],
//     optionLabels: ['name']
//   }
// }

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
    <div>
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
