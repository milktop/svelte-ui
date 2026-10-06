<!-- Server search
  With `load`, each search calls an async function (debounced) for the results. -->
<script>
  import { Command, Button } from '@milktop/svelte-ui'

  const people = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Katherine Johnson', 'Margaret Hamilton', 'Tim Berners-Lee', 'Edsger Dijkstra', 'Barbara Liskov']

  // Pretends to be a server: matching people, after a short wait.
  async function findPeople(query) {
    await new Promise((done) => setTimeout(done, 300))
    const q = query.trim().toLowerCase()
    return people.filter((name) => name.toLowerCase().includes(q)).map((name) => ({ label: name, value: name, icon: 'lucide:user', description: 'Student' }))
  }

  let open = $state(false)
  let person = $state(null)
</script>

<Command load={findPeople} hotkey={null} placeholder="Search students…" emptyText="No students found" bind:open onselect={(value) => (person = value)} />
<Button icon="lucide:search" onclick={() => (open = true)}>Find a student</Button>
<p class="m-0 w-full text-sm text-(--ui-muted)">person: {JSON.stringify(person)}</p>
