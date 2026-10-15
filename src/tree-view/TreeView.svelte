<!--
  Nested items that open and close, e.g. folders, categories or a clinic's
  sites and rooms. Arrow keys move through it (←→ close and open), typing
  jumps, Enter selects.

  <TreeView items={folders} onselect={open} />
  <TreeView items={permissions} checkable bind:checked={granted} />

  - `items`: `{ value, label, icon, children, disabled }`; a node with
    `children` is a branch (an empty array still opens and closes). Branches
    without an icon get a folder.
  - `value`: bindable; the selected values
  - `selectionMode`: 'single' (default) or 'multiple'
  - `expanded`: bindable; the open branches' values
  - `checkable`: a checkbox on each (ticking a branch ticks its children)
  - `checked`: bindable; the ticked values
  - `label`: the tree's name, shown above it and for assistive tech
  - `onselect`: called with an item's node (not a branch's) when it's chosen
-->
<script>
  import * as tree from '@zag-js/tree-view'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import '../icons.js'
  import { cx, partsOf } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './tree-view.css'

  let {
    items = [], value = $bindable([]), expanded = $bindable([]), checked = $bindable([]), selectionMode = 'single',
    checkable = false, label = null, onselect = null, class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('tree-view', () => classes)
  const id = $props.id()
  const collection = $derived(tree.collection({
    nodeToValue: (node) => node.value,
    nodeToString: (node) => String(node.label ?? node.value),
    isNodeDisabled: (node) => !!node.disabled,
    rootNode: { value: '__root__', label: '', children: items ?? [] },
  }))

  const service = useMachine(tree.machine, () => ({
    id, collection, selectionMode,
    selectedValue: [].concat(value ?? []),
    expandedValue: [].concat(expanded ?? []),
    checkedValue: [].concat(checked ?? []),
    ...(uiLocale.zag('treeView') && { translations: uiLocale.zag('treeView') }),
    onSelectionChange: (details) => {
      value = details.selectedValue
      // A single item chosen (not a branch): the focused one, or the last.
      const nodes = details.selectedNodes
      const node = nodes.find((n) => n.value === details.focusedValue) ?? nodes.at(-1)
      if (node && !node.children) onselect?.(node)
    },
    onExpandedChange: (details) => { expanded = details.expandedValue },
    onCheckedChange: (details) => { checked = details.checkedValue },
  }))
  const api = $derived(tree.connect(service, normalizeProps))
</script>

{#snippet checkbox(props, state)}
  <!-- Zag calls these node-checkbox and branch-indent-guide: our names go last. -->
  <span {...api.getNodeCheckboxProps(props)} {...part('checkbox')}>
    {#if state.checked}<iconify-icon icon={state.checked === 'indeterminate' ? 'lucide:minus' : 'lucide:check'} aria-hidden="true"></iconify-icon>{/if}
  </span>
{/snippet}

{#snippet treeNode(node, indexPath)}
  {@const props = { node, indexPath }}
  {@const state = api.getNodeState(props)}
  {#if node.children}
    <div {...part('branch')} {...api.getBranchProps(props)}>
      <div {...part('branch-control')} {...api.getBranchControlProps(props)}>
        <span {...part('branch-indicator')} {...api.getBranchIndicatorProps(props)}><iconify-icon icon="lucide:chevron-right" aria-hidden="true"></iconify-icon></span>
        {#if checkable}{@render checkbox(props, state)}{/if}
        <iconify-icon {...part('icon')} icon={node.icon ?? (state.expanded ? 'lucide:folder-open' : 'lucide:folder')} aria-hidden="true"></iconify-icon>
        <span {...part('branch-text')} {...api.getBranchTextProps(props)}>{node.label}</span>
      </div>
      <div {...part('branch-content')} {...api.getBranchContentProps(props)}>
        <div {...api.getBranchIndentGuideProps(props)} {...part('indent-guide')}></div>
        {#each node.children as child, i (child.value)}{@render treeNode(child, [...indexPath, i])}{/each}
      </div>
    </div>
  {:else}
    <div {...part('item')} {...api.getItemProps(props)}>
      {#if checkable}{@render checkbox(props, state)}{/if}
      {#if node.icon}<iconify-icon {...part('icon')} icon={node.icon} aria-hidden="true"></iconify-icon>{/if}
      <span {...part('item-text')} {...api.getItemTextProps(props)}>{node.label}</span>
    </div>
  {/if}
{/snippet}

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>
  {#if label}<span {...part('label')} {...api.getLabelProps()}>{label}</span>{/if}
  <div {...part('tree')} {...api.getTreeProps()}>
    {#each items ?? [] as node, i (node.value)}{@render treeNode(node, [i])}{/each}
  </div>
</div>
