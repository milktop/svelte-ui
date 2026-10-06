<!-- Checkbox and radio items
  Entries with `type: "checkbox"` or `type: "radio"` (one checked per `name`). The menu updates their `checked` and calls `onchange` with `{ type, name, value, checked }`; `keepOpen` keeps it open while you tick several. -->
<script>
  import { Menu, Button } from '@milktop/svelte-ui'

  const view = [
    { type: 'checkbox', value: 'grid', label: 'Show grid', checked: true },
    { type: 'checkbox', value: 'rulers', label: 'Show rulers', shortcut: '⌘R' },
    { separator: true },
    { group: 'Sort by' },
    { type: 'radio', name: 'sort', value: 'name', label: 'Name', checked: true },
    { type: 'radio', name: 'sort', value: 'date', label: 'Date' },
    { type: 'radio', name: 'sort', value: 'size', label: 'Size' },
  ]
  let changed = $state(null)
</script>

<Menu items={view} keepOpen onchange={(change) => (changed = change)}>
  {#snippet trigger(props)}<Button {...props} iconEnd="lucide:chevron-down">View</Button>{/snippet}
</Menu>
<p class="m-0 w-full text-sm text-(--ui-muted)">changed: {JSON.stringify(changed)}</p>
