<!-- Fewer tools, with a limit -->
<script>
  import { Editor } from '@milktop/svelte-ui'

  let feedback = $state('')
</script>

<Editor bind:value={feedback} tools={['bold', 'italic', '|', 'bulletList', '|', 'link']} maxLength={280} minHeight="5rem"
  placeholder="Short feedback for the student…" />
