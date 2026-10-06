<!-- Colours
  `color="auto"` picks one from the name, so the same person always gets the same colour. -->
<script>
  import { Avatar } from '@milktop/svelte-ui'

  const colors = ['accent', 'gray', 'red', 'orange', 'amber', 'green', 'teal', 'blue', 'purple', 'pink']
  const names = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Katherine Johnson', 'Edsger Dijkstra', 'Barbara Liskov', 'Donald Knuth', 'Margaret Hamilton']
</script>

<div class="flex w-full flex-col gap-3">
  <div class="flex flex-wrap gap-2">{#each colors as color}<Avatar {color} name={color} />{/each}</div>
  <div class="flex flex-wrap gap-2">{#each names as name}<Avatar color="auto" {name} />{/each}</div>
</div>
