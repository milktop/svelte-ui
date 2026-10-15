<!-- A tutor's week
  Drag down an empty part of a day to select a time (or click one slot) and book it; drag along the all-day strip (or click a day there) to add an all-day event. Drag a lesson to move it, or its bottom edge to change its length; or focus it and use the arrow keys (Shift+↑↓ for its length). Click the title to jump to a date, or a day's header to open that day (`ondayclick`); switch views on the right. `onrangechange` reports the days shown, to load them. All-day events (half term, mock exams) sit along the top. -->
<script>
  import { EventCalendar, confirm, toaster } from '@milktop/svelte-ui'
  import { lessons as initial } from './lessons.js'

  const time = (iso) => iso.slice(11)
  let lessons = $state(initial)
  // Bound, so a click on a day's header can open that day.
  let view = $state('week')
  let date = $state(new Date().toLocaleDateString('sv'))  // today, as YYYY-MM-DD (local)
  let range = $state('')

  // A time: a lesson. Days in the all-day strip: an all-day event (a holiday, an exam day).
  async function book({ start, end, allDay }) {
    const when = allDay ? (start === end ? start : `${start} to ${end}`) : `${start.slice(0, 10)}, ${time(start)} to ${time(end)}`
    if (!await confirm({ heading: allDay ? 'Add an all-day event?' : 'Book a lesson?', description: when, confirmLabel: allDay ? 'Add' : 'Book' })) return
    lessons = [...lessons, allDay
      ? { id: Date.now(), title: 'Day off', student: '', subject: '', start, end, allDay: true, color: 'neutral' }
      : { id: Date.now(), title: 'New lesson', student: 'New student', subject: 'Maths', start, end }]
  }

  function update({ event, change }) {
    lessons = lessons.map((l) => (l.id === event.id ? { ...l, ...change } : l))
  }
</script>

<EventCalendar events={lessons} views={['day', 3, 'workweek', 'week']} onslotselect={book} oneventchange={update} selectable editable clickableDays
  bind:view bind:date
  ondayclick={(day) => { date = day; view = 'day' }}
  onrangechange={({ start, end }) => (range = `${start} to ${end}`)}
  oneventclick={(lesson) => toaster.info({ title: String(lesson.title), description: lesson.subject })} />
<p class="m-0 w-full text-sm text-(--ui-muted)">onrangechange: load {range}</p>
