import DbGenericInsert from '../components/dbGenericInsert'
import DbGenericRead from '../components/dbGenericRead'
import DbGenericUpdate from '../components/dbGenericUpdate'
import DbGenericDelete from '../components/dbGenericDelete'

export default function TestDb() {
  const movieCrudProps = {
    table: 'movies',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' }
    ]
  };
  const aboutCrudProps = {
    table: 'about',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'logo_small_path', type: 'text' }
    ],
    optionLabels: ['title']
  };

  return (
    <div>TestDB
        <p>This page is for testing database connections and queries.</p>
        <p>It will be used to ensure that the database is functioning correctly.</p>
        <p>Stay tuned for updates and results from the tests!</p>
      
      <h2>Testa generisk read</h2>
      <DbGenericRead {...movieCrudProps} />
      <h2>Testa generisk insert</h2>
      <DbGenericInsert {...movieCrudProps} />
      <h2>Testa generisk update</h2>
      <DbGenericUpdate {...movieCrudProps} />
      <h2>Testa generisk delete</h2>
      <DbGenericDelete {...movieCrudProps} />

      {/* <h2>Testa generisk insert collab</h2> */}
      {/* <DbGenericRead
        table="collaborators"
        fields={ [ {name:'name', type: 'text'},
          {name:'partnership_type', type: 'partnership_type'}
        ] }
      />
      <DbGenericInsert
        table="collaborators"
        fields={ [ {name:'name', type: 'text'},
          {name:'partnership_type', type: 'select', options: ['sponsor', 'collaborator']}
        ] }
      />
      <DbGenericUpdate
        table="collaborators"
        fields={ [ {name:'name', type: 'text'}, {name:'partnership_type', type: 'select', options: ['sponsor', 'collaborator']}] }
      />
      <DbGenericDelete
        table="collaborators"
        fields={ [ {name:'name', type: 'text'}] }
      /> */}
      <DbGenericRead{...aboutCrudProps} />
      <DbGenericInsert{...aboutCrudProps} />
      <DbGenericUpdate{...aboutCrudProps} />
      <DbGenericDelete{...aboutCrudProps} />
    </div>
  )
}
