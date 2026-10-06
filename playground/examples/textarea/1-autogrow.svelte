<!-- Growing with its content
  Starts at `rows` lines and grows up to `maxRows`, then scrolls; `autogrow={false}` gives a fixed, resizable box. -->
<script>
  import { Textarea } from '@milktop/svelte-ui'

  let notes = $state('Quadratics: past paper 2.\nBring a calculator.')
</script>

<Textarea label="Notes" bind:value={notes} rows={2} maxRows={6} />
<Textarea label="Fixed" autogrow={false} rows={3} placeholder="Drag the corner" />
