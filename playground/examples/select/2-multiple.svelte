<!-- Several, and clearing
  `multiple` binds an array and keeps the list open; `clearable` adds a clear button. -->
<script>
  import { Fields, Field, Select } from '@milktop/svelte-ui'

  let days = $state(['Mon', 'Wed'])
  let room = $state('Library')
</script>

<Fields class="w-full">
  <Field label="Days" span={6} hint={JSON.stringify(days)}><Select multiple items={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']} bind:value={days} /></Field>
  <Field label="Room" span={6} hint="Bound: {room ?? '—'}"><Select clearable items={['Library', 'Lab', 'Online']} bind:value={room} /></Field>
</Fields>
