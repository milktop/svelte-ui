<!-- Showing what an Editor saved
  The same look as the Editor, so notes read the same where they're shown. Edit them and see. -->
<script>
  import { Editor, Prose } from '@milktop/svelte-ui'

  let notes = $state('<h2>Fractions and decimals</h2><p>Recap <strong>equivalent fractions</strong>, then convert between them. See <a href="#/prose">worksheet 4</a>.</p><ul><li><p>Halves, quarters and tenths</p></li><li><p>Ordering a mixed list</p></li></ul><blockquote><p>Ask about the mock exam.</p></blockquote>')
</script>

<div class="grid w-full gap-6 md:grid-cols-2">
  <Editor bind:value={notes} tools={['bold', 'italic', '|', 'h2', 'bulletList', 'blockquote', 'link']} />
  <Prose html={notes} />
</div>
