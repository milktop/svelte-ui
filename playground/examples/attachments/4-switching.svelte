<!-- Switching layout
  `switchable` adds a grid/list switch above the files; `persist` remembers the choice in this browser. To keep the choice yourself (say, in the user's settings), bind `layout`, or listen with `onlayoutchange`. -->
<script>
  import { Attachments } from '@milktop/svelte-ui'
  import { files } from './files.js'

  let items = $state(files.slice(0, 5))
</script>

<Attachments switchable persist="playground:attachments-layout" bind:items removable label="Lesson files" class="w-full" />
