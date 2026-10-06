<!-- Loading, then updated
  `toaster.loading` returns an id; `toaster.update(id, …)` turns it into a success. -->
<script>
  import { toaster, Button } from '@milktop/svelte-ui'

  function upload() {
    const id = toaster.loading({ title: 'Uploading worksheet…' })
    setTimeout(() => toaster.update(id, { type: 'success', title: 'Worksheet uploaded', description: 'fractions.pdf, 240 KB' }), 1500)
  }
</script>

<Button icon="lucide:upload" onclick={upload}>Upload worksheet</Button>
