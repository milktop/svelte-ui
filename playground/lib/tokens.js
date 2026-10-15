// The theme's tokens, read from theme.css (the :root block, then the dark
// block's overrides), for the Tokens page and the Styling panels.
import themeSource from '../../src/theme.css?raw'

function readTokens() {
  const tokens = []
  const byName = {}
  let mode = null
  for (const line of themeSource.split('\n')) {
    if (/^\s*:root \{/.test(line)) mode = 'light'
    else if (/^\s*:root\.dark/.test(line)) mode = 'dark'
    else if (/^\s*\}/.test(line)) mode = null
    else if (mode) {
      const m = line.match(/^\s*--(ui-[\w-]+):\s*(.+);/)
      if (!m) continue
      byName[m[1]] ??= tokens[tokens.push({ name: m[1], light: '', dark: '' }) - 1]
      byName[m[1]][mode] = m[2].trim()
    }
  }
  return tokens
}

export const tokens = readTokens()
export const themeTokens = new Set(tokens.map((token) => token.name))

// Which tokens are colours (and get a swatch).
export const isColour = (name) => !/radius|font|height|width|shadow|stroke|padding|weight/.test(name)

// What each group of tokens styles; a token belongs to the first group whose
// test matches its name.
const groups = [
  { title: 'Text', about: 'Text, and secondary text (hints, labels, placeholders)', test: /^ui-(text|muted)$/ },
  { title: 'Surfaces', about: 'Cards and popups, their borders, and hovered rows and items', test: /^ui-(surface|border|hover)$/ },
  { title: 'Form controls', about: 'Inputs, selects, checkboxes and the editor: fill, border, border on hover, and the fill of an autofilled text input. Light, they follow the surface; dark, a darker fill and a stronger border', test: /^ui-field-/ },
  { title: 'App shell', about: 'The page behind cards, the inset layout’s sidebar shade and the frame round it', test: /^ui-(canvas|sidebar-bg|frame)$/ },
  { title: 'Accent', about: 'The accent’s scale (50 … 950, which the rest are steps of), primary buttons, selections, checked controls and soft tints; the text on them; focus rings; selected text and Highlight’s marks', test: /^ui-(accent|ring|selection|highlight)/ },
  { title: 'Status', about: 'Errors and destructive actions, positive changes, cautions (alerts tint themselves from these and the accent)', test: /^ui-(danger|success|warning)$/ },
  { title: 'Charts', about: 'Chart series, in order (the first follows the accent)', test: /^ui-chart-/ },
  { title: 'Loading', about: 'Skeleton placeholders', test: /^ui-skeleton$/ },
  { title: 'Shape and type', about: 'Corner rounding (cards and popups add a little), the components’ font (inherit: the app’s), and the weight of stroke icons such as Lucide’s', test: /^ui-(radius|font|icon-stroke)$/ },
  { title: 'Sizes', about: 'Buttons and inputs share these heights, so they line up in a row', test: /^ui-control-height/ },
  { title: 'Shadows', about: 'Popups, and cards at rest', test: /shadow$/ },
  { title: 'Sidebar', about: 'AppShell’s sidebar: its widths, background, text, headings and icon buttons; its items’ size, shape and colours, hovered and current; and the same in an inset layout', test: /^ui-sidebar-/ },
]

export const groupedTokens = (() => {
  const out = groups.map((group) => ({ ...group, tokens: [] }))
  const other = { title: 'Other', about: '', tokens: [] }
  for (const token of tokens) (out.find((group) => group.test.test(token.name)) ?? other).tokens.push(token)
  return [...out, other].filter((group) => group.tokens.length)
})()
