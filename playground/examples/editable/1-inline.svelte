<!-- Edit in place
  Reads as text until clicked; Enter or ✓ saves (updating the bound value), Escape or ✕ cancels. -->
<script>
  import { Editable, DataList, DataItem } from '@milktop/svelte-ui'

  let name = $state('Biscuit')
  let notes = $state('')
</script>

<DataList variant="divided" class="w-full max-w-md">
  <DataItem label="Name"><Editable bind:value={name} /></DataItem>
  <DataItem label="Notes"><Editable bind:value={notes} placeholder="Add a note…" /></DataItem>
  <DataItem label="Saved">{JSON.stringify({ name, notes })}</DataItem>
</DataList>
