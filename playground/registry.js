// The playground's pages, each listing the component files its API panel reads,
// and its examples are whatever is in examples/<slug>/ (sorted by file name),
// so nothing here needs updating when a component or example changes.

const sources = import.meta.glob('../src/**/*.svelte', { query: '?raw', import: 'default', eager: true })
const modules = import.meta.glob('./examples/**/*.svelte', { eager: true })
const raws = import.meta.glob('./examples/**/*.svelte', { query: '?raw', import: 'default', eager: true })

// Pages without examples yet are left out of the nav.
const all = [
  { heading: 'Actions', icon: 'lucide:mouse-pointer-click', pages: [
    { slug: 'button', title: 'Button', about: 'Variants, sizes, icons, loading and counts', files: ['button/Button.svelte'] },
    { slug: 'copy-button', title: 'Copy button', about: 'Copy text with feedback', files: ['copy-button/CopyButton.svelte'] },
  ] },
  { heading: 'Display', icon: 'lucide:layout-grid', pages: [
    { slug: 'avatar', title: 'Avatar', about: 'Images with initials fallback', files: ['avatar/Avatar.svelte'] },
    { slug: 'badge', title: 'Badge', about: 'Statuses and counts', files: ['badge/Badge.svelte'] },
    { slug: 'card', title: 'Card', about: 'A surface with a header and footer', files: ['card/Card.svelte'] },
    { slug: 'table', title: 'Table', about: 'Sorting, selection, paging', files: ['table/Table.svelte', 'pagination/Pagination.svelte'] },
    { slug: 'data-list', title: 'Data list', about: 'Labels and values', files: ['data-list/DataList.svelte'] },
    { slug: 'stat', title: 'Stat', about: 'Headline numbers and trends', files: ['stat/Stat.svelte', 'stat/Stats.svelte'] },
    { slug: 'charts', title: 'Charts', about: 'Area, bar and sparklines', files: ['chart/AreaChart.svelte', 'chart/BarChart.svelte', 'chart/Sparkline.svelte'] },
    { slug: 'timeline', title: 'Timeline', about: 'Events down a line', files: ['timeline/Timeline.svelte'] },
  ] },
  { heading: 'Feedback', icon: 'lucide:bell', pages: [
    { slug: 'alert', title: 'Alert', about: 'Messages in the page', files: ['alert/Alert.svelte'] },
    { slug: 'banner', title: 'Banner', about: 'Announcements across the page', files: ['banner/Banner.svelte'] },
    { slug: 'progress', title: 'Progress', about: 'Bars and circles', files: ['progress/Progress.svelte'] },
    { slug: 'skeleton', title: 'Skeleton', about: 'Loading placeholders', files: ['skeleton/Skeleton.svelte'] },
    { slug: 'spinner', title: 'Spinner', about: 'Short waits', files: ['spinner/Spinner.svelte'] },
    { slug: 'empty-state', title: 'Empty state', about: 'Nothing here yet', files: ['empty-state/EmptyState.svelte'] },
  ] },
  { heading: 'Inputs', form: true, icon: 'lucide:text-cursor-input', pages: [
    { slug: 'input', title: 'Input', about: 'Text and numbers, with icons and affixes', files: ['input/Input.svelte'] },
    { slug: 'password-input', title: 'Password input', about: 'Show or hide what was typed', files: ['password-input/PasswordInput.svelte'] },
    { slug: 'number-input', title: 'Number input', about: 'Step buttons, arrow keys, limits and formatting', files: ['number-input/NumberInput.svelte'] },
    { slug: 'textarea', title: 'Textarea', about: 'Grows with its content', files: ['textarea/Textarea.svelte'] },
    { slug: 'editor', title: 'Editor', about: 'Rich text on TipTap', files: ['editor/Editor.svelte'] },
    { slug: 'tags-input', title: 'Tags input', about: 'Type, press Enter, get a tag', files: ['tags-input/TagsInput.svelte'] },
    { slug: 'pin-input', title: 'Pin input', about: 'One box per character, for codes', files: ['pin-input/PinInput.svelte'] },
    { slug: 'slider', title: 'Slider', about: 'A number or a range', files: ['slider/Slider.svelte'] },
    { slug: 'file-upload', title: 'File upload', about: 'Drop or browse, with previews', files: ['file-upload/FileUpload.svelte'] },
    { slug: 'attachments', title: 'Attachments', about: 'Files added to a page or form', files: ['attachments/Attachments.svelte'] },
  ] },
  { heading: 'Pickers', form: true, icon: 'lucide:list-checks', pages: [
    { slug: 'select', title: 'Select', about: 'Pick one or several; search, load or create', files: ['select/Select.svelte'] },
    { slug: 'date-picker', title: 'Date picker', about: 'Type a date or pick it from a calendar', files: ['date-picker/DatePicker.svelte'] },
  ] },
  { heading: 'Choices', form: true, icon: 'lucide:circle-check', pages: [
    { slug: 'checkbox', title: 'Checkbox', about: 'On its own or in a group', files: ['checkbox/Checkbox.svelte', 'checkbox/CheckboxGroup.svelte'] },
    { slug: 'radio-group', title: 'Radio group', about: 'Pick one, with descriptions', files: ['radio-group/RadioGroup.svelte'] },
    { slug: 'switch', title: 'Switch', about: 'On or off', files: ['switch/Switch.svelte'] },
    { slug: 'segmented', title: 'Segmented', about: 'A row of options with a sliding indicator', files: ['segmented/Segmented.svelte'] },
    { slug: 'theme-toggle', title: 'Theme toggle', about: 'Light, dark or the OS setting', files: ['theme-toggle/ThemeToggle.svelte'] },
  ] },
  { heading: 'Forms', icon: 'lucide:clipboard-list', pages: [
    { slug: 'field', title: 'Field', about: 'Labels, hints and errors, on a grid', files: ['field/Field.svelte', 'field/Fields.svelte'] },
  ] },
  { heading: 'Navigation', icon: 'lucide:compass', pages: [
    { slug: 'app-shell', title: 'App shell', about: 'Sidebar, top bar and page, flat or inset', files: ['app-shell/AppShell.svelte', 'app-shell/Topbar.svelte'] },
    { slug: 'sidebar', title: 'Sidebar', about: 'Sections, groups and items', files: ['sidebar/Sidebar.svelte', 'sidebar/NavSection.svelte', 'sidebar/NavGroup.svelte', 'sidebar/NavItem.svelte'] },
    { slug: 'page', title: 'Page', about: 'A heading, actions and content', files: ['page/Page.svelte'] },
    { slug: 'breadcrumbs', title: 'Breadcrumbs', about: 'Where the page sits, with folding', files: ['breadcrumbs/Breadcrumbs.svelte'] },
    { slug: 'command', title: 'Command menu', about: '⌘K search and actions', files: ['command/Command.svelte'] },
  ] },
  { heading: 'Overlays', icon: 'lucide:layers', pages: [
    { slug: 'tooltip', title: 'Tooltip', about: 'Hints on hover and focus', files: ['tooltip/Tooltip.svelte'] },
    { slug: 'popover', title: 'Popover', about: 'A panel that opens from a trigger', files: ['popover/Popover.svelte'] },
    { slug: 'hover-card', title: 'Hover card', about: 'Previews on hover', files: ['hover-card/HoverCard.svelte'] },
    { slug: 'dialog', title: 'Dialog', about: 'Modals and confirmations', files: ['dialog/Dialog.svelte'] },
    { slug: 'sheet', title: 'Sheet', about: 'Panels that slide in from an edge', files: ['sheet/Sheet.svelte'] },
    { slug: 'action-bar', title: 'Action bar', about: 'Actions for a selection', files: ['action-bar/ActionBar.svelte'] },
    { slug: 'menu', title: 'Menu', about: 'Dropdowns and context menus', files: ['menu/Menu.svelte', 'menu/ContextMenu.svelte'] },
    { slug: 'toast', title: 'Toast', about: 'Notifications', files: ['toast/Toaster.svelte'] },
  ] },
  { heading: 'Disclosure', icon: 'lucide:chevrons-up-down', pages: [
    { slug: 'tabs', title: 'Tabs', about: 'Panels behind tabs', files: ['tabs/Tabs.svelte'] },
    { slug: 'accordion', title: 'Accordion', about: 'Expandable sections', files: ['accordion/Accordion.svelte'] },
    { slug: 'collapsible', title: 'Collapsible', about: 'A section that opens and closes', files: ['collapsible/Collapsible.svelte'] },
  ] },
]

const hasExamples = (slug) => Object.keys(modules).some((path) => path.startsWith(`./examples/${slug}/`))
export const groups = all
  .map((group) => ({ ...group, pages: group.pages.filter((page) => hasExamples(page.slug)) }))
  .filter((group) => group.pages.length)

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
        // `<n>-<name>.bare.svelte`: no card round it (it brings its own surface).
        bare: path.endsWith('.bare.svelte'),
        component: modules[path].default,
        title,
        description: rest.map((line) => line.trim()).join(' '),
        code: (comment ? raw.slice(comment[0].length) : raw).trim(),
      }
    })
}
