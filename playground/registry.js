// The playground's pages. Each lists the component files its API panel reads,
// and its examples are whatever is in examples/<slug>/ (sorted by file name),
// so nothing here needs updating when a component or example changes.

const sources = import.meta.glob('../src/**/*.svelte', { query: '?raw', import: 'default', eager: true })
const modules = import.meta.glob('./examples/**/*.svelte', { eager: true })
const raws = import.meta.glob('./examples/**/*.svelte', { query: '?raw', import: 'default', eager: true })

export const groups = [
  { heading: 'Actions', pages: [
    { slug: 'button', title: 'Button', icon: 'lucide:mouse-pointer-click', files: ['button/Button.svelte'] },
  ] },
  { heading: 'Forms', pages: [
    { slug: 'input', title: 'Input', icon: 'lucide:text-cursor-input', files: ['input/Input.svelte'] },
    { slug: 'select', title: 'Select', icon: 'lucide:chevrons-up-down', files: ['select/Select.svelte'] },
    { slug: 'date-picker', title: 'Date picker', icon: 'lucide:calendar', files: ['date-picker/DatePicker.svelte'] },
    { slug: 'field', title: 'Field', icon: 'lucide:form', files: ['field/Field.svelte', 'field/Fields.svelte'] },
  ] },
  { heading: 'Layout', pages: [
    { slug: 'card', title: 'Card', icon: 'lucide:square', files: ['card/Card.svelte'] },
    { slug: 'page', title: 'Page', icon: 'lucide:panel-top', files: ['page/Page.svelte'] },
    { slug: 'sidebar', title: 'Sidebar', icon: 'lucide:panel-left', files: ['sidebar/Sidebar.svelte', 'sidebar/NavSection.svelte', 'sidebar/NavItem.svelte'] },
  ] },
]

export const pages = groups.flatMap((group) => group.pages)

export const sourceOf = (file) => sources[`../src/${file}`] ?? ''

// An example's title and description come from its leading comment:
// <!-- Title
//   What it shows. -->
export function examplesOf(slug) {
  return Object.keys(modules)
    .filter((path) => path.startsWith(`./examples/${slug}/`))
    .sort()
    .map((path) => {
      const raw = raws[path]
      const comment = raw.match(/^<!--\s*([\s\S]*?)\s*-->\n?/)
      const [title, ...rest] = (comment?.[1] ?? '').split('\n')
      return {
        path,
        component: modules[path].default,
        title,
        description: rest.map((line) => line.trim()).join(' '),
        code: (comment ? raw.slice(comment[0].length) : raw).trim(),
      }
    })
}
