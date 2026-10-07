<!-- Tabs in a block's header: small, grey, the current one teal. -->
<script>
  import { Tabs } from '@milktop/svelte-ui'

  let { value = $bindable(null), children } = $props()
</script>

<Tabs bind:value classes={{
  list: 'px-6 gap-3 border-b border-gray-200',
  trigger: 'h-auto rounded-none px-1 pt-[0.9rem] pb-[0.8rem] gap-1.5 text-[13px] font-normal text-gray-500 hover:text-gray-700 data-selected:text-teal-500',
  icon: 'text-[14px] opacity-70',
  indicator: 'bg-teal-400',
  panels: 'pt-0',
}}>{@render children?.()}</Tabs>
