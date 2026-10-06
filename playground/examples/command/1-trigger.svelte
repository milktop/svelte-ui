<!-- With a trigger
  Type to filter (words match the label, description, group and keywords), ↑/↓ to move, Enter to pick. Set `hotkey={null}` when another menu owns ⌘K, as here: the playground's search does. -->
<script>
  import { Command, Button } from '@milktop/svelte-ui'
  import { actions } from './actions.js'

  let picked = $state(null)
</script>

<Command items={actions} hotkey={null} onselect={(value) => (picked = value)}>
  {#snippet trigger(props)}<Button {...props} icon="lucide:terminal">Lesson actions</Button>{/snippet}
</Command>
<p class="m-0 w-full text-sm text-(--ui-muted)">picked: {JSON.stringify(picked)}</p>
