<!-- Basic
  `oncopy` is called once the value is copied. -->
<script>
  import { CopyButton } from '@milktop/svelte-ui'

  const code = 'TUT-4821-XQ'
  let copies = $state(0)
</script>

<span class="flex items-center gap-2"><code>{code}</code><CopyButton value={code} oncopy={() => copies++} /></span>
<p class="m-0 w-full text-sm text-(--ui-muted)">copies: {copies}</p>
