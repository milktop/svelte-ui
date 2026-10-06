<!-- Loading a profile
  Mark the region `aria-busy` while it loads. -->
<script>
  import { Skeleton, Avatar, Button } from '@milktop/svelte-ui'

  let loading = $state(true)
</script>

<div class="flex w-full max-w-sm items-center gap-3" aria-busy={loading}>
  {#if loading}
    <Skeleton circle width="40px" height="40px" />
    <Skeleton lines={2} class="flex-1" />
  {:else}
    <Avatar name="Ada Lovelace" />
    <div>
      <strong>Ada Lovelace</strong>
      <div class="text-sm text-(--ui-muted)">Maths tutor, 12 years</div>
    </div>
  {/if}
</div>
<Button size="sm" onclick={() => (loading = !loading)}>{loading ? 'Finish loading' : 'Load again'}</Button>
