<!-- Image and fallbacks
  Ada has a photo, Alan has none, Grace’s fails to load, and the last has no name. -->
<script>
  import { Avatar } from '@milktop/svelte-ui'

  const people = [
    { name: 'Ada Lovelace', src: 'https://i.pravatar.cc/120?img=47' },
    { name: 'Alan Turing', src: null },
    { name: 'Grace Hopper', src: 'https://example.invalid/missing.jpg' },
    { name: null, src: null },
  ]
</script>

{#each people as person}
  <Avatar src={person.src} name={person.name} />
{/each}
