<!-- Keys and shortcuts
  One key as the content, or `keys` for a shortcut. -->
<script>
  import { Kbd, formatHotkey } from '@milktop/svelte-ui'
</script>

<Kbd>Esc</Kbd>
<Kbd keys={['⌘', 'K']} />
<Kbd keys={['Shift', 'F10']} size="sm" />
<span class="text-sm text-(--ui-muted)">Search with <Kbd size="sm">{formatHotkey()}</Kbd></span>
