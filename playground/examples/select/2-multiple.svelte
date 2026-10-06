<!-- Several, and clearing
  `multiple` binds an array and keeps the list open; `clearable` adds a clear button. -->
<script>
  import { Select } from '@milktop/svelte-ui'

  let days = $state(['Mon', 'Wed'])
  let room = $state('Library')
</script>

<Select label="Days" multiple items={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']} bind:value={days} />
<Select label="Room" clearable items={['Library', 'Lab', 'Online']} bind:value={room} />
<p>{JSON.stringify(days)}, {room ?? '—'}</p>
