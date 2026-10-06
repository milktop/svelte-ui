<!-- Switches
  `bind:checked`, with a label. -->
<script>
  import { Switch } from '@milktop/svelte-ui'

  let reminders = $state(true)
</script>

<Switch bind:checked={reminders}>Email reminders</Switch>
<Switch label="Disabled" disabled />
<p>reminders: {reminders}</p>
