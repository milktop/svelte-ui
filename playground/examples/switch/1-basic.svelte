<!-- Switches
  `bind:checked`, with a label. -->
<script>
  import { Fields, Field, Switch } from '@milktop/svelte-ui'

  let reminders = $state(true)
</script>

<Fields class="w-full">
  <Field span={12} hint="reminders: {reminders}">
    <div class="flex flex-col gap-3">
      <Switch bind:checked={reminders}>Email reminders</Switch>
      <Switch label="Disabled" disabled />
    </div>
  </Field>
</Fields>
