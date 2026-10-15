// The app's locale and the components' words: one setting for the whole app,
// read by every component that formats dates, times and numbers (date picker,
// number input, slider, progress, charts, stats, the format components…) or
// shows words of its own (placeholders, empty states, screen-reader labels).
//
//   import { uiLocale } from '@milktop/svelte-ui'
//   uiLocale.set('fr-FR')
//   uiLocale.set('en-GB', { table: { empty: 'No patients yet' } })
//
// - `uiLocale.locale`: a BCP 47 tag ('en-GB', 'fr-FR'); the browser's until set
// - `uiLocale.messages`: the words: the built-in list for the locale's
//   language (English and French; anything else gets English), with the
//   overrides given to `set` merged over it, so one word can change without
//   restating the rest. For another language, give them all, starting from `en`.
//
// Both are reactive. Words given straight to a component (a `placeholder`,
// `emptyText`, `label`) win over these, and a component's own `locale` prop
// over the app's. Entries that take values are functions. `uiLocale.zag(name)`
// gives Zag's own `translations` for a machine (English leaves them to Zag).
import { builtIn, en, mergeMessages } from './format/messages.js'

class UiLocale {
  #locale = $state(null)
  #overrides = $state.raw(null)
  #messages = $derived(mergeMessages(builtIn[this.locale.split('-')[0].toLowerCase()] ?? en, this.#overrides))

  // The locale in use: the one set, or the browser's.
  get locale() { return this.#locale ?? globalThis.navigator?.language ?? 'en-GB' }

  get messages() { return this.#messages }

  // The locale (and words to change); components update with them.
  set(locale, overrides = null) {
    this.#locale = locale
    this.#overrides = overrides
  }

  // Zag's own screen-reader words for one of its machines, if any.
  zag(name) { return this.#messages.zag?.[name] }
}

export const uiLocale = new UiLocale()
