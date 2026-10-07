<!-- The page's two columns: the main column (65%) and an aside (30%), stacked below 1280px. -->
<script>
  let { main, aside } = $props()
</script>

<div class="flex flex-col gap-9 xl:flex-row xl:items-start xl:justify-between">
  <div class="flex min-w-0 flex-col gap-9 xl:w-[65%]">{@render main()}</div>
  <aside class="flex min-w-0 flex-col gap-9 xl:w-[30%]">{@render aside?.()}</aside>
</div>
