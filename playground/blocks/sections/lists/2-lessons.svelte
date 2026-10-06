<!-- Lessons
  A date tile, what and when, and a status. -->
<script>
  import { Badge } from '@milktop/svelte-ui'

  const lessons = [
    { day: '08', month: 'Oct', title: 'Maths with Ada Lovelace', time: 'Thu 16:00–17:00 · Online', status: 'Confirmed' },
    { day: '09', month: 'Oct', title: 'Physics with Alan Turing', time: 'Fri 10:00–10:45 · Room 4', status: 'Confirmed' },
    { day: '12', month: 'Oct', title: 'English with Grace Hopper', time: 'Mon 15:30–16:30 · Online', status: 'Unpaid' },
  ]
</script>

<ul class="m-0 flex list-none flex-col gap-2 p-0">
  {#each lessons as lesson}
    <li class="flex items-center gap-4 rounded-[calc(var(--ui-radius)+4px)] border border-(--ui-border) bg-(--ui-surface) p-3">
      <div class="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-(--ui-radius) bg-(--ui-accent-soft) leading-none text-(--ui-accent-soft-text)">
        <b class="text-lg font-bold">{lesson.day}</b><span class="mt-0.5 text-xs uppercase">{lesson.month}</span>
      </div>
      <div class="min-w-0 grow">
        <div class="font-medium">{lesson.title}</div>
        <div class="mt-0.5 text-xs text-(--ui-muted)">{lesson.time}</div>
      </div>
      <Badge variant={lesson.status === 'Unpaid' ? 'warning' : 'success'} dot>{lesson.status}</Badge>
    </li>
  {/each}
</ul>
