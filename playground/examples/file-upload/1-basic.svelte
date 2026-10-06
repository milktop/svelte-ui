<!-- Upload files
  Drop or browse; images show a preview, and rejected files say why. -->
<script>
  import { Fields, Field, FileUpload } from '@milktop/svelte-ui'

  let files = $state([])
</script>

<Fields class="w-full">
  <Field label="Worksheets" span={12} hint="{files.length} accepted: {files.map((f) => f.name).join(', ') || '—'}">
    <FileUpload bind:files maxFiles={3} accept={['image/*', '.pdf']} hint="Images or PDFs, up to 3" />
  </Field>
</Fields>
