<!-- A vet clinic's day
  Day view has a column per vet (`resources`); Week puts everyone together (`resourceViews={['day']}`), in each vet's colour, with who's working in each day's header (the `dayHeader` snippet, given the day's events). 15-minute slots, inside a fixed `height` that opens at the current time. Each vet's hours, lunch and clashes come from `isAvailable` (hatched, the reason on hover; drops and bookings there are refused). Drag to book; hold Shift to block time; select in the all-day strip to mark a vet away. Moves save for a moment (`pending`). Click an appointment, then Move…, to place it anywhere, even another week (`pinned`). Right-click an appointment or an empty time for a menu (`eventMenu`, `slotMenu`). The day's messages are an extra row. -->
<script>
  import { EventCalendar, Avatar, AvatarGroup, Badge, toaster, confirm } from '@milktop/svelte-ui'
  import { vets, appointments as initial } from './clinic.js'
  import { day } from './lessons.js'

  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const species = { dog: 'lucide:dog', cat: 'lucide:cat', rabbit: 'lucide:rabbit', bird: 'lucide:bird' }

  // Each vet's hours and lunch, as minutes of the day.
  const hours = {
    jones: { from: 8 * 60, to: 17 * 60, lunch: [12 * 60 + 30, 13 * 60 + 30], note: 'Dr Jones works 8:00 to 17:00' },
    patel: { from: 9 * 60, to: 18 * 60, lunch: [13 * 60, 14 * 60], note: 'Dr Patel works 9:00 to 18:00' },
    okafor: { from: 8 * 60, to: 13 * 60, note: 'Dr Okafor works mornings only' },
    nurse: { from: 8 * 60, to: 16 * 60, lunch: [12 * 60, 12 * 60 + 30], note: 'Nurse Kim works 8:00 to 16:00' },
  }
  const minutes = (iso) => Number(iso.slice(11, 13)) * 60 + Number(iso.slice(14, 16))
  const noKeys = { shiftKey: false, altKey: false, ctrlKey: false, metaKey: false }

  let appointments = $state(initial)
  let pinned = $state(null)
  let messages = $state([
    { id: 1, date: day((new Date().getDay() + 6) % 7), text: 'X-ray machine serviced at 14:00', urgent: true },
    { id: 2, date: day((new Date().getDay() + 6) % 7), text: 'Order more rabies vaccine' },
  ])

  // The clinic's rules, in one place: hours, lunch, days away, clashes.
  function isAvailable({ start, end, resourceId, allDay, event, shading }) {
    const vet = hours[String(resourceId)]
    if (!vet || allDay) return true
    const away = appointments.find((a) => a.allDay && a.resourceId === resourceId && a.start <= start.slice(0, 10) && a.end >= start.slice(0, 10))
    if (away) return `${vets.find((v) => v.id === resourceId)?.title} is away`
    const [from, to] = [minutes(start), minutes(end)]
    if (from < vet.from || to > vet.to) return vet.note
    if (vet.lunch && from < vet.lunch[1] && to > vet.lunch[0]) return 'Lunch'
    // Clashes only for bookings and drops: the shading needn't show them.
    if (shading) return true
    const clash = appointments.find((a) => !a.allDay && a.id !== event?.id && a.resourceId === resourceId && a.start < end && a.end > start)
    return clash ? `Clashes with ${clash.pet}` : true
  }

  // Saved after a moment: pending meanwhile.
  function update({ event, change }) {
    appointments = appointments.map((a) => (a.id === event.id ? { ...a, ...change, pending: true } : a))
    setTimeout(() => (appointments = appointments.map((a) => (a.id === event.id ? { ...a, pending: false } : a))), 900)
    pinned = null
  }

  function book({ start, end, resourceId, allDay, keys = noKeys }) {
    const vet = vets.find((v) => v.id === resourceId)
    // Shift held, or a whole day: block it instead of booking it.
    if (keys.shiftKey || allDay) {
      appointments = [...appointments, {
        id: `block-${Date.now()}`, resourceId, start, end, allDay, blocked: true, title: allDay ? 'Away' : 'Blocked', pet: allDay ? 'Away' : 'Blocked',
        species: 'dog', owner: '', kind: 'Check-up', color: 'neutral',
      }]
      return toaster.info({ title: `${vet?.title}: ${allDay ? 'away' : 'time blocked'}` })
    }
    appointments = [...appointments, {
      id: `new-${Date.now()}`, resourceId, start, end, title: 'New patient', pet: 'New patient', species: 'dog', owner: '—', kind: 'Consult', color: 'accent',
    }]
    toaster.success({ title: `Booked with ${vet?.title}`, description: `${start.slice(11)} to ${end.slice(11)}` })
  }

  const addDay = (iso) => {
    const d = new Date(`${iso.slice(0, 10)}T00:00`)
    d.setDate(d.getDate() + 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}${iso.slice(10)}`
  }

  // Right-click (or the Menu key on a focused appointment).
  const eventMenu = (a) => a.blocked
    ? [{ label: 'Unblock', icon: 'lucide:unlock', onSelect: () => (appointments = appointments.filter((x) => x.id !== a.id)) }]
    : [
        { group: `${a.pet} (${a.owner})` },
        { label: 'Open', icon: 'lucide:file-text', onSelect: () => toaster.info({ title: a.pet, description: a.kind }) },
        { label: 'Move…', icon: 'lucide:move', onSelect: () => (pinned = a) },
        { label: 'Duplicate tomorrow', icon: 'lucide:copy', onSelect: () => (appointments = [...appointments, { ...a, id: `${a.id}-copy-${Date.now()}`, start: addDay(a.start), end: addDay(a.end) }]) },
        { separator: true },
        { label: 'Cancel appointment', icon: 'lucide:x', danger: true, onSelect: async () => {
          if (await confirm({ heading: `Cancel ${a.pet}'s appointment?`, danger: true, confirmLabel: 'Cancel it', cancelLabel: 'Keep' })) {
            appointments = appointments.filter((x) => x.id !== a.id)
          }
        } },
      ]
  const slotMenu = (slot) => slot.allDay
    ? [{ label: 'Mark away all day', icon: 'lucide:plane', onSelect: () => book(slot) }]
    : [
        { label: `Book ${slot.start.slice(11)}`, icon: 'lucide:calendar-plus', onSelect: () => book(slot) },
        { label: 'Block this time', icon: 'lucide:ban', onSelect: () => book({ ...slot, keys: { ...noKeys, shiftKey: true } }) },
      ]

  function addMessage({ date }) {
    const text = prompt('Message for the team')
    if (text) messages = [...messages, { id: Date.now(), date, text }]
  }
