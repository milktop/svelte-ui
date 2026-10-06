<!-- Photos, three per row
  `columns` sets the most per row (fewer when tiles would get too small). Images can have a small `thumb` for the tile and a full-size `url` for the preview; click one to see it large. -->
<script>
  import { Attachments } from '@milktop/svelte-ui'
  import { photo } from './files.js'

  let covers = $state([
    { name: 'Cover 1.jpg', size: 920000, type: 'image/jpeg', ...photo('cover-one') },
    { name: 'Cover 2.jpg', size: 870000, type: 'image/jpeg', ...photo('cover-two') },
    { name: 'Cover 3.jpg', size: 1010000, type: 'image/jpeg', ...photo('cover-three') },
  ])
</script>

<Attachments columns={3} bind:items={covers} removable addable accept="image/*" addLabel="Add photos" />
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify(covers.map((c) => c.name))}</p>
