<!-- Basic
  First and last buttons appear when some pages are hidden behind an ellipsis. -->
<script>
  import { Pagination } from '@milktop/svelte-ui'

  let page = $state(4)
</script>

<Pagination count={95} pageSize={10} summary noun="students" bind:page class="w-full" />
<p class="m-0 w-full text-sm text-(--ui-muted)">page: {page}</p>
