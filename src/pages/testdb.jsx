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

      <h2>Testa generisk insert collab</h2>
      <DbGenericRead
        table="collaborators"
        fields={ [ {name:'name', type: 'text'},
          {name:'partnership_type', type: 'partnership_type'}
        ] }
      />
      <h5>partnership_type: sponsor/collaborator</h5>
      <DbGenericInsert
        table="collaborators"
        fields={ [ {name:'name', type: 'text'},
          {name:'partnership_type', type: 'partnership_type'}
        ] }
      />
      <DbGenericUpdate
        table="collaborators"
        fields={ [ {name:'name', type: 'text'}] }
      />
      <DbGenericDelete
        table="collaborators"
        fields={ [ {name:'name', type: 'text'}] }
      />
    </div>
  )
}
