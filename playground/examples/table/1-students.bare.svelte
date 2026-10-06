<!-- Students
  Sorting, search, paging, custom cells and a row menu. Tick rows (Shift-click to tick a run) and an action bar appears. -->
<script>
  import { Table, sortRows, Pagination, Input, Avatar, Badge, Menu, Button, ActionBar, toaster } from '@milktop/svelte-ui'
  import { students } from './students.js'

  let query = $state('')
  let page = $state(1)
  let selected = $state([])
  let sort = $state({ key: 'name', dir: 'asc' })
  const pageSize = 8

  const columns = [
    { key: 'name', label: 'Student', sortable: true, cell: studentCell },
    { key: 'year', label: 'Year', sortable: true, align: 'end' },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'status', label: 'Status', sortable: true, cell: statusCell },
    { key: 'lessons', label: 'Lessons', sortable: true, align: 'end' },
    { key: 'fee', label: 'Fee', align: 'end', format: (v) => `£${v}` },
    { key: 'actions', label: '', cell: actionsCell, width: '3rem' },
  ]

  // Filtered, then sorted, then paged: the whole list is sorted (manualSort)
  // and the table shows just this page.
  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase()
    return q ? students.filter((s) => `${s.name} ${s.email} ${s.subject}`.toLowerCase().includes(q)) : students
  })
  const pageRows = $derived(sortRows(filtered, columns, sort).slice((page - 1) * pageSize, page * pageSize))

  const rowActions = [
    { value: 'message', label: 'Message', icon: 'lucide:message-square' },
    { value: 'book', label: 'Book lesson', icon: 'lucide:calendar-plus' },
    { separator: true },
    { value: 'archive', label: 'Archive', icon: 'lucide:archive', danger: true },
  ]
</script>

{#snippet studentCell({ row })}
  <div class="flex items-center gap-2.5">
    <Avatar name={row.name} size="sm" />
    <div>{row.name}<div class="text-xs text-(--ui-muted)">{row.email}</div></div>
  </div>
{/snippet}

{#snippet statusCell({ value })}
  <Badge variant={{ Active: 'success', Paused: 'warning', New: 'accent' }[value]}>{value}</Badge>
{/snippet}

{#snippet actionsCell({ row })}
  <Menu items={rowActions} label={row.name} placement="bottom-end" onselect={(value) => toaster.info({ title: `${value}: ${row.name}` })}>
    {#snippet trigger(props)}<Button {...props} size="sm" variant="ghost" icon="lucide:ellipsis" aria-label="Actions for {row.name}" />{/snippet}
  </Menu>
{/snippet}

<div class="flex w-full flex-col gap-3">
  <Input icon="lucide:search" placeholder="Search students" bind:value={query} oninput={() => (page = 1)} class="w-full sm:w-64" />
  <Table {columns} rows={pageRows} manualSort selectable bind:selected bind:sort label="Students"
    onsortchange={() => (page = 1)} onrowclick={(row) => toaster.info({ title: `Open ${row.name}` })} />
  <Pagination count={filtered.length} {pageSize} summary noun="students" bind:page />
  <!-- Floats at the bottom of the screen while rows are ticked. -->
  <ActionBar open={selected.length > 0} onclose={() => (selected = [])}>
    {#snippet selection()}{selected.length} selected{/snippet}
    <Button size="sm" icon="lucide:send" onclick={() => toaster.info({ title: `Message ${selected.length} students` })}>Message</Button>
    <Button size="sm" icon="lucide:calendar-plus">Book lessons</Button>
    <Button size="sm" variant="danger" icon="lucide:archive" onclick={() => (selected = [])}>Archive</Button>
  </ActionBar>
  <p class="m-0 text-sm text-(--ui-muted)">{JSON.stringify({ page, sort, selected })}</p>
</div>
