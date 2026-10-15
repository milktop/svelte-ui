<!-- Sites and rooms
  Click (or Enter) to select; ←→ close and open. `onselect` gets the chosen item (not a branch). -->
<script>
  import { TreeView } from '@milktop/svelte-ui'
  import { clinic } from './data.js'

  let picked = $state(null)
  let expanded = $state(['north'])
</script>

<TreeView items={clinic} bind:expanded onselect={(item) => (picked = item)} label="Rooms" class="w-72" />
<p class="m-0 w-full text-sm text-(--ui-muted)">picked: {picked?.label ?? ''}</p>
