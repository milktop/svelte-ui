<!-- Notes
  Its value is HTML, bindable like the other controls; the usual shortcuts work (⌘B, ⌘I, ⌘U…). -->
<script>
  import { Editor } from '@milktop/svelte-ui'

  let notes = $state('<h2>Fractions and decimals</h2><p>Recap <strong>equivalent fractions</strong>, then convert between fractions and decimals.</p><ul><li><p>Halves, quarters and tenths</p></li><li><p>Ordering a mixed list</p></li></ul>')
</script>

<Editor bind:value={notes} placeholder="Lesson notes…" />
<p class="m-0 w-full text-xs break-all text-(--ui-muted)">{notes}</p>
