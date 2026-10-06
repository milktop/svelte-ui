<!-- Mixed files
  Without `columns`, as many fit as there's room for. Hover a tile for download and remove; the last tile adds files from your computer, or drop them anywhere on the attachments (previewed locally). -->
<script>
  import { Attachments } from '@milktop/svelte-ui'
  import { files as initial } from './files.js'

  let files = $state([...initial])
  let removed = $state(null)
</script>

<Attachments bind:items={files} removable addable onremove={(item) => (removed = item.name)} />
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify({ count: files.length, removed })}</p>
