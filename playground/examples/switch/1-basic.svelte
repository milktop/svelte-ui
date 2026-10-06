<!-- Switches
  `bind:checked`, with a label. -->
<script>
  import { Switch } from '@milktop/svelte-ui'

  let reminders = $state(true)
</script>

<div class="flex flex-col gap-3">
  <Switch bind:checked={reminders}>Email reminders</Switch>
  <Switch label="Disabled" disabled />
  <p class="m-0 text-sm text-(--ui-muted)">reminders: {reminders}</p>
</div>
