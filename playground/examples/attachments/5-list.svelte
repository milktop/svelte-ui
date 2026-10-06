<!-- List -->
<script>
  import { Attachments } from '@milktop/svelte-ui'
  import { files } from './files.js'

  let docs = $state(files.slice(3))
</script>

<div class="flex w-full flex-col gap-3">
  <Attachments layout="list" bind:items={docs} removable addable addLabel="Attach a file" />
  <Attachments layout="list" items={[]} addable addLabel="Attach a file" />
</div>
