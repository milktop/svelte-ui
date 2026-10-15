<!--
  Text with the parts matching a search marked, e.g. in search results.

  <Highlight text={student.name} query={search} />
  <Highlight text={note} query={search} color="yellow" />

  - `text`: the text; `query`: what to mark (a string, or several)
  - `ignoreCase` (true), `matchAll` (true: every match, not just the first)
  - `color`: the marks' background: 'accent' (default, the `--ui-highlight`
    token), 'yellow', 'amber', 'orange', 'red', 'green', 'teal', 'blue',
    'purple', 'pink' or 'gray' (tints that keep the text readable, deeper in
    dark mode), or any CSS colour, used as it is. For every highlight in the
    app, set `--ui-highlight` on :root instead.
-->
<script>
  import { highlightWord } from '@zag-js/highlight-word'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './highlight.css'

  let { text = '', query = '', ignoreCase = true, matchAll = true, color = 'accent', class: className = '', classes = {}, ...rest } = $props()

  const part = partsOf('highlight', () => classes)
  const named = ['yellow', 'amber', 'orange', 'red', 'green', 'teal', 'blue', 'purple', 'pink', 'gray']
  // An empty query marks nothing.
  const queries = $derived([].concat(query ?? []).filter((q) => q.trim()))
  const chunks = $derived(queries.length ? highlightWord({ text: String(text ?? ''), query: queries, ignoreCase, matchAll }) : [{ text: String(text ?? ''), match: false }])
  // A named colour is a data attribute; any other (not 'accent') sets the token on the marks.
  const custom = $derived(color !== 'accent' && !named.includes(color))
</script>

{#each chunks as chunk}{#if chunk.match}<mark {...rest} {...part('mark')} class={cx(className)} data-color={named.includes(color) ? color : undefined}
  style:--ui-highlight={custom ? color : undefined}>{chunk.text}</mark>{:else}{chunk.text}{/if}{/each}
