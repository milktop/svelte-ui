// A component's API, read from its source: the doc comment (summary, usage
// and `- \`prop\`: …` notes), its props with defaults, which of them are
// snippets or bindable, and its parts (the part('…') calls).

export function apiOf(file, source) {
  const doc = (source.match(/^<!--([\s\S]*?)-->/)?.[1] ?? '').split('\n').map((line) => line.replace(/^ {2}/, '').trimEnd())
  while (doc[0] === '') doc.shift()
  const blank = doc.indexOf('')
  const notes = notesOf(doc)
  const snippets = new Set(Array.from(source.matchAll(/\{@render (\w+)/g), (m) => m[1]))

  const props = splitTopLevel(source.match(/let \{([\s\S]*?)\} = \$props\(\)/)?.[1] ?? '')
    .filter((entry) => entry && !entry.startsWith('...'))
    .map((entry) => {
      const [, name, local, value] = entry.match(/^(\w+)(?:\s*:\s*(\w+))?(?:\s*=\s*([\s\S]+))?$/) ?? []
      const bindable = /^\$bindable\(/.test(value ?? '')
      return {
        name,
        default: bindable ? value.replace(/^\$bindable\(([\s\S]*)\)$/, '$1') || 'undefined' : value ?? '',
        bindable,
        snippet: snippets.has(local ?? name),
        note: notes[name] ?? common[name] ?? '',
      }
    })

  return {
    tag: file.split('/').pop().replace('.svelte', ''),
    summary: doc.slice(0, blank === -1 ? doc.length : blank).join(' ').trim(),
    usage: usageOf(doc),
    props: props.filter((prop) => !prop.snippet),
    snippets: props.filter((prop) => prop.snippet).map((prop) => prop.name),
    // Its parts, as keys for the `classes` prop (the outer element is `class`).
    parts: unique(Array.from(source.matchAll(/part\('([\w-]+)'\)/g), (m) => camel(m[1]))).filter((name) => name !== 'root'),
  }
}

// Notes every component shares.
const common = {
  class: 'Classes for the outer element',
  classes: 'Classes per part, by camelCased part name: { viewTrigger: "…" }',
}

const unique = (list) => [...new Set(list)]
const camel = (name) => name.replace(/-(\w)/g, (_, c) => c.toUpperCase())

// Splits "a = 1, b = { c: 2, d: 3 }, e" at the commas outside brackets and strings.
function splitTopLevel(text) {
  const out = []
  let depth = 0, quote = null, current = ''
  for (const char of text) {
    if (quote) { if (char === quote) quote = null }
    else if (`'"\``.includes(char)) quote = char
    else if ('([{'.includes(char)) depth++
    else if (')]}'.includes(char)) depth--
    else if (char === ',' && depth === 0) { out.push(current.trim()); current = ''; continue }
    current += char
  }
  out.push(current.trim())
  return out
}

// Usage examples: indented blocks of markup after a blank line.
function usageOf(doc) {
  const blocks = []
  let block = null
  doc.forEach((line, i) => {
    if (/^\s*<|^\s{2,}\S/.test(line) && !/^\s*-/.test(line) && (block || doc[i - 1] === '')) {
      block ??= blocks[blocks.push([]) - 1]
      block.push(line)
    } else block = null
  })
  return blocks.map((lines) => lines.join('\n')).join('\n\n')
}

// "- `a`, `b`: text" (continued on indented lines) describes a and b.
function notesOf(doc) {
  const notes = {}
  let current = null
  for (const line of doc) {
    const m = line.match(/^- ((?:`[\w-]+`[\s,/]*(?:or |and )?)+)(.*)$/)
    if (m) {
      current = { names: Array.from(m[1].matchAll(/`([\w-]+)`/g), (n) => n[1]), text: m[2].replace(/^:\s*/, '') }
      for (const name of current.names) notes[name] = current.text
    } else if (current && /^\s{2,}\S/.test(line)) {
      current.text += ' ' + line.trim()
      for (const name of current.names) notes[name] = current.text
    } else current = null
  }
  return notes
}
