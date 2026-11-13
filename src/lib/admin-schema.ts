/** Describes each editable content table. Column names come only from here, never from user input. */

export type FieldType = 'text' | 'textarea' | 'markdown' | 'number' | 'boolean' | 'list' | 'date'

export interface Field {
  name: string
  label: string
  type: FieldType
  required?: boolean
  help?: string
}

export interface Entity {
  table: string
  label: string
  singular: string
  /** Column shown as the row title in the list view. */
  titleField: string
  /** Column shown under the title in the list view. */
  subtitleField?: string
  orderBy: string
  /** Public URL for a row, used for "View" links. */
  publicPath?: (row: Record<string, unknown>) => string
  fields: Field[]
}

const sort: Field = { name: 'sort', label: 'Order', type: 'number', help: 'Lower numbers come first.' }

export const ENTITIES = {
  'case-studies': {
    table: 'case_studies',
    label: 'Case studies',
    singular: 'case study',
    titleField: 'title',
    subtitleField: 'period',
    orderBy: 'sort, id',
    publicPath: r => `/work/${r.slug}`,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, help: 'URL: /work/<slug>' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'period', label: 'When', type: 'text', help: 'e.g. 2025 — 2026' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'result', label: 'Headline result', type: 'text' },
      { name: 'tags', label: 'Tags', type: 'list', help: 'One per line.' },
      {
        name: 'body_md',
        label: 'Body (Markdown)',
        type: 'markdown',
        help: 'Use ## Context, ## Approach (with ### sub-sections), ## Outcome, ## What I learned. Empty sections and <!-- comments --> are hidden on the site.'
      },
      sort,
      { name: 'published', label: 'Published', type: 'boolean' }
    ]
  },
  roles: {
    table: 'roles',
    label: 'Experience',
    singular: 'role',
    titleField: 'company',
    subtitleField: 'title',
    orderBy: 'sort, id',
    fields: [
      { name: 'company', label: 'Company', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'start', label: 'Start', type: 'text', help: 'e.g. Feb 2023' },
      { name: 'end', label: 'End', type: 'text', help: 'e.g. Present' },
      { name: 'url', label: 'Company URL', type: 'text' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'highlights', label: 'Highlights', type: 'list', help: 'One per line. The homepage shows the first four.' },
      { name: 'tags', label: 'Stack tags', type: 'list', help: 'One per line.' },
      sort
    ]
  },
  projects: {
    table: 'projects',
    label: 'Projects',
    singular: 'project',
    titleField: 'name',
    subtitleField: 'period',
    orderBy: 'sort, id',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'period', label: 'Period', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'details', label: 'Details', type: 'list', help: 'One per line. Shown on /projects.' },
      { name: 'tags', label: 'Tech', type: 'list', help: 'One per line.' },
      { name: 'image_url', label: 'Image URL', type: 'text', help: 'e.g. /images/yalnix.png' },
      { name: 'link_url', label: 'Link URL', type: 'text' },
      { name: 'link_label', label: 'Link label', type: 'text', help: 'e.g. Source' },
      sort
    ]
  },
  education: {
    table: 'education',
    label: 'Education',
    singular: 'school',
    titleField: 'school',
    subtitleField: 'degree',
    orderBy: 'sort, id',
    fields: [
      { name: 'school', label: 'School', type: 'text', required: true },
      { name: 'degree', label: 'Degree', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'period', label: 'Period', type: 'text' },
      sort
    ]
  },
  skills: {
    table: 'skill_groups',
    label: 'Skills',
    singular: 'skill group',
    titleField: 'name',
    orderBy: 'sort, id',
    fields: [
      { name: 'name', label: 'Group', type: 'text', required: true },
      { name: 'items', label: 'Skills', type: 'list', help: 'One per line.' },
      sort
    ]
  },
  posts: {
    table: 'posts',
    label: 'Writing',
    singular: 'post',
    titleField: 'title',
    subtitleField: 'published_at',
    orderBy: 'published_at DESC, id DESC',
    publicPath: r => `/writing/${r.slug}`,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, help: 'URL: /writing/<slug>' },
      { name: 'summary', label: 'Summary', type: 'textarea' },
      { name: 'published_at', label: 'Date', type: 'date' },
      { name: 'body_md', label: 'Body (Markdown)', type: 'markdown' },
      { name: 'published', label: 'Published', type: 'boolean', help: 'The homepage Writing section appears once a post is published.' }
    ]
  }
} satisfies Record<string, Entity>

export type EntityKey = keyof typeof ENTITIES

export function getEntity(key: string): Entity | null {
  return Object.hasOwn(ENTITIES, key) ? ENTITIES[key as EntityKey] : null
}

/** Known settings keys, in display order. Unknown keys already in the table are still editable. */
export const SETTINGS_FIELDS: Field[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'full_name', label: 'Full name', type: 'text', help: 'Used as the headshot alt text.' },
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'headline', label: 'Headline', type: 'text', help: 'Under your name on the homepage.' },
  { name: 'tagline', label: 'Tagline', type: 'textarea' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'email', label: 'Email', type: 'text' },
  { name: 'github', label: 'GitHub URL', type: 'text' },
  { name: 'linkedin', label: 'LinkedIn URL', type: 'text' },
  { name: 'resume_url', label: 'Résumé URL', type: 'text' },
  { name: 'headshot_url', label: 'Headshot URL', type: 'text' },
  { name: 'about_md', label: 'About (Markdown)', type: 'markdown', help: 'Shown first on the homepage.' },
  { name: 'intro', label: 'Intro (fallback)', type: 'textarea', help: 'Only used if About is empty.' }
]
