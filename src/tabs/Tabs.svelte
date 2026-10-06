<!--
  Tabs: the Tab children are the panels, and the tab list is built from
  their labels.

  <Tabs bind:value={tab}>
    <Tab value="lessons" label="Lessons" icon="lucide:calendar">…</Tab>
    <Tab value="invoices" label="Invoices">…</Tab>
  </Tabs>

  Arrow keys move between tabs (selecting as they go), Home/End jump to the
  ends. With no value, the first enabled tab is selected.

  - `value`: bindable; the selected Tab's value
  - `variant`: 'line' (default, an underline) or 'pills'
  - `trigger` snippet: a tab's content, given the tab ({ value, label, icon })
-->
<script>
  import * as tabs from '@zag-js/tabs'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { setContext, untrack } from 'svelte'
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './tabs.css'

  let { value = $bindable(null), variant = 'line', trigger = null, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('tabs', () => classes)
  const id = $props.id()
  let list = $state([])

  // Selects the first enabled tab when none is.
  $effect(() => {
    if (value == null && list.length) value = list.find((tab) => !tab.disabled)?.value ?? null
  })

  const service = useMachine(tabs.machine, () => ({
    id, value: value == null ? null : String(value),
    onValueChange: (details) => { value = list.find((tab) => String(tab.value) === details.value)?.value ?? null },
  }))
  const api = $derived(tabs.connect(service, normalizeProps))

  setContext('ui-tabs', {
    get api() { return api },
    get part() { return part },
    // Untracked, so a Tab's effect doesn't rerun when the list changes.
    register(tab) {
      untrack(() => list.push(tab))
      return () => untrack(() => list.splice(list.indexOf(tab), 1))
    },
  })
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)} data-variant={variant}>
  <div {...part('list')} {...api.getListProps()}>
    {#each list as tab (tab.value)}
      <button {...part('trigger')} {...api.getTriggerProps({ value: String(tab.value), disabled: !!tab.disabled })}>
        {#if trigger}{@render trigger(tab)}
        {:else}
          {#if tab.icon}<iconify-icon {...part('icon')} icon={tab.icon} aria-hidden="true"></iconify-icon>{/if}
          <span>{tab.label}</span>
        {/if}
      </button>
    {/each}
    <div {...part('indicator')} {...api.getIndicatorProps()}></div>
  </div>
  <div {...part('panels')}>{@render children?.()}</div>
</div>
