<!-- Light, dark or the system's: sets html.dark (and color-scheme), and
     remembers the choice in this browser. -->
<script>
  import { Button } from '@milktop/svelte-ui'

  const KEY = 'svelte-ui:color-scheme'
  const modes = [['light', 'lucide:sun', 'Light'], ['dark', 'lucide:moon', 'Dark'], ['system', 'lucide:monitor', 'System']]

  let scheme = $state(read() ?? 'system')
  const media = matchMedia('(prefers-color-scheme: dark)')
  let systemDark = $state(media.matches)
  media.addEventListener('change', (e) => (systemDark = e.matches))

  const dark = $derived(scheme === 'dark' || (scheme === 'system' && systemDark))

  $effect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    try { localStorage.setItem(KEY, scheme) } catch {}
  })

  function read() {
    try { return localStorage.getItem(KEY) } catch { return null }
  }
</script>

<div class="flex items-center gap-0.5 rounded-[var(--ui-radius)] border border-(--ui-border) bg-(--ui-surface) p-0.5" role="group" aria-label="Theme">
  {#each modes as [value, icon, label]}
    <Button size="sm" variant={scheme === value ? 'soft' : 'ghost'} {icon} aria-label={label} aria-pressed={scheme === value}
      class="h-7 w-7" onclick={() => (scheme = value)} />
  {/each}
</div>
