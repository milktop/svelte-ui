<!-- Stacked, with tooltips
  AvatarGroup overlaps them, rings each in the page colour, and folds the rest into a "+N" (its tooltip lists them). -->
<script>
  import { AvatarGroup } from '@milktop/svelte-ui'

  const team = ['Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Katherine Johnson', 'Margaret Hamilton', 'Tim Berners-Lee']
</script>

<AvatarGroup items={team} max={4} tooltip color="auto" />
