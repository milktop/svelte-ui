<!-- Stacked, with tooltips -->
<script>
  import { Avatar } from '@milktop/svelte-ui'
</script>

<div class="flex [&>*]:shadow-[0_0_0_2px_var(--ui-surface)] [&>*:not(:first-child)]:-ml-2">
  <Avatar tooltip name="Ada Lovelace" />
  <Avatar tooltip name="Alan Turing" />
  <Avatar tooltip name="Grace Hopper" />
  <Avatar tooltip="Katherine Johnson (owner)" name="Katherine Johnson" />
</div>
