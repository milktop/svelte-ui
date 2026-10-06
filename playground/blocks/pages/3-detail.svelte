<!-- Detail page
  A lesson: its header, then the plan, homework, files and activity beside its details, payment and progress. -->
<script>
  import { Breadcrumbs, Badge, Button, Menu, Card, CheckboxGroup, Attachments, Timeline, DataList, DataItem, Avatar, Stat, Sparkline } from '@milktop/svelte-ui'

  const objectives = ['Compare fractions with different denominators', 'Convert fractions to decimals', 'Order a mixed list of fractions and decimals']
  let met = $state(['Compare fractions with different denominators'])
  const homework = [
    { title: 'Worksheet 4: equivalent fractions', due: 'Due Thu 15 Oct', status: 'Set' },
    { title: 'Times tables practice (7s and 8s)', due: 'Due Mon 12 Oct', status: 'Done' },
  ]
  let files = $state([
    { name: 'Lesson slides.pdf', size: 2516582, type: 'application/pdf' },
    { name: 'Worksheet 4.pdf', size: 491520, type: 'application/pdf' },
    { name: 'Mock results.xlsx', size: 48000 },
  ])
  const actions = [
    { value: 'reschedule', label: 'Reschedule', icon: 'lucide:calendar-clock' },
    { value: 'duplicate', label: 'Duplicate', icon: 'lucide:copy' },
    { separator: true },
    { value: 'cancel', label: 'Cancel lesson', icon: 'lucide:calendar-x', danger: true },
  ]
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col gap-3">
    <Breadcrumbs items={[{ label: 'Lessons', href: '#' }, { label: 'October', href: '#' }, { label: 'Fractions and decimals' }]} />
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div class="flex flex-wrap items-center gap-3"><h2 class="m-0 text-xl font-bold">Fractions and decimals</h2><Badge variant="accent" dot>Booked</Badge></div>
        <div class="mt-2 flex flex-wrap gap-4 text-sm text-(--ui-muted) [&>span]:inline-flex [&>span]:items-center [&>span]:gap-1.5">
          <span><iconify-icon icon="lucide:calendar"></iconify-icon>Thursday 8 October</span>
          <span><iconify-icon icon="lucide:clock"></iconify-icon>16:00–17:00</span>
          <span><iconify-icon icon="lucide:video"></iconify-icon>Online</span>
        </div>
      </div>
      <div class="flex gap-2">
        <Button icon="lucide:pencil">Edit</Button>
        <Button variant="primary" icon="lucide:video">Join</Button>
        <Menu items={actions} placement="bottom-end">
          {#snippet trigger(props)}<Button {...props} icon="lucide:ellipsis" aria-label="More actions" />{/snippet}
        </Menu>
      </div>
    </div>
  </div>
  <!-- Main and aside side by side when there's room. -->
  <div class="flex flex-wrap items-start gap-6">
    <div class="flex min-w-0 flex-[2_1_28rem] flex-col gap-6">
      <Card heading="Lesson plan">
        <p class="m-0 text-sm leading-relaxed text-(--ui-muted)">Recap equivalent fractions, then move on to converting between fractions and decimals using place value. Finish with a short ordering activity.</p>
        <CheckboxGroup label="Objectives" items={objectives} bind:value={met} class="mt-4" />
      </Card>
      <Card flush heading="Homework">
        {#snippet actions()}<Button size="sm" icon="lucide:plus">Set homework</Button>{/snippet}
        <ul class="m-0 flex list-none flex-col p-0">
          {#each homework as item}
            <li class="flex items-center gap-3 border-b border-(--ui-border) px-5 py-3 last:border-0">
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-(--ui-radius) bg-(--ui-hover) text-lg text-(--ui-muted)"><iconify-icon icon="lucide:book-open"></iconify-icon></span>
              <div class="min-w-0 grow"><div class="font-medium">{item.title}</div><div class="text-xs text-(--ui-muted)">{item.due}</div></div>
              <Badge variant={item.status === 'Done' ? 'success' : 'neutral'}>{item.status}</Badge>
            </li>
          {/each}
        </ul>
      </Card>
      <Card heading="Files" description="Shared with Ada and her parent"><Attachments bind:items={files} removable addable /></Card>
      <Card heading="Activity">
        <Timeline size="sm" items={[
          { title: 'Grace added the lesson slides', time: '2h ago', color: 'accent' },
          { title: 'Anne confirmed the time', time: 'Yesterday', color: 'success' },
          { title: 'Lesson booked', time: '1 Oct' },
        ]} />
      </Card>
    </div>
    <div class="flex min-w-0 flex-[1_1_16rem] flex-col gap-6">
      <Card heading="Details">
        <DataList labelWidth="6rem">
          <DataItem label="Student"><span class="inline-flex items-center gap-2"><Avatar size="sm" name="Ada Lovelace" />Ada Lovelace</span></DataItem>
          <DataItem label="Tutor">Grace Hopper</DataItem>
          <DataItem label="Subject">GCSE Maths</DataItem>
          <DataItem label="Length">60 minutes</DataItem>
          <DataItem label="Rate">£35 / hour</DataItem>
        </DataList>
      </Card>
      <Card heading="Payment">
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between"><span class="text-2xl font-bold">£35</span><Badge variant="warning" dot>Unpaid</Badge></div>
          <Button block variant="primary" icon="lucide:send">Send invoice</Button>
        </div>
      </Card>
      <Card heading="Progress" description="Score in end-of-lesson quizzes">
        <div class="flex flex-col gap-3">
          <Stat label="Last 6 lessons" value="78" unit="%" change={9} changeUnit=" pts" changeLabel="since September" />
          <Sparkline data={[58, 62, 60, 69, 72, 78]} variant="area" height={48} label="Quiz scores: 58, 62, 60, 69, 72, 78 per cent" />
        </div>
      </Card>
    </div>
  </div>
</div>
