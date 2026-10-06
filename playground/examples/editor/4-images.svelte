<!-- With images
  Give it `uploadImage` (an async function: File in, URL out, or `{ src, data-… }` to keep ids on the image) and images can be dropped, pasted or picked with the image button. Without it, dropped files are ignored instead of opening in the tab. -->
<script>
  import { Editor } from '@milktop/svelte-ui'

  // Stands in for a real upload: waits a moment, then returns a local URL
  // and an id your server could resolve later.
  async function fakeUpload(file) {
    await new Promise((done) => setTimeout(done, 600))
    return { src: URL.createObjectURL(file), 'data-upload-id': `upload-${Date.now()}` }
  }

  let homework = $state('<p>Label the parts of this diagram:</p><img src="https://picsum.photos/seed/editor-diagram/800/400" alt="Diagram">')
</script>

<Editor bind:value={homework} uploadImage={fakeUpload} />
<p class="m-0 w-full text-xs break-all text-(--ui-muted)">{homework}</p>
