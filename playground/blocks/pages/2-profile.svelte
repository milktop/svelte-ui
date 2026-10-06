<!-- Profile
  A person with their status and actions, then tabs: details and numbers, their lessons, and notes. -->
<script>
  import { Breadcrumbs, Avatar, Badge, Button, Menu, Card, Tabs, Tab, DataList, Stats, Stat, Table, Timeline, TimelineItem } from '@milktop/svelte-ui'

  let tab = $state('overview')
  const lessons = [
    { id: 1, date: 'Thu 8 Oct', topic: 'Fractions and decimals', status: 'Booked' },
    { id: 2, date: 'Thu 1 Oct', topic: 'Ratio and proportion', status: 'Done' },
    { id: 3, date: 'Thu 24 Sep', topic: 'Percentages', status: 'Cancelled' },
    { id: 4, date: 'Thu 17 Sep', topic: 'Negative numbers', status: 'Done' },
  ]
  const lessonColumns = [
    { key: 'date', label: 'Date' },
    { key: 'topic', label: 'Topic' },
    { key: 'status', label: 'Status', cell: status, align: 'end' },
  ]
  const actions = [
    { value: 'edit', label: 'Edit details', icon: 'lucide:pencil' },
    { value: 'invoice', label: 'Send invoice', icon: 'lucide:receipt' },
    { separator: true },
    { value: 'archive', label: 'Archive student', icon: 'lucide:archive', danger: true },
  ]
</script>

{#snippet status({ value })}<Badge variant={{ Booked: 'accent', Done: 'success', Cancelled: 'danger' }[value]}>{value}</Badge>{/snippet}

<div class="flex flex-col gap-6">
  <!-- Breadcrumbs above the header: a detail page's way back. -->
  <div class="flex flex-col gap-4">
    <Breadcrumbs items={[{ label: 'Students', href: '#' }, { label: 'Ada Lovelace' }]} />
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <Avatar size="lg" name="Ada Lovelace" />
        <div>
          <h2 class="m-0 text-xl font-bold">Ada Lovelace</h2>
          <div class="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-(--ui-muted)"><Badge variant="success" dot>Active</Badge>Year 11 · GCSE Maths</div>
        </div>
      </div>
      <div class="flex gap-2">
        <Button icon="lucide:message-square">Message</Button>
        <Button variant="primary" icon="lucide:calendar-plus">Book lesson</Button>
        <Menu items={actions} placement="bottom-end">
          {#snippet trigger(props)}<Button {...props} icon="lucide:ellipsis" aria-label="More actions" />{/snippet}
        </Menu>
      </div>
    </div>
  </div>
  <!-- The tab list runs along the card's top edge; panels pad themselves. -->
  <Card flush>
    <Tabs bind:value={tab} classes={{ list: 'px-3', panels: 'pt-0' }}>
      <Tab value="overview" label="Overview">
        <div class="flex flex-wrap items-start gap-6 p-5">
          <DataList labelWidth="7rem" class="min-w-0 flex-[3_1_20rem]" items={[
            { label: 'Email', value: 'ada.lovelace@example.com' },
            { label: 'Parent', value: 'Anne Byron, 07700 900123' },
            { label: 'School', value: 'St Mary’s High' },
            { label: 'Rate', value: '£35 / hour' },
            { label: 'Since', value: 'September 2025' },
          ]} />
          <div class="min-w-0 flex-[2_1_14rem] rounded-[calc(var(--ui-radius)+2px)] bg-(--ui-canvas) p-4">
            <Stats columns={2}>
              <Stat size="sm" label="Lessons" value={24} />
              <Stat size="sm" label="Attendance" value="92" unit="%" />
              <Stat size="sm" label="Paid" value="£840" />
              <Stat size="sm" label="Owed" value="£35" help="Due 15 Oct" />
            </Stats>
          </div>
        </div>
      </Tab>
      <Tab value="lessons" label="Lessons"><Table flush columns={lessonColumns} rows={lessons} /></Tab>
      <Tab value="notes" label="Notes">
        <div class="p-5">
          <Timeline>
            <TimelineItem title="Confident with fractions" time="1 Oct" icon="lucide:notebook-pen" description="Start on percentages next week." />
            <TimelineItem title="Homework set" time="24 Sep" icon="lucide:book-open" color="accent" description="Worksheet 4, due 1 October." />
            <TimelineItem title="First lesson" time="10 Sep" icon="lucide:sparkles" color="success" description="Assessment and goals for the year." />
          </Timeline>
        </div>
      </Tab>
    </Tabs>
  </Card>
</div>
