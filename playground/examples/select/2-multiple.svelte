<!-- Several, toggling and clearing
  `multiple` binds an array, with picks ticked in the list, or shown as `tags`; `hideSelected` takes them out of the list. `deselectable` lets a second click on the picked item clear it; `clearable` adds a clear button. -->
<script>
  import { Select } from '@milktop/svelte-ui'

  let days = $state(['Mon', 'Wed'])
  let subjects = $state(['Maths'])
  let level = $state('GCSE')
  let room = $state('Library')
</script>

<Select label="Days" multiple items={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']} bind:value={days} />
<Select label="Subjects" multiple tags variant="accent" hideSelected items={['Maths', 'Physics', 'Chemistry', 'Biology']} bind:value={subjects} />
<Select label="Level" deselectable items={['GCSE', 'A Level', 'IB']} bind:value={level} />
<Select label="Room" clearable items={['Library', 'Lab', 'Online']} bind:value={room} />
<p>{JSON.stringify(days)}, {JSON.stringify(subjects)}, {level ?? '—'}, {room ?? '—'}</p>
