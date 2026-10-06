<!-- Limits and dropping
  Images or PDFs, up to 2 MB each, at most 3. Files that don’t fit are listed with the reason. -->
<script>
  import { Attachments } from '@milktop/svelte-ui'

  let photos = $state([])
  let rejects = $state([])
</script>

<Attachments bind:items={photos} removable addable accept="image/*,.pdf" maxFiles={3} maxFileSize={2 * 1024 * 1024}
  addLabel="Add photos or PDFs" onreject={(list) => (rejects = list.map((r) => r.file.name))} />
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify({ photos: photos.map((p) => p.name), rejects })}</p>
