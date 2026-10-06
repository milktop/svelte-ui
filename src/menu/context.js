import { getContext, setContext } from 'svelte'

// A menu (or submenu) shares its Zag api with its items, child components
// and submenus. Zag's item keys are strings, so each menu maps them back to
// the original values for `onselect`.
const MENU = Symbol('ui-menu')
export const provideMenu = (menu) => setContext(MENU, menu)
export const useMenu = () => getContext(MENU) ?? null

export const labelOf = (item, key) => (typeof item === 'object' && item ? item[key] : item)
export const valueOf = (item, valueKey, labelKey) =>
  typeof item === 'object' && item ? (item[valueKey] ?? item[labelKey]) : item
export const disabledOf = (item, key) => !!(typeof item === 'object' && item && item[key])

export const isOption = (item) => typeof item === 'object' && !!item && (item.type === 'checkbox' || item.type === 'radio')
export const isSubmenu = (item) => typeof item === 'object' && !!item?.items
// Actions, as opposed to separators, group headings, submenus and options.
export const isAction = (item) => !(typeof item === 'object' && item && (item.separator || item.group || item.items || isOption(item)))

// Zag's per-item closeOnSelect for a `keepOpen` (unset follows the menu).
export const closeFor = (keepOpen) => (keepOpen == null ? undefined : !keepOpen)
