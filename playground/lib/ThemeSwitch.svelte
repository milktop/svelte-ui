<!-- Light, dark or the system's: the appearance's theme, as a quick switch in the top bar. -->
<script>
  import { Button } from '@milktop/svelte-ui'
  import { appearance } from './appearance.svelte.js'

  const modes = [['light', 'lucide:sun', 'Light'], ['dark', 'lucide:moon', 'Dark'], ['system', 'lucide:monitor', 'System']]
</script>

<div class="flex items-center gap-0.5 rounded-[var(--ui-radius)] border border-(--ui-border) bg-(--ui-surface) p-0.5" role="group" aria-label="Theme">
  {#each modes as [value, icon, label]}
    <Button size="sm" variant={appearance.theme === value ? 'soft' : 'ghost'} {icon} aria-label={label} aria-pressed={appearance.theme === value}
      class="h-7 w-7" onclick={() => (appearance.theme = value)} />
  {/each}
</div>
