<!-- Sizes
  Named sizes, or any CSS length (a number is pixels). -->
<script>
  import { Avatar } from '@milktop/svelte-ui'
</script>

<div class="flex w-full flex-col gap-3">
  <div class="flex items-center gap-3">
    {#each ['sm', 'md', 'lg', 'xl'] as size}<Avatar {size} name="Ada Lovelace" />{/each}
  </div>
  <div class="flex items-center gap-3">
    {#each [24, 32, 48, 96] as size}<Avatar {size} name="Ada Lovelace" />{/each}
  </div>
</div>
