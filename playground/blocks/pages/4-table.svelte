<!-- Table page
  Search, a subject filter and a filters sheet over a selectable, sortable table, with an action bar for the selection and paging. -->
<script>
  import { Button, Card, Input, Select, Sheet, CheckboxGroup, Table, sortRows, EmptyState, Pagination, ActionBar, Avatar, Badge } from '@milktop/svelte-ui'
  import { students, subjectItems } from '../data.js'

  let query = $state('')
  let subject = $state(null)
  let statuses = $state([])
  let filtersOpen = $state(false)
  let selected = $state([])
  let sort = $state({ key: 'name', dir: 'asc' })
  let page = $state(1)
  const pageSize = 8

  const columns = [
    { key: 'name', label: 'Student', sortable: true, cell: student },
    { key: 'subject', label: 'Subject', sortable: true },
    { key: 'year', label: 'Year', sortable: true, align: 'end' },
    { key: 'status', label: 'Status', sortable: true, cell: status },
    { key: 'lessons', label: 'Lessons', sortable: true, align: 'end' },
  ]
  const statusItems = ['Active', 'Paused', 'New']

  const filtered = $derived.by(() => {
    const q = query.trim().toLowerCase()
    return students.filter((s) => (!q || `${s.name} ${s.email}`.toLowerCase().includes(q))
      && (!subject || s.subject === subject) && (!statuses.length || statuses.includes(s.status)))
  })
  // Sort everything, then show one page.
  const rows = $derived(sortRows(filtered, columns, sort).slice((page - 1) * pageSize, page * pageSize))

  function clearFilters() {
    subject = null
    statuses = []
    page = 1
  }
</script>

{#snippet student({ row })}
  <span class="flex items-center gap-2.5"><Avatar size="sm" name={row.name} /><span>{row.name}<span class="block text-xs text-(--ui-muted)">{row.email}</span></span></span>
{/snippet}
{#snippet status({ value })}<Badge variant={{ Active: 'success', Paused: 'warning', New: 'accent' }[value]}>{value}</Badge>{/snippet}

<div class="flex flex-col gap-4">
  <div class="mb-2 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h2 class="m-0 text-xl font-bold">Students</h2>
      <p class="mt-1 mb-0 text-sm text-(--ui-muted)">{filtered.length} of {students.length} students</p>
    </div>
    <Button variant="primary" icon="lucide:user-plus">Add student</Button>
  </div>
  <!-- The toolbar, table and paging read as one unit in a card. -->
  <Card flush>
    <div class="flex flex-wrap gap-2 border-b border-(--ui-border) p-3">
      <Input round size="sm" icon="lucide:search" placeholder="Search by name or email" bind:value={query} oninput={() => (page = 1)} class="min-w-48 grow" />
      <Select size="sm" items={subjectItems} placeholder="All subjects" clearable bind:value={() => subject, (v) => { subject = v; page = 1 }} class="w-44" />
      <Sheet side="right" size="sm" heading="Filters" bind:open={filtersOpen}>
        {#snippet trigger(props)}<Button {...props} size="sm" icon="lucide:sliders-horizontal">{statuses.length ? `Filters (${statuses.length})` : 'Filters'}</Button>{/snippet}
        <CheckboxGroup label="Status" items={statusItems} bind:value={() => statuses, (v) => { statuses = v; page = 1 }} />
        {#snippet footer()}
          <Button onclick={clearFilters}>Clear</Button>
          <Button variant="primary" onclick={() => (filtersOpen = false)}>Show {filtered.length} students</Button>
        {/snippet}
      </Sheet>
    </div>
    <Table flush {columns} {rows} manualSort selectable bind:selected bind:sort label="Students">
      {#snippet empty()}
        <EmptyState icon="lucide:search-x" heading="No students match" description="Try a different search or clear the filters.">
          <Button size="sm" onclick={() => { query = ''; clearFilters() }}>Clear search and filters</Button>
        </EmptyState>
      {/snippet}
    </Table>
    {#snippet footer()}<Pagination count={filtered.length} {pageSize} summary noun="students" bind:page class="flex-1" />{/snippet}
  </Card>
  <ActionBar open={selected.length > 0} onclose={() => (selected = [])}>
    {#snippet selection()}{selected.length} selected{/snippet}
    <Button size="sm" icon="lucide:send">Message</Button>
    <Button size="sm" icon="lucide:download">Export</Button>
    <Button size="sm" variant="danger" icon="lucide:archive" onclick={() => (selected = [])}>Archive</Button>
  </ActionBar>
</div>
