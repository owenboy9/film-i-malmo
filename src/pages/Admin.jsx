import DbGenericInsert from '../components/DbGenericInsert'
import DbGenericRead from '../components/DbGenericRead'
import DbGenericUpdate from '../components/DbGenericUpdate'
import DbGenericDelete from '../components/DbGenericDelete'

export default function Admin() {
  const aboutCrudProps = {
    table: 'about',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' }
    ],
    optionLabels: ['title']
  };

  const collaboratorsCrudProps = {
    table: 'collaborators',
    fields: [
      { name: 'name', type: 'text' },
      { name: 'partnership_type', type: 'select', options: ['sponsor', 'collaborator'] },
      { name: 'logo_path', type: 'text' },
      { name: 'logo_bucket', type: 'select', options: ['public-media', 'private-media'] }

    ],
    optionLabels: ['name']
  };

  const eventsCrudProps = {
    table: 'events',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'image_path', type: 'text' },
        { name: 'image_bucket', type: 'select', options: ['public-media', 'private-media'] },
        { name: 'starts_at', type: 'timestamp' },
        { name: 'genre', type: 'text' },
        { name: 'short_description', type: 'text' },
        { name: 'long_description', type: 'text' },
        { name: 'director', type: 'text' },
        { name: 'genre', type: 'text' },
        { name: 'country', type: 'text' },
        { name: 'year', type: 'text' },
        { name: 'year', type: 'integer' },
        { name: 'length', type: 'integer' },
        { name: 'language', type: 'text' },
        { name: 'subtitles', type: 'text' },
        { name: 'age_restriction', type: 'integer' },
        { name: 'content_warning', type: 'text' }
    ],
    optionLabels: ['event']
  };

  const page_contentCrudProps = {
    table: 'page_content',
    fields: [
      { name: 'page', type: 'select', options: ['press', 'freescreen', 'annual-meeting', 'banner', 'current_board', 'cafe', 'projects', 'about', 'home', 'more'], required: true },
      { name: 'large_title', type: 'text', required: false },
      { name: 'small_title_1', type: 'text', required: false },
      { name: 'description_1', type: 'text', required: false },
      { name: 'link_name_1', type: 'text', required: false },
      { name: 'link_1', type: 'text', required: false },
      { name: 'small_title_2', type: 'text', required: false },
      { name: 'description_2', type: 'text', required: false },
      { name: 'link_name_2', type: 'text', required: false },
      { name: 'link_2', type: 'text', required: false },
      { name: 'small_title_3', type: 'text', required: false },
      { name: 'description_3', type: 'text', required: false },
      { name: 'link_name_3', type: 'text', required: false },
      { name: 'link_3', type: 'text', required: false },
      { name: 'img_path', type: 'text', required: false },
      { name: 'img', type: 'select', options: ['public-media', 'private-media'], required: false }
    ],
    optionLabels: ['page']
  }

  return (
    <div>TestDB
        <p>This page is for admin to handle page contents.</p>
        <h3>page content</h3>
        <DbGenericDelete {...page_contentCrudProps} />
        <DbGenericInsert {...page_contentCrudProps} />
        <DbGenericRead {...page_contentCrudProps} />
        <DbGenericUpdate {...page_contentCrudProps} />
        <h3>collaborators</h3>
        <DbGenericDelete {...collaboratorsCrudProps} />
        <DbGenericInsert {...collaboratorsCrudProps} />
        <DbGenericRead {...collaboratorsCrudProps} />
        <DbGenericUpdate {...collaboratorsCrudProps} />
        <h3>events</h3>
        <DbGenericDelete {...eventsCrudProps} />
        <DbGenericInsert {...eventsCrudProps} />
        <DbGenericRead {...eventsCrudProps} />
        <DbGenericUpdate {...eventsCrudProps} />
        <h3>about</h3>
        <DbGenericRead {...aboutCrudProps} />
        <DbGenericInsert {...aboutCrudProps} />
        <DbGenericUpdate {...aboutCrudProps} />
        <DbGenericDelete {...aboutCrudProps} />
    </div>
  )
}
