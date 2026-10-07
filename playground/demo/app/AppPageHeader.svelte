<!-- The page header: links and the title on one line, a subtitle, the buttons. -->
<script>
  let { title = '', links = [], subtitle = null, icons = null, children } = $props()
</script>

<div class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 class="m-0 flex items-center gap-2 text-base leading-normal font-normal">
      <span>
        {#each links as link}<a href={link.href} class="text-gray-700 no-underline hover:underline">{link.text}</a><span class="text-gray-600">&nbsp;/ </span>{/each}
        <span class="font-semibold text-gray-800">{title}</span>
      </span>
      {@render icons?.()}
    </h1>
    {#if subtitle}<p class="m-0 text-[13px] text-gray-500">{subtitle}</p>{/if}
  </div>
  <div class="flex flex-wrap items-center gap-2">{@render children?.()}</div>
</div>
