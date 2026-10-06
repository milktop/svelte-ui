<!-- Growing with its content
  Starts at `rows` lines and grows up to `maxRows`, then scrolls. -->
<script>
  import { Textarea } from '@milktop/svelte-ui'

  let notes = $state('Quadratics: past paper 2.\nBring a calculator.')
</script>

<Textarea bind:value={notes} rows={2} maxRows={6} placeholder="Lesson notes" class="w-full max-w-md" />
<Textarea autogrow={false} rows={3} placeholder="Fixed height, resizable" class="w-full max-w-md" />
