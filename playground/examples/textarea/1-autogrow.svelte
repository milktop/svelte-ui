<!-- Growing with its content
  Starts at `rows` lines and grows up to `maxRows`, then scrolls; `autogrow={false}` gives a fixed, resizable box. -->
<script>
  import { Fields, Field, Textarea } from '@milktop/svelte-ui'

  let notes = $state('Quadratics: past paper 2.\nBring a calculator.')
</script>

<Fields class="w-full">
  <Field label="Notes" span={6} hint="2 to 6 lines"><Textarea bind:value={notes} rows={2} maxRows={6} /></Field>
  <Field label="Fixed" span={6} hint="Resizable"><Textarea autogrow={false} rows={3} placeholder="Drag the corner" /></Field>
</Fields>
