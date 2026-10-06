<!-- In an input
  The copy button sits in the input's `end` snippet. -->
<script>
  import { Input, CopyButton } from '@milktop/svelte-ui'

  const link = 'https://example.com/book/ada-lovelace'
</script>

<Input label="Share link" value={link} readonly class="w-full max-w-md">
  {#snippet end()}<CopyButton value={link} />{/snippet}
</Input>
