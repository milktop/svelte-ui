<!--
  An event calendar: a day, a few days or a week across, hours down, and
  optionally a column per resource (a tutor, a vet, a room) within each day.
  Events sit by their times, side by side where they overlap; all-day and
  multi-day events sit in a strip along the top.

  <EventCalendar events={lessons} selectable editable onslotselect={book} oneventclick={open} oneventchange={move} />
  <EventCalendar view="day" resources={vets} slotMinutes={15} events={appointments} bind:date={day} />

  Times are local ISO strings ('2026-10-14T16:00'), as the date picker's
  dates are; an all-day event has dates only ('2026-10-14', its `end` the
  last day).

  - `events`: `{ id, title, start, end, allDay, resourceId, color, editable,
    blocked, pending }`; `color` is 'accent' (default), 'success', 'warning',
    'danger', 'neutral' or any CSS colour; `editable: false` fixes one;
    `blocked` draws it hatched (time taken out, not an appointment);
    `pending` faded and fixed (saving)
  - `resources`: `{ id, title, color, hours, offLabel }`: a column each, per
    day; events go in their `resourceId`'s column. `color` tints its header,
    hover, selections and drops, and is its events' colour unless they set
    their own. `hours`: when it's available on each day shown, as
    `[{ start: '08:00', end: '13:00' }]` (`[]` for not at all): the rest is
    shaded and refused, with `offLabel` as the reason
  - `resourceViews`: the views split into a column per resource (all of
    them by default), e.g. ['day']: the other views show everyone's events
    together, in their resource's colour
  - `view`: bindable; 'day', 'week' (default), 'workweek', or a number of
    days from `date`. On a narrow screen it shows a day
  - `views`: the toolbar's choices (['day', 'week']; [] for none)
  - `date`: bindable; a day in the range shown (today by default)
  - `weekStartsOn`: 1 (Monday, default) or 0
  - `startHour`, `endHour`: the hours shown (7 to 21)
  - `slotMinutes`: what selecting, moving and resizing snap to (30)
  - `hourHeight`: a CSS length ('3rem')
  - `height`: a CSS length: the hours scroll inside it under the headers
  - `scrollToTime`: where it opens scrolled to ('08:00', or 'now'), once
  - `rows`: extra rows above the all-day strip, a cell per day (or per column
    with `perColumn`), e.g. the day's messages: `{ key, label, cell,
    perColumn, clickable }`; `cell` is a snippet given `{ date, resource }`;
    a `clickable` row's cells call `onrowclick`
  - `allDayMax`: all-day lanes shown before a "+2 more" (3)
  - `selectable`: an empty slot can be clicked, or a time dragged out (or
    days in the all-day strip): calls `onslotselect`
  - `editable`: events can be moved and resized: drag one to another time,
    day or resource, or its bottom edge to change its length; or focus it and
    use ↑↓ (a slot), ←→ (a column), Shift+↑↓ (its length). Calls
    `oneventchange`; update your events in response (or don't, and it stays).
    Dragging (or selecting) near an edge scrolls the grid, or the page
  - `clickableDays`, `clickableResources`: their headers are buttons, calling
    `ondayclick` and `onresourceclick`
  - `isAvailable`: a function given `{ start, end, resourceId, allDay, event,
    shading }`, returning true, or false or the reason it isn't ('Dr Patel is
    away'): unavailable time is shaded (the reason on hover) and selecting,
    moving or resizing into it is refused (calling `onunavailable`). `event`
    is the one being moved; `shading` is true when it's only asking what to shade
  - `pinned`: bindable; an event being placed (it can be from another week):
    while set, a click on a time moves it there (through `oneventchange`,
    keeping its length); Escape or the bar's Cancel clear it
  - `eventMenu`, `slotMenu`: functions giving the items of a menu on
    right-click (or the Menu key, or Shift+F10, on a focused event), of an
    event or of an empty slot: `{ label, icon, shortcut, danger, disabled,
    onSelect }`, `{ separator: true }` or `{ group: 'Heading' }`
  - `event` snippet: an event's content, given `{ event, start, end, resource, compact }`
  - `resource` snippet: a resource header's content, given the resource
  - `dayHeader` snippet: a day header's content, given `{ date, events,
    resources }` (that day's events, e.g. who's in, in a view without their columns)
  - `eventLabel`: a function giving what screen readers call an event (its
    title by default)
  - `translations`: its words, over the app's (uiLocale)
  - `locale`: for dates and times (the app's by default)
  - `toolbar`: false hides it; the `actions` snippet goes at its end

  Callbacks: `onslotselect` ({ start, end, resourceId, allDay, keys }: `keys`
  says which of Shift, Alt, Ctrl and ⌘ were held), `oneventclick` (the event),
  `oneventchange` ({ event, change: { start, end, resourceId }, kind: 'move'
  or 'resize' }), `ondayclick` (an ISO date), `onresourceclick` ({ resource,
  date }), `onrowclick` ({ key, date, resource }), `onrangechange` ({ start,
  end, view }: the days shown, when they change: load their events) and
  `onunavailable` ({ reason, attempt }).
-->
<script>
  import { untrack } from 'svelte'
  import '../icons.js'
  import Button from '../button/Button.svelte'
  import Popover from '../popover/Popover.svelte'
  import DatePicker from '../date-picker/DatePicker.svelte'
  import Segmented from '../segmented/Segmented.svelte'
  import Menu from '../menu/Menu.svelte'
  import {
    toISODate, toISODateTime, parseLocal, addDays, addMinutes, minutesOfDay, sameDay, minutesBetween, startOfWeek,
  } from './dates.js'
  import { cx, partsOf } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './event-calendar.css'

  let {
    events = [], resources = null, resourceViews = null, view = $bindable('week'), views = ['day', 'week'], date = $bindable(null),
    weekStartsOn = 1, startHour = 7, endHour = 21, slotMinutes = 30, hourHeight = '3rem', height = null, scrollToTime = null,
    rows = [], allDayMax = 3, selectable = false, editable = false, clickableDays = false, clickableResources = false,
    isAvailable = null, pinned = $bindable(null), eventMenu = null, slotMenu = null, eventLabel = null, translations = null,
    locale = null, toolbar = true,
    event: eventSnippet = null, resource: resourceSnippet = null, dayHeader = null, actions = null,
    onslotselect = null, oneventclick = null, oneventchange = null, ondayclick = null, onresourceclick = null, onrowclick = null,
    onrangechange = null, onunavailable = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('event-calendar', () => classes)
  const t = $derived({ ...uiLocale.messages.calendar, ...translations })
  const currentLocale = $derived(locale ?? uiLocale.locale)

  const named = ['accent', 'success', 'warning', 'danger', 'neutral']
  // A named colour as its token, or a CSS colour as it is.
  const cssColor = (color) =>
    ({ accent: 'var(--ui-accent)', success: 'var(--ui-success)', warning: 'var(--ui-warning)', danger: 'var(--ui-danger)', neutral: 'var(--ui-muted)' })[color] ?? color
  const colorKey = (color) => (named.includes(color) ? color : 'custom')

  const formats = new Map()
  function formatter(options) {
    const key = `${currentLocale}|${JSON.stringify(options)}`
    if (!formats.has(key)) formats.set(key, new Intl.DateTimeFormat(currentLocale, options))
    return formats.get(key)
  }

  const isAllDay = (event) =>
    !!event.allDay || !String(event.start).includes('T') || String(event.start).slice(0, 10) !== String(event.end).slice(0, 10)

  // A day's events, side by side where they overlap: each takes the first free
  // column in its cluster of overlapping events.
  function layoutDay(list) {
    const sorted = list.map((event) => ({ event, start: parseLocal(event.start), end: parseLocal(event.end) }))
    sorted.sort((a, b) => (a.start - b.start) || (b.end - a.end))
    const placed = []
    let cluster = []
    let clusterEnd = 0
    const close = () => {
      const count = Math.max(1, ...cluster.map((item) => item.column + 1))
      for (const item of cluster) item.columns = count
      cluster = []
    }
    for (const item of sorted) {
      if (cluster.length && item.start.getTime() >= clusterEnd) close()
      const taken = cluster.filter((other) => other.end > item.start).map((other) => other.column)
      let column = 0
      while (taken.includes(column)) column++
      const entry = { ...item, column, columns: 1 }
      cluster.push(entry)
      placed.push(entry)
      clusterEnd = Math.max(clusterEnd, item.end.getTime())
    }
    close()
    return placed
  }

  // ---- The width (a phone shows a day), the minute, and Escape while placing.
  let rootEl = $state()
  let gridEl = $state()
  let narrow = $state(false)
  let now = $state(new Date())
  let picking = $state(false)
  let allDayOpen = $state(false)
  let status = $state('')
  let preview = $state(null)
  let hoverSlot = $state(null)
  let menuEntries = $state([])
  let menuActions = []
  let gesture = null
  let scrolling = false
  let suppressClick = false
  let refocus = null

  $effect(() => {
    const observer = new ResizeObserver(() => { narrow = rootEl.clientWidth > 0 && rootEl.clientWidth < 640 })
    observer.observe(rootEl)
    const clock = setInterval(() => (now = new Date()), 60000)
    return () => {
      observer.disconnect()
      clearInterval(clock)
    }
  })

  function onkeydown(e) {
    if (e.key === 'Escape' && pinned) pinned = null
  }

  // ---- What's shown.
  const today = $derived(toISODate(now))
  const shownView = $derived(narrow ? 'day' : view)
  const current = $derived(parseLocal(date ?? today))
  const first = $derived(shownView === 'week' ? startOfWeek(current, weekStartsOn) : shownView === 'workweek' ? startOfWeek(current, 1) : current)
  const dayCount = $derived(shownView === 'day' ? 1 : shownView === 'week' ? 7 : shownView === 'workweek' ? 5 : Math.max(1, Number(shownView) || 1))
  const step = $derived(shownView === 'week' || shownView === 'workweek' ? 7 : dayCount)
  // A column per resource in this view, or everyone's events together.
  const split = $derived(!!resources?.length && (!resourceViews || resourceViews.includes(shownView)))
  const lanes = $derived(split ? resources : [null])
  const span = $derived((endHour - startHour) * 60)
  const dates = $derived(Array.from({ length: dayCount }, (_, i) => addDays(first, i)))
  const columns = $derived(dates.flatMap((d) => lanes.map((resource) => ({ date: d, iso: toISODate(d), resource }))))
  const hours = $derived(Array.from({ length: endHour - startHour }, (_, i) => startHour + i))
  const twoRows = $derived(split && dayCount > 1)

  const viewLabel = (v) => (v === 'day' ? t.day : v === 'week' ? t.week : v === 'workweek' ? t.workweek : t.days(v))
  const top = (minutes) => `${((minutes - startHour * 60) / span) * 100}%`
  const length = (minutes) => `${(minutes / span) * 100}%`
  const snap = (minutes) => Math.floor(minutes / slotMinutes) * slotMinutes
  const nameOf = (event) => (eventLabel ? eventLabel(event) : typeof event.title === 'string' ? event.title : t.event)
  const resourceName = (column) => (column?.resource && typeof column.resource.title === 'string' ? `, ${column.resource.title}` : '')
  const resourceOf = (id) => (id == null ? null : (resources ?? []).find((resource) => resource.id === id))
  const columnOf = (event, iso) => columns.findIndex((column) => column.iso === iso && (!split || column.resource?.id === event.resourceId))
  const canEdit = (event) => editable && event.editable !== false && !event.pending

  const timeText = (d) => formatter({ hour: 'numeric', minute: '2-digit' }).format(d)
  const longDayText = (d) => formatter({ weekday: 'long', day: 'numeric', month: 'long' }).format(d)

  // ---- Availability: null, or the reason it isn't.
  const clock = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5))

  function hoursReason(query) {
    const resource = resourceOf(query.resourceId)
    const open = resource?.hours
    if (!open || query.allDay) return null
    const from = clock(query.start.slice(11))
    const to = query.end.slice(0, 10) === query.start.slice(0, 10) ? clock(query.end.slice(11)) : 24 * 60
    return open.some((h) => from >= clock(h.start) && to <= clock(h.end)) ? null : resource.offLabel ?? t.unavailable
  }

  function reasonFor(query) {
    const off = hoursReason(query)
    if (off) return off
    const answer = isAvailable ? isAvailable(query) : true
    return answer === true || answer == null ? null : answer === false ? t.unavailable : answer
  }

  function timed(column, from, to, event = null) {
    const query = { start: toISODateTime(addMinutes(column.date, from)), end: toISODateTime(addMinutes(column.date, to)), allDay: false }
    if (column.resource) query.resourceId = column.resource.id
    if (event) query.event = event
    return query
  }

  // A column's unavailable time, slot by slot, merged into runs with one reason.
  function unavailableRuns(column) {
    if (!isAvailable && !column.resource?.hours) return []
    const runs = []
    for (let from = startHour * 60; from < endHour * 60; from += slotMinutes) {
      const reason = reasonFor({ ...timed(column, from, from + slotMinutes), shading: true })
      const last = runs.at(-1)
      if (!reason) continue
      if (last && last.to === from && last.reason === reason) last.to = from + slotMinutes
      else runs.push({ from, to: from + slotMinutes, reason })
    }
    return runs
  }

  // Worked out again only when what they depend on changes (the columns, the
  // events, isAvailable…), not on every pointer move while dragging.
  const shading = $derived(columns.map(unavailableRuns))
  const timedByColumn = $derived.by(() => {
    const list = (events ?? []).filter((event) => !isAllDay(event))
    return columns.map((column) =>
      layoutDay(list.filter((event) => String(event.start).startsWith(column.iso) && (!column.resource || event.resourceId === column.resource.id))))
  })

  function refuse(reason, attempt) {
    status = reason
    onunavailable?.({ reason, attempt })
  }

  // ---- Changing events: by pointer (previewed until dropped) or by keyboard.
  // `byMinutes` kept to the day's hours: an event moves or grows no further
  // than the grid shows.
  function withinHours(event, kind, byMinutes) {
    const start = parseLocal(event.start)
    const from = minutesOfDay(start)
    const to = from + minutesBetween(start, parseLocal(event.end))
    const latest = Math.max(0, endHour * 60 - to)
    // A move stays after the first hour; a resize keeps at least a slot.
    const earliest = kind === 'move' ? Math.min(0, startHour * 60 - from) : Math.min(0, slotMinutes - (to - from))
    return Math.max(earliest, Math.min(latest, byMinutes))
  }

  // Where a pinned event placed at `minute` starts: on a slot, ending by the last hour.
  function placeAt(minute) {
    if (!pinned) return minute
    const duration = minutesBetween(parseLocal(pinned.start), parseLocal(pinned.end)) || slotMinutes
    const latest = startHour * 60 + Math.floor((span - duration) / slotMinutes) * slotMinutes
    return Math.max(startHour * 60, Math.min(latest, minute))
  }

  // Where an event would go if moved by `byColumns` and `byMinutes` (or resized).
  function target(event, kind, byColumns, byMinutes) {
    const start = parseLocal(event.start)
    const end = parseLocal(event.end)
    const from = columnOf(event, String(event.start).slice(0, 10))
    if (from < 0) return null
    byMinutes = withinHours(event, kind, byMinutes)
    if (!byColumns && !byMinutes) return null
    if (kind === 'resize') {
      const newEnd = addMinutes(end, byMinutes)
      if (minutesBetween(start, newEnd) < slotMinutes) return null
      return { start, end: newEnd, column: columns[from] }
    }
    const column = columns[Math.max(0, Math.min(columns.length - 1, from + byColumns))]
    const days = Math.round((column.date - columns[from].date) / 86400000)
    return { start: addMinutes(addDays(start, days), byMinutes), end: addMinutes(addDays(end, days), byMinutes), column }
  }

  function queryFor(event, next) {
    const query = { start: toISODateTime(next.start), end: toISODateTime(next.end), allDay: false, event }
    // Its new column's resource, or (in a view without their columns) its own.
    const resourceId = next.column.resource ? next.column.resource.id : event.resourceId
    if (resourceId != null) query.resourceId = resourceId
    return query
  }

  // Applies a change, once it's checked to be allowed.
  function applyChange(event, kind, next) {
    const query = queryFor(event, next)
    const reason = reasonFor(query)
    if (reason) return refuse(reason, query)
    refocus = event.id
    status = kind === 'resize'
      ? t.resized(nameOf(event), timeText(next.end))
      : t.moved(nameOf(event), `${longDayText(next.start)}, ${timeText(next.start)}${resourceName(next.column)}`)
    const change = { start: query.start, end: query.end }
    if (next.column.resource) change.resourceId = next.column.resource.id
    if (kind === 'move' && pinned?.id === event.id) pinned = null
    oneventchange?.({ event, change, kind })
  }

  function change(event, kind, byColumns, byMinutes) {
    const next = target(event, kind, byColumns, byMinutes)
    if (next) applyChange(event, kind, next)
  }

  const keysOf = (e) => ({ shiftKey: e.shiftKey, altKey: e.altKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey })
  const minuteAt = (y, box) => startHour * 60 + snap(Math.max(0, Math.min(span - 1, ((y - box.top) / box.height) * span)))
  // The minute of the day at a height in a day column (not snapped).
  const exactMinute = (y, box) => startHour * 60 + Math.max(0, Math.min(span - 1, ((y - box.top) / box.height) * span))

  function startGesture(e, kind, column, event = null) {
    if (e.button !== 0) return
    e.stopPropagation()
    try { if (e instanceof PointerEvent) e.currentTarget.setPointerCapture(e.pointerId) } catch {}
    // Where things are scrolled at the start: a drag near an edge scrolls
    // the grid (or the page), and positions are measured again as it does.
    const scroll = { left: gridEl.scrollLeft, x: scrollX }
    const base = { kind, x: e.clientX, y: e.clientY, lastX: e.clientX, lastY: e.clientY, moved: false, keys: keysOf(e), scroll }
    if (kind === 'all-day') {
      // The strip spans every column: which one is under the pointer.
      const box = e.currentTarget.getBoundingClientRect()
      const width = box.width / columns.length
      const at = Math.max(0, Math.min(columns.length - 1, Math.floor((e.clientX - box.left) / width)))
      gesture = { ...base, column: at, strip: e.currentTarget, width, from: at }
      preview = { kind: 'all-day', columns: [at] }
      return
    }
    const day = e.currentTarget.closest('[data-part=day]')
    const box = day.getBoundingClientRect()
    const from = minuteAt(e.clientY, box)
    gesture = { ...base, column, day, width: box.width, from, exact: exactMinute(e.clientY, box), event }
    if (kind === 'select') preview = { kind: 'select', column, from, to: from + slotMinutes }
    if (kind === 'place') preview = { kind: 'place', column, from: placeAt(from) }
  }

  // The columns from one to another (with resources, only the first one's resource).
  function columnRange(a, b) {
    const lo = Math.min(a, b)
    const hi = Math.max(a, b)
    return columns.map((_, i) => i).filter((i) => i >= lo && i <= hi && columns[i].resource === columns[a].resource)
  }

  function track(e) {
    const g = gesture
    if (!g) return
    g.lastX = e.clientX
    g.lastY = e.clientY
    if (!g.moved && Math.hypot(e.clientX - g.x, e.clientY - g.y) < 4) return
    g.moved = true
    updatePreview()
    autoScroll()
  }

  // The preview from the pointer's last position, measured afresh, so it
  // stays right while the grid or the page scrolls under it.
  function updatePreview() {
    const g = gesture
    if (!g) return
    const scrolledX = gridEl.scrollLeft - g.scroll.left + scrollX - g.scroll.x
    if (g.kind === 'all-day') {
      const box = g.strip.getBoundingClientRect()
      const at = Math.max(0, Math.min(columns.length - 1, Math.floor((g.lastX - box.left) / g.width)))
      preview = { kind: 'all-day', columns: columnRange(g.from, at) }
      return
    }
    const box = g.day.getBoundingClientRect()
    const perMinute = box.height / span
    if (g.kind === 'select') {
      const at = minuteAt(g.lastY, box)
      preview = { kind: 'select', column: g.column, from: Math.min(g.from, at), to: Math.max(g.from, at) + slotMinutes }
    } else if (g.kind === 'place') {
      preview = { kind: 'place', column: g.column, from: placeAt(minuteAt(g.lastY, box)) }
    } else {
      let byMinutes = Math.round((exactMinute(g.lastY, box) - g.exact) / slotMinutes) * slotMinutes
      if (g.kind === 'move') {
        const byColumns = Math.round((g.lastX - g.x + scrolledX) / g.width)
        byMinutes = withinHours(g.event, 'move', byMinutes)
        preview = { kind: 'move', id: g.event.id, columns: byColumns, minutes: byMinutes, x: byColumns * g.width, y: byMinutes * perMinute }
      } else {
        preview = { kind: 'resize', id: g.event.id, minutes: withinHours(g.event, 'resize', byMinutes) }
      }
    }
  }

  // The nearest ancestor that scrolls up and down, or the document.
  function scrollParent() {
    let el = rootEl.parentElement
    while (el && el !== document.body) {
      const overflow = getComputedStyle(el).overflowY
      if ((overflow === 'auto' || overflow === 'scroll') && el.scrollHeight > el.clientHeight + 1) return el
      el = el.parentElement
    }
    return document.scrollingElement
  }

  // Near an edge while dragging: scroll that way, faster the closer it is,
  // each frame until the pointer moves away or lets go. Up and down scrolls
  // the grid when it has a `height` (below its sticky headers), or else the
  // page; sideways, the grid when it's wider than its box.
  function autoScroll() {
    if (scrolling) return
    scrolling = true
    // Each loop belongs to one gesture: one left over from the last drag stops.
    const mine = gesture
    const frame = () => {
      const g = gesture
      if (!g || g !== mine || !g.moved) return (scrolling = false)
      const box = gridEl.getBoundingClientRect()
      const edge = 48
      const speed = (near) => Math.ceil(Math.min(1, Math.max(0, (edge - near) / edge)) * 18)
      let vy = 0
      let vx = 0
      if (g.kind !== 'all-day') {
        if (gridEl.scrollHeight > gridEl.clientHeight + 1) {
          const gridTop = box.top + (parseFloat(gridEl.style.getPropertyValue('--sticky-total')) || 0)
          vy = g.lastY < gridTop + edge ? -speed(g.lastY - gridTop) : g.lastY > box.bottom - edge ? speed(box.bottom - g.lastY) : 0
          const before = gridEl.scrollTop
          gridEl.scrollTop += vy
          if (gridEl.scrollTop === before) vy = 0
        } else {
          // Whatever scrolls the page: an app shell's page, or the document
          // (whose top can sit under a fixed top bar).
          const scroller = scrollParent()
          const page = scroller === document.scrollingElement
          const area = page ? { top: 64, bottom: innerHeight } : scroller.getBoundingClientRect()
          vy = g.lastY < area.top + edge ? -speed(g.lastY - area.top) : g.lastY > area.bottom - edge ? speed(area.bottom - g.lastY) : 0
          const before = scroller.scrollTop
          scroller.scrollTop += vy
          // Already at the end: nothing more to scroll.
          if (scroller.scrollTop === before) vy = 0
        }
      }
      if (gridEl.scrollWidth > gridEl.clientWidth + 1) {
        const left = box.left + (gridEl.querySelector('[data-part=gutter]')?.offsetWidth ?? 0)
        vx = g.lastX < left + edge ? -speed(g.lastX - left) : g.lastX > box.right - edge ? speed(box.right - g.lastX) : 0
        const before = gridEl.scrollLeft
        gridEl.scrollLeft += vx
        if (gridEl.scrollLeft === before) vx = 0
      }
      if (!vx && !vy) return (scrolling = false)
      updatePreview()
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  function finish() {
    const g = gesture
    gesture = null
    scrolling = false
    const p = preview
    preview = null
    if (!g) return
    if (g.kind === 'select' && p?.kind === 'select') {
      const column = columns[g.column]
      const query = timed(column, p.from, p.to)
      const reason = reasonFor(query)
      if (reason) return refuse(reason, query)
      status = t.selected(`${longDayText(addMinutes(column.date, p.from))}, ${timeText(addMinutes(column.date, p.from))} – ${timeText(addMinutes(column.date, p.to))}${resourceName(column)}`)
      return onslotselect?.({ ...query, keys: g.keys })
    }
    if (g.kind === 'all-day' && p?.kind === 'all-day') {
      const a = columns[p.columns[0]]
      const b = columns[p.columns.at(-1)]
      const query = { start: a.iso, end: b.iso, allDay: true }
      if (a.resource) query.resourceId = a.resource.id
      const reason = reasonFor(query)
      if (reason) return refuse(reason, query)
      status = t.selected(`${longDayText(a.date)}${p.columns.length > 1 ? ` – ${longDayText(b.date)}` : ''}, ${t.allDay.toLowerCase()}${resourceName(a)}`)
      return onslotselect?.({ ...query, keys: g.keys })
    }
    if (g.kind === 'place' && p?.kind === 'place' && pinned) {
      const duration = minutesBetween(parseLocal(pinned.start), parseLocal(pinned.end)) || slotMinutes
      const column = columns[p.column]
      return applyChange(pinned, 'move', { start: addMinutes(column.date, p.from), end: addMinutes(column.date, p.from + duration), column })
    }
    if (!g.moved || !g.event) return
    // The click that follows a drag isn't a click on the event.
    suppressClick = true
    if (p?.kind === 'move' && (p.columns || p.minutes)) change(g.event, 'move', p.columns, p.minutes)
    if (p?.kind === 'resize' && p.minutes) change(g.event, 'resize', 0, p.minutes)
  }

  function cancelGesture() {
    gesture = null
    scrolling = false
    preview = null
  }

  function eventKeys(e, event) {
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      const box = e.currentTarget.getBoundingClientRect()
      if (openMenu(box.left + 8, box.bottom, eventMenu ? eventMenu(event) : null)) e.preventDefault()
      return
    }
    if (!canEdit(event)) return
    const move = { ArrowUp: [0, -slotMinutes], ArrowDown: [0, slotMinutes], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key]
    if (!move) return
    e.preventDefault()
    if (e.shiftKey && move[0] === 0) change(event, 'resize', 0, move[1])
    else change(event, 'move', move[0], move[1])
  }

  function clickEvent(event) {
    if (suppressClick) return (suppressClick = false)
    oneventclick?.(event)
  }

  const onEmpty = (e) => e.target === e.currentTarget || e.target.dataset.part === 'unavailable'

  // The slot under the pointer: tinted when it can be selected; while
  // placing a pinned event, its preview.
  function hover(e, index) {
    if (gesture) return
    const from = minuteAt(e.clientY, e.currentTarget.getBoundingClientRect())
    if (pinned) {
      const next = placeAt(from)
      if (preview?.kind === 'place' && preview.column === index && preview.from === next) return
      preview = { kind: 'place', column: index, from: next }
      return
    }
    const next = selectable && onEmpty(e) ? { column: index, from } : null
    if (next?.column === hoverSlot?.column && next?.from === hoverSlot?.from) return
    hoverSlot = next
  }

  function leaveDay() {
    hoverSlot = null
    if (pinned && !gesture) preview = null
  }

  // A press on an empty time (or its shading): select, or place the pinned event.
  function pressDay(e, index) {
    if (!onEmpty(e)) return
    if (pinned) startGesture(e, 'place', index)
    else if (selectable) startGesture(e, 'select', index)
  }

  function pressEvent(e, index, event) {
    if (canEdit(event) && !pinned) startGesture(e, 'move', index, event)
    else e.stopPropagation()
  }

  // ---- One menu, opened where it's wanted: a contextmenu event sent to its
  // hidden trigger at the point is how Zag places a menu there.
  let menuAnchor = $state()
  function openMenu(x, y, items) {
    if (!items?.length) return false
    const handlers = []
    menuEntries = items.map((item) => item.separator ? { separator: true }
      : item.group ? { group: item.group }
      : { label: item.label, icon: item.icon, shortcut: item.shortcut, danger: item.danger, disabled: item.disabled, value: handlers.push(item.onSelect ?? (() => {})) - 1 })
    menuActions = handlers
    queueMicrotask(() => menuAnchor?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: x, clientY: y })))
    return true
  }

  const runMenu = (index) => menuActions[index]?.()

  function eventContext(e, event) {
    if (openMenu(e.clientX, e.clientY, eventMenu ? eventMenu(event) : null)) e.preventDefault()
  }

  function dayContext(e, column) {
    if (!onEmpty(e)) return
    const from = minuteAt(e.clientY, e.currentTarget.getBoundingClientRect())
    if (openMenu(e.clientX, e.clientY, slotMenu ? slotMenu(timed(column, from, from + slotMinutes)) : null)) e.preventDefault()
  }

  function allDayContext(e) {
    if (e.target !== e.currentTarget) return
    const box = e.currentTarget.getBoundingClientRect()
    const column = columns[Math.max(0, Math.min(columns.length - 1, Math.floor((e.clientX - box.left) / (box.width / columns.length))))]
    const slot = { start: column.iso, end: column.iso, allDay: true }
    if (column.resource) slot.resourceId = column.resource.id
    if (openMenu(e.clientX, e.clientY, slotMenu ? slotMenu(slot) : null)) e.preventDefault()
  }

  // ---- The range reported, sticky header offsets, the first scroll, and
  // focus back on a moved event (in its new column).
  $effect(() => {
    const start = toISODate(dates[0])
    const end = toISODate(dates.at(-1))
    const shown = shownView
    untrack(() => onrangechange?.({ start, end, view: shown }))
  })

  $effect(() => {
    // Again when the header rows change.
    columns; rows; bars; allDayOpen; height
    if (!height || !gridEl) return
    let offset = 0
    const seen = new Set()
    for (const cell of gridEl.querySelectorAll('[data-sticky-row]')) {
      const row = cell.dataset.stickyRow
      if (seen.has(row)) continue
      seen.add(row)
      gridEl.style.setProperty(`--sticky-${row}`, `${offset}px`)
      offset += cell.getBoundingClientRect().height
    }
    gridEl.style.setProperty('--sticky-total', `${offset}px`)
    untrack(() => scrollOnce(offset))
  })

  let scrolled = false
  function scrollOnce(offset) {
    if (!scrollToTime || scrolled) return
    const day = gridEl.querySelector('[data-part=day]')
    if (!day?.offsetHeight) return
    scrolled = true
    const [h, m] = scrollToTime === 'now' ? [now.getHours() - 1, 0] : scrollToTime.split(':').map(Number)
    const minutes = Math.max(startHour * 60, Math.min(endHour * 60, h * 60 + (m || 0)))
    gridEl.scrollTop = day.offsetTop + ((minutes - startHour * 60) / span) * day.offsetHeight - offset
  }

  $effect(() => {
    timedByColumn
    if (refocus == null) return
    const id = String(refocus)
    refocus = null
    queueMicrotask(() => Array.from(rootEl.querySelectorAll('[data-event-id]')).find((el) => el.dataset.eventId === id)?.focus())
  })

  const jump = (value) => {
    if (!value) return
    picking = false
    date = value
  }
  const go = (days) => (date = toISODate(addDays(current, days)))
  const pickView = (value) => { if (value) view = /^\d+$/.test(value) ? Number(value) : value }

  const title = $derived(dayCount === 1
    ? formatter({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(first)
    : formatter({ day: 'numeric', month: 'long', year: 'numeric' }).formatRange(first, dates.at(-1)))

  // All-day and multi-day events: bars across the columns they cover, in lanes.
  const allDay = $derived.by(() => {
    const bars = []
    for (const event of (events ?? []).filter(isAllDay)) {
      const from = String(event.start).slice(0, 10)
      const to = String(event.end).slice(0, 10)
      const covered = columns.map((c, i) => (c.iso >= from && c.iso <= to && (!split || c.resource?.id === event.resourceId) ? i : -1)).filter((i) => i >= 0)
      const runs = []
      for (const i of covered) {
        const run = runs.at(-1)
        if (run && run.at(-1) === i - 1) run.push(i)
        else runs.push([i])
      }
      for (const run of runs) bars.push({ event, first: run[0], length: run.length, lane: 0, continued: false })
    }
    bars.sort((a, b) => (a.first - b.first) || (b.length - a.length))
    const laneEnds = []
    for (const bar of bars) {
      let lane = laneEnds.findIndex((end) => end < bar.first)
      if (lane < 0) lane = laneEnds.length
      laneEnds[lane] = bar.first + bar.length - 1
      bar.lane = lane
    }
    // Past `allDayMax` lanes the rest fold into a "+2 more" per column (until
    // opened); folded bars still show where a shown lane is free.
    const folding = laneEnds.length > allDayMax && !allDayOpen
    const shownLanes = folding ? allDayMax - 1 : laneEnds.length
    const shownBars = bars.filter((bar) => bar.lane < shownLanes)
    const hidden = columns.map(() => 0)
    if (folding) {
      const taken = columns.map((_, i) => new Set(shownBars.filter((bar) => i >= bar.first && i < bar.first + bar.length).map((bar) => bar.lane)))
      for (const bar of bars.filter((b) => b.lane >= shownLanes)) {
        let piece = null
        for (let i = bar.first; i < bar.first + bar.length; i++) {
          const lane = Array.from({ length: shownLanes }, (_, l) => l).find((l) => !taken[i].has(l))
          if (lane === undefined) {
            hidden[i]++
            piece = null
          } else if (piece && piece.lane === lane && piece.first + piece.length === i) {
            piece.length++
            taken[i].add(lane)
          } else {
            piece = { ...bar, first: i, length: 1, lane, continued: i > bar.first }
            shownBars.push(piece)
            taken[i].add(lane)
          }
        }
      }
    }
    return { bars, laneCount: laneEnds.length, folding, shownLanes, shownBars, hidden }
  })
  const bars = $derived(allDay.bars)

  const barColor = (event) => event.color ?? resourceOf(event.resourceId)?.color ?? 'accent'
  const eventsOn = (d) => (events ?? []).filter((event) => String(event.start).slice(0, 10) <= toISODate(d) && String(event.end).slice(0, 10) >= toISODate(d))
  const pinnedMinutes = $derived(pinned ? minutesBetween(parseLocal(pinned.start), parseLocal(pinned.end)) || slotMinutes : 0)

  // The header rows, numbered for sticking: days, resources, extra rows, all-day.
  const rowNumbers = $derived.by(() => {
    let n = 0
    const day = !split || dayCount > 1 ? n++ : -1
    const resource = split ? n++ : -1
    const extra = (rows ?? []).map(() => n++)
    return { day, resource, extra, allDay: n }
  })

  // The preview's problem, if any, shown as it's dragged.
  const previewReason = $derived.by(() => {
    const p = preview
    if (!p || !(isAvailable || split || resources?.length)) return null
    if (p.kind === 'select') return reasonFor(timed(columns[p.column], p.from, p.to))
    if (p.kind === 'place' && pinned) return reasonFor(timed(columns[p.column], p.from, p.from + pinnedMinutes, pinned))
    if (p.kind === 'all-day') {
      const a = columns[p.columns[0]]
      const b = columns[p.columns.at(-1)]
      const query = { start: a.iso, end: b.iso, allDay: true }
      if (a.resource) query.resourceId = a.resource.id
      return reasonFor(query)
    }
    const event = (events ?? []).find((e) => e.id === p.id)
    const next = event && (p.kind === 'move' ? target(event, 'move', p.columns, p.minutes) : target(event, 'resize', 0, p.minutes))
    return next ? reasonFor(queryFor(event, next)) : null
  })

  const cornerRow = $derived(rowNumbers.day >= 0 ? rowNumbers.day : rowNumbers.resource)
  const dayFormat = $derived(formatter({ weekday: 'short' }))
  const hourFormat = $derived(formatter({ hour: 'numeric' }))
  const rowClick = (row, cell) => onrowclick?.({ key: row.key, date: cell.iso, resource: cell.resource })
</script>

<svelte:window {onkeydown} />

{#snippet dayHeaderContent(d)}
  {#if dayHeader}{@render dayHeader({ date: d, events: eventsOn(d), resources })}
  {:else}<span>{dayFormat.format(d)}</span><strong>{d.getDate()}</strong>{/if}
{/snippet}

{#snippet resourceContent(resource)}
  {#if resourceSnippet}{@render resourceSnippet(resource)}{:else}{resource.title}{/if}
{/snippet}

<div bind:this={rootEl} {...rest} {...part('root')} class={cx(className)} data-placing={pinned ? '' : undefined}
  style:--columns={columns.length} style:--hour-height={hourHeight}>
  {#if toolbar}
    <div {...part('toolbar')}>
      <div {...part('nav')}>
        <Button size="sm" onclick={() => (date = today)}>{t.today}</Button>
        <Button size="sm" variant="ghost" icon="lucide:chevron-left" aria-label={t.previous} onclick={() => go(-step)} />
        <Button size="sm" variant="ghost" icon="lucide:chevron-right" aria-label={t.next} onclick={() => go(step)} />
      </div>
      <!-- The title opens a month, to jump to any date. -->
      <div {...part('jump')}>
        <Popover placement="bottom-start" bind:open={picking}>
          {#snippet trigger(props)}
            <button {...props} {...part('title')} type="button" aria-label="{title}: {t.pickDate}">
              {title}<iconify-icon icon="lucide:chevron-down" aria-hidden="true"></iconify-icon>
            </button>
          {/snippet}
          <DatePicker inline locale={currentLocale} bind:value={() => toISODate(current), jump} />
        </Popover>
      </div>
      <div {...part('actions')}>
        {#if !narrow && (views ?? []).length > 1}
          <Segmented size="sm" aria-label={t.view} items={views.map((v) => ({ value: String(v), label: viewLabel(v) }))}
            bind:value={() => String(view), pickView} />
        {/if}
        {@render actions?.()}
      </div>
    </div>
  {/if}

  {#if pinned}
    <div {...part('pinned')} role="status">
      <iconify-icon icon="lucide:move" aria-hidden="true"></iconify-icon>
      <span>{t.placing(nameOf(pinned))}</span>
      <Button size="sm" variant="ghost" onclick={() => (pinned = null)}>{t.cancel}</Button>
    </div>
  {/if}

  <div bind:this={gridEl} {...part('grid')} role="grid" aria-label={title} data-two-rows={twoRows || undefined} data-scroll={height ? '' : undefined}
    style:max-height={height} onpointermove={track} onpointerup={finish} onpointercancel={cancelGesture}>
    <!-- Headers: the days (spanning their resources), then the resources. -->
    <div {...part('corner')} data-sticky-row={cornerRow} style:grid-row={twoRows ? 'span 2' : 'auto'} style:top="var(--sticky-{cornerRow})"></div>
    {#if rowNumbers.day >= 0}
      {#each dates as d (toISODate(d))}
        <div {...part('day-header')} role="columnheader" data-today={sameDay(d, now) || undefined} data-sticky-row={rowNumbers.day}
          style:grid-column="span {lanes.length}" style:top="var(--sticky-{rowNumbers.day})">
          {#if clickableDays}
            <button {...part('header-button')} type="button" aria-label={longDayText(d)} onclick={() => ondayclick?.(toISODate(d))}>{@render dayHeaderContent(d)}</button>
          {:else}{@render dayHeaderContent(d)}{/if}
        </div>
      {/each}
    {/if}
    {#if rowNumbers.resource >= 0}
      {#each columns as c (`${c.iso}-${c.resource.id}`)}
        <div {...part('resource-header')} role="columnheader" data-colored={c.resource.color ? '' : undefined} data-sticky-row={rowNumbers.resource}
          style:top="var(--sticky-{rowNumbers.resource})" style:--resource-color={c.resource.color ? cssColor(c.resource.color) : undefined}>
          {#if clickableResources}
            <button {...part('header-button')} type="button" onclick={() => onresourceclick?.({ resource: c.resource, date: c.iso })}>{@render resourceContent(c.resource)}</button>
          {:else}{@render resourceContent(c.resource)}{/if}
        </div>
      {/each}
    {/if}

    {#each rows ?? [] as row, r (row.key)}
      {@const sticky = rowNumbers.extra[r]}
      <div {...part('row-label')} data-sticky-row={sticky} style:top="var(--sticky-{sticky})">{row.label}</div>
      {#each row.perColumn ? columns : dates.map((d) => ({ date: d, iso: toISODate(d), resource: null })) as cell (`${row.key}-${cell.iso}-${cell.resource?.id ?? ''}`)}
        {#if row.clickable}
          <div {...part('row-cell')} data-clickable data-sticky-row={sticky} style:grid-column={row.perColumn ? undefined : `span ${lanes.length}`}
            style:top="var(--sticky-{sticky})" role="button" tabindex="0" aria-label="{typeof row.label === 'string' ? row.label : ''} {longDayText(cell.date)}"
            onclick={() => rowClick(row, cell)} onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rowClick(row, cell) } }}>
            {#if row.cell}{@render row.cell({ date: cell.date, resource: cell.resource })}{/if}
          </div>
        {:else}
          <div {...part('row-cell')} data-sticky-row={sticky} style:grid-column={row.perColumn ? undefined : `span ${lanes.length}`} style:top="var(--sticky-{sticky})">
            {#if row.cell}{@render row.cell({ date: cell.date, resource: cell.resource })}{/if}
          </div>
        {/if}
      {/each}
    {/each}

    {#if bars.length > 0 || selectable}
      <!-- The label opens and closes a folded strip. -->
      <div {...part('all-day-label')} data-sticky-row={rowNumbers.allDay} style:top="var(--sticky-{rowNumbers.allDay})">
        {#if allDay.laneCount > allDayMax}
          <button type="button" aria-expanded={allDayOpen} onclick={() => (allDayOpen = !allDayOpen)}>
            {t.allDay}<iconify-icon icon={allDayOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'} aria-hidden="true"></iconify-icon>
          </button>
        {:else}{t.allDay}{/if}
      </div>
      <div {...part('all-day')} data-selectable={selectable || undefined} data-sticky-row={rowNumbers.allDay} role="presentation"
        style:--lanes={Math.max(1, allDay.shownLanes + (allDay.folding ? 1 : 0))} style:top="var(--sticky-{rowNumbers.allDay})"
        onpointerdown={(e) => { if (selectable && e.target === e.currentTarget) startGesture(e, 'all-day', 0) }} oncontextmenu={allDayContext}>
        {#if preview?.kind === 'all-day'}
          {#each preview.columns as i (i)}
            <div {...part('selection')} data-all-day data-invalid={previewReason ? '' : undefined}
              style:left="{(i / columns.length) * 100}%" style:width="{100 / columns.length}%"></div>
          {/each}
        {/if}
        {#each allDay.shownBars as bar (`${bar.event.id}-${bar.first}`)}
          {@const color = barColor(bar.event)}
          <button {...part('all-day-event')} type="button" data-continued={bar.continued || undefined} data-blocked={bar.event.blocked ? '' : undefined}
            data-color={colorKey(color)} style:left="{(bar.first / columns.length) * 100}%" style:width="{(bar.length / columns.length) * 100}%"
            style:top="calc({bar.lane} * 1.625rem + 0.25rem)" style:--event-color={named.includes(color) ? undefined : color}
            onclick={() => oneventclick?.(bar.event)} oncontextmenu={(e) => eventContext(e, bar.event)}>
            {#if eventSnippet}{@render eventSnippet({ event: bar.event, start: parseLocal(bar.event.start), end: parseLocal(bar.event.end), resource: null, compact: true })}
            {:else}{bar.event.title}{/if}
          </button>
        {/each}
        {#if allDay.folding}
          {#each allDay.hidden as count, i}
            {#if count > 0}
              <button {...part('more')} type="button" onclick={() => (allDayOpen = true)}
                style:left="{(i / columns.length) * 100}%" style:width="{100 / columns.length}%" style:top="calc({allDay.shownLanes} * 1.625rem + 0.25rem)">{t.more(count)}</button>
            {/if}
          {/each}
        {/if}
      </div>
    {/if}

    <div {...part('gutter')} aria-hidden="true" style:--hours={hours.length}>
      {#each hours as hour (hour)}<span {...part('hour')} style:top={top(hour * 60)}>{hourFormat.format(new Date(2000, 0, 1, hour))}</span>{/each}
    </div>
    {#each columns as column, index (`${column.iso}-${column.resource?.id ?? ''}`)}
      {@const p = preview}
      {@const selecting = p?.kind === 'select' && p.column === index ? p : null}
      {@const placing = p?.kind === 'place' && p.column === index ? p : null}
      {@const isToday = sameDay(column.date, now)}
      <div {...part('day')} role="gridcell" tabindex="-1" aria-label="{longDayText(column.date)}{resourceName(column)}"
        data-today={isToday || undefined} data-selectable={selectable || pinned ? '' : undefined} data-first={split && column.resource === lanes[0] ? '' : undefined}
        style:--hours={hours.length} style:--resource-color={column.resource?.color ? cssColor(column.resource.color) : undefined}
        onpointerdown={(e) => pressDay(e, index)} onpointermove={(e) => hover(e, index)} onpointerleave={leaveDay} oncontextmenu={(e) => dayContext(e, column)}>
        {#each shading[index] as run (run.from)}
          <div {...part('unavailable')} title={run.reason} style:top={top(run.from)} style:height={length(run.to - run.from)}></div>
        {/each}
        {#each timedByColumn[index] as item (item.event.id)}
          {@const event = item.event}
          {@const moving = p?.kind === 'move' && p.id === event.id ? p : null}
          {@const resizing = p?.kind === 'resize' && p.id === event.id ? p : null}
          {@const shownEnd = resizing ? addMinutes(item.end, resizing.minutes) : item.end}
          {@const minutes = minutesBetween(item.start, shownEnd)}
          {@const color = event.color ?? (column.resource ?? resourceOf(event.resourceId))?.color ?? 'accent'}
          {@const time = `${timeText(item.start)} – ${timeText(shownEnd)}`}
          {@const left = `${(item.column / item.columns) * 100}%`}
          {@const width = `${100 / item.columns}%`}
          <!-- Where it was, while it's dragged. -->
          {#if moving || resizing}
            <div {...part('ghost')} style:top={top(minutesOfDay(item.start))} style:left={left} style:width={width}
              style:height={length(minutesBetween(item.start, item.end))}></div>
          {/if}
          <button {...part('event')} type="button" data-event-id={String(event.id)} data-color={colorKey(color)}
            data-dragging={moving || resizing ? '' : undefined} data-invalid={(moving || resizing) && previewReason ? '' : undefined}
            data-editable={canEdit(event) || undefined} data-compact={minutes <= 30 || undefined} data-blocked={event.blocked ? '' : undefined}
            data-pending={event.pending ? '' : undefined} data-pinned={pinned?.id === event.id ? '' : undefined}
            aria-label="{nameOf(event)}, {time}" aria-busy={event.pending ? 'true' : undefined}
            title={(moving || resizing) && previewReason ? previewReason : undefined}
            style:top={top(minutesOfDay(item.start))} style:left={left} style:width={width} style:height={length(Math.max(slotMinutes, minutes))}
            style:--event-color={named.includes(color) ? undefined : color} style:transform={moving ? `translate(${moving.x}px, ${moving.y}px)` : undefined}
            onpointerdown={(e) => pressEvent(e, index, event)} onkeydown={(e) => eventKeys(e, event)} oncontextmenu={(e) => eventContext(e, event)}
            onclick={() => clickEvent(event)}>
            {#if eventSnippet}{@render eventSnippet({ event, start: item.start, end: shownEnd, resource: column.resource, compact: minutes <= 30 })}
            {:else}<span {...part('event-title')}>{event.title}</span><span {...part('event-time')}>{time}</span>{/if}
            {#if canEdit(event) && !pinned}
              <span {...part('resize')} aria-hidden="true" onpointerdown={(e) => startGesture(e, 'resize', index, event)}></span>
            {/if}
          </button>
        {/each}
        {#if hoverSlot?.column === index && !p}
          {@const off = shading[index].find((run) => hoverSlot.from >= run.from && hoverSlot.from < run.to)}
          <div {...part('hover')} data-invalid={off ? '' : undefined} aria-hidden="true" style:top={top(hoverSlot.from)} style:height={length(slotMinutes)}></div>
        {/if}
        {#if selecting}
          <div {...part('selection')} data-invalid={previewReason ? '' : undefined} style:top={top(selecting.from)} style:height={length(selecting.to - selecting.from)}>
            {previewReason ?? `${timeText(addMinutes(column.date, selecting.from))} – ${timeText(addMinutes(column.date, selecting.to))}`}
          </div>
        {/if}
        {#if placing && pinned}
          <div {...part('selection')} data-placing data-invalid={previewReason ? '' : undefined} style:top={top(placing.from)} style:height={length(pinnedMinutes)}>
            {previewReason ?? `${nameOf(pinned)}, ${timeText(addMinutes(column.date, placing.from))}`}
          </div>
        {/if}
        {#if isToday && minutesOfDay(now) >= startHour * 60 && minutesOfDay(now) < endHour * 60}
          <div {...part('now')} aria-hidden="true" style:top={top(minutesOfDay(now))}></div>
        {/if}
      </div>
    {/each}
  </div>

  <Menu context items={menuEntries} onselect={runMenu}>
    {#snippet trigger(props)}<span {...props} bind:this={menuAnchor} {...part('menu-anchor')} aria-hidden="true"></span>{/snippet}
  </Menu>
  <div {...part('status')} aria-live="polite" role="status">{status}</div>
</div>
