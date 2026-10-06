<!-- Upload files
  Drop or browse; images show a preview, and rejected files say why. -->
<script>
  import { FileUpload } from '@milktop/svelte-ui'

  let files = $state([])
</script>

<FileUpload label="Worksheets" bind:files maxFiles={3} accept={['image/*', '.pdf']} hint="Images or PDFs, up to 3" class="w-full" />
<p class="m-0 text-sm text-(--ui-muted)">{files.length} accepted: {files.map((f) => f.name).join(', ') || '—'}</p>
