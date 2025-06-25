export const crudConfigs = {
  about: {
    table: 'about',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' }
    ],
    optionLabels: ['title']
  },
  collaborators: {
    table: 'collaborators',
    fields: [
      { name: 'name', type: 'text' },
      { name: 'partnership_type', type: 'select', options: ['sponsor', 'collaborator'] },
      { name: 'image_path', type: 'file', bucket: 'public-media', bucketField: 'image_bucket', required: false }
    ],
    optionLabels: ['name']
  },
  events: {
    table: 'events',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'image_path', type: 'file', bucket: 'public-media', bucketField: 'image_bucket', required: false },
      { name: 'starts_at', type: 'timestamp' },
      { name: 'genre', type: 'text', required: false },
      { name: 'short_description', type: 'text' },
      { name: 'long_description', type: 'text' },
      { name: 'director', type: 'text' },
      { name: 'country', type: 'text' },
      { name: 'year', type: 'integer' },
      { name: 'length', type: 'integer' },
      { name: 'language', type: 'text' },
      { name: 'subtitles', type: 'text', required: false },
      { name: 'age_restriction', type: 'integer', required: false },
      { name: 'content_warning', type: 'text', required: false }
    ],
    optionLabels: ['title']
  },
  page_content: {
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
      { name: 'image_path', type: 'file', bucket: 'public-media', bucketField: 'image_bucket',required: false }
    ],
    optionLabels: ['page']
  },
  projects: {
    table: 'projects',
    fields: [
      { name: 'title', type: 'text' },
      { name: 'description', type: 'text' },
      { name: 'starts', type: 'date' },
      { name: 'ends', type: 'date' },
    ],
    optionLabels: ['title']
  },
  rope_runners: {
    table: 'rope_runners',
    fields: [
      { name: 'name', type: 'text' },
      { name: 'role', type: 'text' },
      { name: 'pronouns', type: 'text' },
      { name: 'bio', type: 'text' },
      {
        name: 'board_member',
        type: 'select',
        options: [
          { label: 'yes', value: true },
          { label: 'no', value: false }
        ]
      },
      { name: 'image_path', type: 'file', bucket: 'public-media', bucketField: 'image_bucket', required: false },
      // { name: 'image_bucket', type: 'text' }
    ],
    optionLabels: ['name']
  }
}