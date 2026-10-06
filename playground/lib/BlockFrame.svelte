<!-- A block framed like a window: a slim bar (a caption, and the
     Preview/Code switch) above the block or its code. The bar is the
     playground's, not part of the block. -->
<script>
  import { Segmented, CopyButton } from '@milktop/svelte-ui'

  let { caption, code, children } = $props()
  let view = $state('preview')
</script>

<div class="overflow-hidden rounded-[calc(var(--ui-radius)+6px)] border border-(--ui-border) bg-(--ui-canvas)">
  <div class="flex items-center justify-between gap-4 border-b border-(--ui-border) bg-(--ui-surface) py-2 pr-2 pl-4">
    <span class="min-w-0 truncate text-sm text-(--ui-muted)">{caption}</span>
    <div class="flex shrink-0 items-center gap-2">
      {#if view === 'code'}<CopyButton value={code} />{/if}
      <Segmented size="sm" items={[{ value: 'preview', label: 'Preview' }, { value: 'code', label: 'Code' }]} bind:value={view} />
    </div>
  </div>
  <!-- Both views stay rendered (one hidden), so the block keeps its state. -->
  <div class="p-4 md:p-8" hidden={view !== 'preview'}>{@render children()}</div>
  <pre class="m-0 max-h-[70vh] overflow-auto bg-(--ui-surface) p-5 text-xs leading-relaxed [tab-size:2]" hidden={view !== 'code'}><code>{code}</code></pre>
</div>
