<!-- Dashboard
  A greeting with the main actions, a row of stats, a revenue chart, then upcoming lessons beside recent activity. -->
<script>
  import { Button, Stats, Stat, Card, Segmented, AreaChart, Table, Avatar, Timeline } from '@milktop/svelte-ui'
  import { upcoming, activity, revenue } from '../data.js'

  let range = $state(7)
  const columns = [
    { key: 'student', label: 'Student', cell: student },
    { key: 'subject', label: 'Subject' },
    { key: 'when', label: 'When' },
    { key: 'length', label: 'Length', align: 'end' },
  ]
</script>

{#snippet student({ row })}<span class="flex items-center gap-2.5"><Avatar size="sm" name={row.student} />{row.student}</span>{/snippet}

<div class="flex flex-col gap-6">
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <h2 class="m-0 text-xl font-bold">Good morning, Grace</h2>
      <p class="mt-1 mb-0 text-sm text-(--ui-muted)">You have 2 lessons today and 3 invoices to send.</p>
    </div>
    <div class="flex gap-2">
      <Button icon="lucide:receipt">New invoice</Button>
      <Button variant="primary" icon="lucide:calendar-plus">Book lesson</Button>
    </div>
  </div>
  <Stats variant="cards">
    <Stat icon="lucide:users" label="Active students" value={31} change={6.9} changeLabel="this month" />
    <Stat icon="lucide:calendar-check" label="Lessons" value={52} change={12.5} changeLabel="vs September" />
    <Stat icon="lucide:clock" label="Hours taught" value="48.5" unit="h" change={-2.1} />
    <Stat icon="lucide:wallet" label="Outstanding" value="£320" change={15} invert />
  </Stats>
  <Card heading="Revenue" description="Paid and outstanding, by month">
    {#snippet actions()}<Segmented items={[{ value: 3, label: '3m' }, { value: 7, label: '7m' }]} bind:value={range} />{/snippet}
    <AreaChart data={revenue.slice(-range)} x="month" height={220} label="Revenue by month"
      series={[{ key: 'paid', label: 'Paid' }, { key: 'owed', label: 'Outstanding', color: 'var(--ui-chart-3)' }]}
      format={(v) => `£${v.toLocaleString()}`} />
  </Card>
  <!-- Side by side when there's room, stacked when not. -->
  <div class="flex flex-wrap items-start gap-6">
    <section class="min-w-0 flex-[2_1_28rem]">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="m-0 text-base font-semibold">Upcoming lessons</h3>
        <Button size="sm" variant="ghost" iconEnd="lucide:arrow-right">Calendar</Button>
      </div>
      <Table {columns} rows={upcoming} />
    </section>
    <Card heading="Recent activity" class="min-w-0 flex-[1_1_16rem]"><Timeline size="sm" items={activity} /></Card>
  </div>
</div>
