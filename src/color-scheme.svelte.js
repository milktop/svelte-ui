// Light, dark or system colour scheme for the whole page:
//
//   import { colorScheme } from '@milktop/svelte-ui'
//   colorScheme.value = 'dark'          // 'light', 'dark' or 'system'
//   colorScheme.dark                    // what's showing: true or false
//
// Both are reactive: read them in markup or an $effect. It puts `dark` on
// <html> (the theme's dark tokens apply under it) and sets `color-scheme`
// there for native controls and scrollbars. 'system' follows the OS setting
// live. The choice is saved in localStorage (`storageKey`) and kept in step
// across tabs.
const schemes = ['light', 'dark', 'system']
const parse = (scheme) => (schemes.includes(scheme) ? scheme : 'system')

class ColorScheme {
  #key = 'ui-color-scheme'
  #value = $state('system')
  #systemDark = $state(false)

  constructor() {
    if (typeof document === 'undefined') return
    const media = matchMedia('(prefers-color-scheme: dark)')
    this.#systemDark = media.matches
    media.addEventListener('change', (e) => {
      this.#systemDark = e.matches
      this.#apply()
    })
    addEventListener('storage', (e) => {
      if (e.key !== this.#key) return
      this.#value = parse(e.newValue)
      this.#apply()
    })
    this.#value = this.#load()
    this.#apply()
  }

  get storageKey() { return this.#key }
  // Set it before the page reads a value (it reloads the saved choice).
  set storageKey(key) {
    this.#key = key
    this.#value = this.#load()
    this.#apply()
  }

  get value() { return this.#value }
  set value(scheme) {
    scheme = parse(scheme)
    if (scheme === this.#value) return
    this.#value = scheme
    try { localStorage.setItem(this.#key, scheme) } catch {}
    this.#apply()
  }

  get dark() { return this.#value === 'dark' || (this.#value === 'system' && this.#systemDark) }

  #load() {
    try { return parse(localStorage.getItem(this.#key)) } catch { return 'system' }
  }

  #apply() {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('dark', this.dark)
    root.style.colorScheme = this.dark ? 'dark' : 'light'
  }
}

export const colorScheme = new ColorScheme()
