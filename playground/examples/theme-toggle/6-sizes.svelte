<!-- Sizes
  `size` ('sm', 'md' or 'lg') applies to every variant, the menu's icons included. -->
<script>
  import { ThemeToggle } from '@milktop/svelte-ui'
</script>

<div class="flex w-full flex-col gap-3">
  <div class="flex items-center gap-3">{#each ['sm', 'md', 'lg'] as size}<ThemeToggle {size} />{/each}</div>
  <div class="flex items-center gap-3">
    {#each ['sm', 'md', 'lg'] as size}<ThemeToggle {size} variant="menu" iconOnly />{/each}
    {#each ['sm', 'md', 'lg'] as size}<ThemeToggle {size} variant="toggle" />{/each}
  </div>
</div>
