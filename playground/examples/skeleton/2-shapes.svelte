<!-- Shapes -->
<script>
  import { Skeleton } from '@milktop/svelte-ui'
</script>

<div class="flex w-full flex-col gap-3">
  <Skeleton height="120px" />
  <Skeleton lines={3} />
  <div class="flex gap-3">
    <Skeleton width="80px" height="28px" />
    <Skeleton width="120px" height="28px" />
  </div>
</div>
