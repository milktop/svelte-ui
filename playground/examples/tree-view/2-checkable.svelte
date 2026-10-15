<!-- With checkboxes
  `checkable`: ticking a branch ticks everything in it; a part-ticked branch shows a dash. -->
<script>
  import { TreeView } from '@milktop/svelte-ui'
  import { clinic } from './data.js'

  let checked = $state(['north-theatre'])
  let expanded = $state(['north', 'south'])
</script>

<TreeView items={clinic} checkable bind:checked bind:expanded class="w-72" />
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify(checked)}</p>
