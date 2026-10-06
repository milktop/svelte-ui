// The blocks: composed examples of common app screens. Pages are one file
// each (blocks/pages/<n>-<slug>.svelte); a sections page shows every file in
// blocks/sections/<slug>/, like a component's examples.
const modules = import.meta.glob('./**/*.svelte', { eager: true })
const raws = import.meta.glob('./**/*.svelte', { query: '?raw', import: 'default', eager: true })

const sections = [
  { slug: 'headings', title: 'Page headings', icon: 'lucide:heading', about: 'Titles with actions, breadcrumbs and meta' },
  { slug: 'panels', title: 'Card panels', icon: 'lucide:panel-top', about: 'Cards holding tables and lists' },
  { slug: 'lists', title: 'Stacked lists', icon: 'lucide:rows-3', about: 'People, lessons and links in rows' },
  { slug: 'forms', title: 'Form layouts', icon: 'lucide:square-pen', about: 'Card forms, settings sections, danger zones' },
  { slug: 'feeds', title: 'Feeds', icon: 'lucide:messages-square', about: 'Notes with a composer, activity' },
  { slug: 'banners', title: 'Banners', icon: 'lucide:megaphone', about: 'Announcements, prompts and onboarding' },
]

const pageInfo = {
  dashboard: { icon: 'lucide:layout-dashboard', about: 'Stats, upcoming lessons and recent activity' },
  profile: { icon: 'lucide:id-card', about: 'A student: header, tabs, details and history' },
  detail: { icon: 'lucide:file-text', about: 'Main content beside an aside of details' },
  table: { icon: 'lucide:table', about: 'Search, filters, a selectable table and paging, in one card' },
  settings: { icon: 'lucide:settings', about: 'Form sections with a save bar' },
  'sign-in': { icon: 'lucide:log-in', about: 'A centred sign-in card' },
  'empty-states': { icon: 'lucide:inbox', about: 'First run, no results and not found' },
}

// A file's title and description come from its leading comment, as for examples.
function parse(path) {
  const raw = raws[path]
  const comment = raw.match(/^<!--\s*([\s\S]*?)\s*-->\n?/)
  const [title, ...rest] = (comment?.[1] ?? '').split('\n')
  return {
    path, title, component: modules[path].default,
    description: rest.map((line) => line.trim()).join(' '),
    code: (comment ? raw.slice(comment[0].length) : raw).trim(),
  }
}

const pageFiles = Object.keys(modules).filter((path) => path.startsWith('./pages/')).sort()

export const blocks = [
  ...sections.map((section) => ({
    ...section, group: 'Sections', kind: 'sections',
    examples: Object.keys(modules).filter((path) => path.startsWith(`./sections/${section.slug}/`)).sort().map(parse),
  })),
  ...pageFiles.map((path) => {
    const slug = path.match(/\/\d+-([\w-]+)\.svelte$/)[1]
    const page = parse(path)
    return { slug, group: 'Pages', kind: 'page', title: page.title, ...pageInfo[slug], page }
  }),
]
