<!-- Creating
  `oncreate` offers "Create …" for text that matches nothing, and hands you the text. Return the new item to select it (or a promise of it, after saving); the `create` snippet changes the option's content. -->
<script>
  import { Select } from '@milktop/svelte-ui'

  let topics = $state(['Algebra', 'Geometry', 'Statistics'])
  let picked = $state(['Algebra'])

  // Add it to the list and return it, so it's picked too.
  function addTopic(name) {
    topics = [...topics, name]
    return name
  }

  let rooms = $state([{ id: 1, name: 'Library' }, { id: 2, name: 'Lab' }])
  let roomId = $state(null)

  // Stands in for saving it: POST /rooms, then the saved room.
  async function saveRoom(name) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const room = { id: rooms.length + 1, name }
    rooms = [...rooms, room]
    return room
  }
</script>

<Select label="Topics" items={topics} multiple oncreate={addTopic} bind:value={picked} placeholder="Add a topic…" />
<Select label="Room" items={rooms} labelKey="name" valueKey="id" oncreate={saveRoom} bind:value={roomId}>
  {#snippet create(query)}<span class="text-(--ui-muted)">Add room</span> <b>{query}</b>{/snippet}
</Select>
<p>{JSON.stringify(picked)}, room {roomId ?? '—'} of {rooms.length}</p>
