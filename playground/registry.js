// The playground's pages: each lists the component files its API panel reads,
// and its examples are whatever is in examples/<slug>/ (sorted by file name),
// so nothing here needs updating when a component or example changes.

const sources = import.meta.glob('../src/**/*.svelte', { query: '?raw', import: 'default', eager: true })
const modules = import.meta.glob('./examples/**/*.svelte', { eager: true })
const raws = import.meta.glob('./examples/**/*.svelte', { query: '?raw', import: 'default', eager: true })

export const groups = [
  { heading: 'Actions', icon: 'lucide:mouse-pointer-click', pages: [
    { slug: 'button', title: 'Button', about: 'Variants, sizes, icons, loading and counts', files: ['button/Button.svelte'] },
  ] },
  { heading: 'Inputs', form: true, icon: 'lucide:text-cursor-input', pages: [
    { slug: 'input', title: 'Input', about: 'Text and numbers, with icons and affixes', files: ['input/Input.svelte'] },
    { slug: 'textarea', title: 'Textarea', about: 'Grows with its content', files: ['textarea/Textarea.svelte'] },
    { slug: 'number-input', title: 'Number input', about: 'Step buttons, arrow keys, limits and formatting', files: ['number-input/NumberInput.svelte'] },
    { slug: 'password-input', title: 'Password input', about: 'Show or hide what was typed', files: ['password-input/PasswordInput.svelte'] },
    { slug: 'pin-input', title: 'Pin input', about: 'One box per character, for codes', files: ['pin-input/PinInput.svelte'] },
    { slug: 'tags-input', title: 'Tags input', about: 'Type, press Enter, get a tag', files: ['tags-input/TagsInput.svelte'] },
  ] },
  { heading: 'Pickers', form: true, icon: 'lucide:list-checks', pages: [
    { slug: 'select', title: 'Select', about: 'Pick one from a list, with typeahead', files: ['select/Select.svelte'] },
    { slug: 'combobox', title: 'Combobox', about: 'Type to filter, pick one or several', files: ['combobox/Combobox.svelte'] },
    { slug: 'date-picker', title: 'Date picker', about: 'Type a date or pick it from a calendar', files: ['date-picker/DatePicker.svelte'] },
  ] },
  { heading: 'Choices', form: true, icon: 'lucide:square-check', pages: [
    { slug: 'checkbox', title: 'Checkbox', about: 'On its own or in a group', files: ['checkbox/Checkbox.svelte', 'checkbox/CheckboxGroup.svelte'] },
    { slug: 'switch', title: 'Switch', about: 'On or off', files: ['switch/Switch.svelte'] },
    { slug: 'radio-group', title: 'Radio group', about: 'Pick one, with descriptions', files: ['radio-group/RadioGroup.svelte'] },
    { slug: 'segmented', title: 'Segmented', about: 'A row of options with a sliding indicator', files: ['segmented/Segmented.svelte'] },
    { slug: 'slider', title: 'Slider', about: 'A number or a range', files: ['slider/Slider.svelte'] },
  ] },
  { heading: 'Forms', icon: 'lucide:clipboard-list', pages: [
    { slug: 'field', title: 'Field', about: 'Labels, hints and errors, on a grid', files: ['field/Field.svelte', 'field/Fields.svelte'] },
    { slug: 'file-upload', title: 'File upload', about: 'Drop or browse, with previews', files: ['file-upload/FileUpload.svelte'] },
  ] },
  { heading: 'Overlays', icon: 'lucide:layers', pages: [
    { slug: 'popover', title: 'Popover', about: 'A panel that opens from a trigger', files: ['popover/Popover.svelte'] },
  ] },
  { heading: 'Layout', icon: 'lucide:layout-dashboard', pages: [
    { slug: 'card', title: 'Card', about: 'A surface with a header and footer', files: ['card/Card.svelte'] },
    { slug: 'page', title: 'Page', about: 'A heading, actions and content', files: ['page/Page.svelte'] },
    { slug: 'app-shell', title: 'App shell', about: 'Sidebar, top bar and page, flat or inset', files: ['app-shell/AppShell.svelte', 'app-shell/Topbar.svelte', 'breadcrumbs/Breadcrumbs.svelte'] },
    { slug: 'sidebar', title: 'Sidebar', about: 'Sections, groups and items', files: ['sidebar/Sidebar.svelte', 'sidebar/NavSection.svelte', 'sidebar/NavGroup.svelte', 'sidebar/NavItem.svelte'] },
  ] },
]

export const pages = groups.flatMap((group) => group.pages.map((page) => ({ ...page, group })))

export const sourceOf = (file) => sources[`../src/${file}`] ?? ''

// Pages in a `form` group show their examples on a two-column grid, so the
// examples are just the components.

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
