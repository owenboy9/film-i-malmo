import React, { useState } from 'react'
import DbGenericInsert from '../components/DbGenericInsert'
import DbGenericRead from '../components/DbGenericRead'
import DbGenericUpdate from '../components/DbGenericUpdate'
import DbGenericDelete from '../components/DbGenericDelete'
import '../styles/TestDb.css'

export default function TestDb() {
  const movieCrudProps = {
    table: 'movies',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'image_url', type: 'text' }
    ]
  };
  const movieCrudProps1 = {
    table: 'movies',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'image_url', type: 'text' }
    ],
    filter: q => q.gte('created_at', new Date().toISOString().slice(0, 10))
  };
  const movieCrudProps2 = {
    table: 'movies',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'image_url', type: 'text' }
    ],
    filter: q => q.lt('created_at', new Date().toISOString().slice(0, 10))
  };
  const aboutCrudProps = {
    table: 'about',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' }
    ],
    optionLabels: ['title']
  };

    // Map för dina olika alternativ
  const optionsMap = {
    option0: movieCrudProps,
    option1: movieCrudProps1,
    option2: movieCrudProps2,
    option3: aboutCrudProps
  }

  // State för vald option
  const [selectedOption, setSelectedOption] = useState('option0')

  return (
    <div>TestDB
        <p>This page is for testing database connections and queries.</p>
        <p>It will be used to ensure that the database is functioning correctly.</p>
        <p>Stay tuned for updates and results from the tests!</p>
      
      {/* <h2>Testa generisk read</h2>
      <DbGenericRead {...movieCrudProps} />
      <h2>Testa generisk read med filter skapad idag och framåt</h2>
      <DbGenericRead {...movieCrudProps1} />
      <h2>Testa generisk read med filter skapad igår eller tidigare</h2>
      <DbGenericRead {...movieCrudProps2} />
      <h2>Testa generisk insert</h2>
      <DbGenericInsert {...movieCrudProps} />
      <h2>Testa generisk update</h2>
      <DbGenericUpdate {...movieCrudProps} />
      <h2>Testa generisk delete</h2>
      <DbGenericDelete {...movieCrudProps} /> */}

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
      <p>------------------------------------------------------------------------</p>
      <label>
        Välj dataset:&nbsp;
        <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
          <option value="option0">Alla filmer</option>
          <option value="option1">Filmer skapade idag och framåt</option>
          <option value="option2">Filmer skapade före idag</option>
          <option value="option3">About</option>
        </select>
      </label>

      <h2>Testa generisk read</h2>
      <DbGenericRead {...optionsMap[selectedOption]} />
      <h2>Testa generisk insert</h2>
      <DbGenericInsert {...optionsMap[selectedOption]} />
      <h2>Testa generisk update</h2>
      <DbGenericUpdate {...optionsMap[selectedOption]} />
      <h2>Testa generisk delete</h2>
      <DbGenericDelete {...optionsMap[selectedOption]} />
<p>------------------------------------------------------------------------</p>
      {/* <DbGenericRead{...aboutCrudProps} />
      <DbGenericInsert{...aboutCrudProps} />
      <DbGenericUpdate{...aboutCrudProps} />
      <DbGenericDelete{...aboutCrudProps} /> */}
    </div>
  )
}
