import React from 'react'
import DbInsert from '../components/dbInsert'
import DbRead from '../components/dbRead'
import DbUpdate from '../components/dbUpdate'
import DbDelete from '../components/dbDelete'
import DbGenericInsert from '../components/dbGenericInsert'
import DbGenericRead from '../components/dbGenericRead'
import DbGenericUpdate from '../components/dbGenericUpdate'
import DbGenericDelete from '../components/dbGenericDelete'

export default function TestDb() {
  return (
    <div>TestDB
        <p>This page is for testing database connections and queries.</p>
        <p>It will be used to ensure that the database is functioning correctly.</p>
        <p>Stay tuned for updates and results from the tests!</p>
        <DbRead />
        <DbInsert />
        <DbUpdate />
        <DbDelete />
              <h2>Testa generisk insert</h2>
      <DbGenericInsert
        table="movies"
        fields={[
          { name: 'title', type: 'text' },
          { name: 'description', type: 'text' }
        ]}
      />
              <h2>Testa generisk read</h2>
      <DbGenericRead
        table="movies"
        fields={[
          { name: 'title', type: 'text' },
          { name: 'description', type: 'text' }
        ]}
      />
              <h2>Testa generisk update</h2>
      <DbGenericUpdate
        table="movies"
        fields={[
          { name: 'title', type: 'text' },
          { name: 'description', type: 'text' }
        ]}
      />
              <h2>Testa generisk delete</h2>
      <DbGenericDelete
        table="movies"
        fields={[
          { name: 'title', type: 'text' },
          { name: 'description', type: 'text' }
        ]}
      />
    </div>
  )
}