</script>

<!-- The day's messages for the team: a row above the all-day strip. -->
{#snippet messageCell({ date })}
  <span class="flex flex-wrap gap-1">
    {#each messages.filter((m) => m.date === iso(date)) as m (m.id)}
      <button type="button" onclick={(e) => { e.stopPropagation(); toaster.info({ title: m.text }) }}
        class="cursor-pointer rounded border-0 px-1.5 py-0.5 text-[11px] text-white {m.urgent ? 'bg-red-500' : 'bg-amber-500'}">{m.text}</button>
    {/each}
  </span>
{/snippet}

<EventCalendar events={appointments} resources={vets} view="day" views={['day', 'week']} resourceViews={['day']} slotMinutes={15} hourHeight="5rem"
  startHour={8} endHour={18} height="34rem" scrollToTime="now" selectable editable clickableResources
  oneventchange={update} onslotselect={book} {isAvailable} onunavailable={({ reason }) => toaster.error({ title: reason })}
  onresourceclick={({ resource: vet }) => toaster.info({ title: vet.title, description: `${vet.role}: ${appointments.filter((x) => x.resourceId === vet.id && !x.allDay).length} appointments` })}
  bind:pinned {eventMenu} {slotMenu} eventLabel={(a) => `${a.pet}, ${a.kind}`}
  oneventclick={(a) => !a.blocked && toaster.info({ title: `${a.pet} (${a.owner})`, description: a.kind, action: { label: 'Move…', onClick: () => (pinned = a) } })}
  rows={[{ key: 'messages', label: 'Notes', clickable: true, cell: messageCell }]} onrowclick={addMessage}>
  <!-- In the week, without vet columns: the day, and who's working (the vets with appointments that day). -->
  {#snippet dayHeader({ date, events })}
    <span class="flex flex-col items-center gap-1">
      <span class="text-xs text-(--ui-muted)">
        {date.toLocaleDateString('en-GB', { weekday: 'short' })}<strong class="ml-1 text-sm font-semibold text-(--ui-text)">{date.getDate()}</strong>
      </span>
      <AvatarGroup size="sm" max={3} tooltip
        items={vets.filter((vet) => events.some((a) => a.resourceId === vet.id && !a.blocked)).map((vet) => ({ name: vet.title.replace('Dr ', ''), color: vet.color }))} />
    </span>
  {/snippet}
  {#snippet resource(vet)}
    <span class="flex min-w-0 items-center gap-2">
      <Avatar size="sm" name={vet.title.replace('Dr ', '')} color={vet.color} />
      <span class="min-w-0 text-left"><span class="block truncate">{vet.title}</span>
        <span class="block truncate text-xs font-normal text-(--ui-muted)">{vet.role}</span></span>
    </span>
  {/snippet}
  {#snippet event({ event: a, compact })}
    {#if a.blocked}<span class="font-medium text-(--ui-muted)">{a.title}</span>
    {:else}
      <span class={compact ? 'flex min-w-0 items-center gap-1.5' : 'flex min-w-0 flex-col gap-0.5'}>
        <span class="flex min-w-0 items-center gap-1.5 font-semibold">
          <iconify-icon icon={species[a.species]}></iconify-icon><span class="truncate">{a.pet}</span>
        </span>
        <span class="truncate text-(--ui-muted)">{a.owner}</span>
        {#if !compact}<span><Badge>{a.kind}</Badge></span>{/if}
      </span>
    {/if}
  {/snippet}
</EventCalendar>
