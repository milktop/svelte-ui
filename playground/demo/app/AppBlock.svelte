<!-- A content block: Card with the app's teal top edge, a large soft shadow,
     a rounded foot and a quiet header.

     <AppBlock title="Actes">…</AppBlock> -->
<script>
  import { Card } from '@milktop/svelte-ui'

  let { title = null, flush = false, icons = null, children } = $props()
</script>

<Card heading={title} {flush} actions={icons}
  class="rounded-none rounded-b-md border border-gray-100 border-t-[3px] border-t-teal-400 shadow-lg"
  classes={{
    header: 'items-center px-6 pt-[0.9rem] pb-[0.6rem] border-b border-gray-200',
    heading: 'text-[13px] leading-normal font-normal text-gray-600',
    actions: 'items-center gap-2',
    body: flush ? 'p-0' : 'p-6 text-sm',
  }}>
  <!-- Always a body, so an empty block keeps its height, as in the app. -->
  {@render children?.()}
</Card>
