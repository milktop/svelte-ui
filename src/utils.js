import { getContext, setContext } from 'svelte'

// Joins the truthy class names (nested arrays too).
export const cx = (...names) => names.flat(Infinity).filter(Boolean).join(' ') || undefined

// A component's parts carry Zag-style data-scope and data-part attributes,
// which the library's CSS targets, so a part never matches another
// component's rules (a Card's heading inside a Page), and the library adds no
// classes of its own to collide with yours or Tailwind's. Each part also gets
// the caller's classes for it, from the `classes` prop, keyed by camelCased
// part name:
//
//   const part = partsOf('date-picker', () => classes)
//   <button {...part('view-trigger')}>   // classes={{ viewTrigger: '…' }}
//
// On a Zag element spread it first: Zag's own data-part then wins.
const camel = (name) => name.replace(/-(\w)/g, (_, c) => c.toUpperCase())
export const partsOf = (scope, classes) => (name) => ({
  'data-scope': scope,
  'data-part': name,
  class: cx(classes()?.[camel(name)]),
})

// Field context: a Field provides its ids and state; the controls inside it
// (Input, Select, DatePicker…) skip their own label and point at its.
const FIELD = Symbol('ui-field')
export const provideField = (field) => setContext(FIELD, field)
export const useField = () => getContext(FIELD) ?? null

// The attributes that describe a control by its field: spread them last, so
// they win over Zag's own.
export function fieldAttrs(field) {
  if (!field) return {}
  return {
    'aria-describedby': field.describedBy,
    'aria-invalid': field.invalid ? 'true' : undefined,
  }
}

// App shell context: the shell provides its state (rail, mobile, the drawer)
// and toggle(); the sidebar, top bar and nav items adapt to it.
const SHELL = Symbol('ui-shell')
export const provideShell = (shell) => setContext(SHELL, shell)
export const useShell = () => getContext(SHELL) ?? null

// Sidebar context: for accordion groups (one open at a time).
const SIDEBAR = Symbol('ui-sidebar')
export const provideSidebar = (sidebar) => setContext(SIDEBAR, sidebar)
export const useSidebar = () => getContext(SIDEBAR) ?? null
