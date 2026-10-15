<!-- Weekdays, your own content
  `view="workweek"` and the hours you teach; the `event` snippet draws each lesson (an avatar and the subject); the `actions` snippet sits in the toolbar. Without `selectable` or `editable` it's read only. -->
<script>
  import { EventCalendar, Avatar, Button } from '@milktop/svelte-ui'
  import { lessons } from './lessons.js'
</script>

<EventCalendar events={lessons.filter((l) => !l.allDay)} view="workweek" views={[]} startHour={9} endHour={19}>
  {#snippet actions()}<Button size="sm" variant="primary" icon="lucide:calendar-plus">Book</Button>{/snippet}
  {#snippet event({ event: lesson })}
    <span class="flex min-w-0 items-start gap-1.5">
      <Avatar size={20} name={lesson.student} color="auto" />
      <span class="min-w-0"><span class="block truncate font-semibold">{lesson.student}</span>
        <span class="block truncate text-(--ui-muted)">{lesson.subject}</span></span>
    </span>
  {/snippet}
</EventCalendar>
