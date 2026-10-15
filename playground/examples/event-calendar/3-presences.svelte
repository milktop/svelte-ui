<!-- Presences, colours and saving
  Who's in each day is managed right here: Add a vet (toolbar), or a vet's ⋯ for morning, afternoon, all day or remove. A presence becomes the column's `hours` (with lunch on full days), so the rest of the day is shaded and refused with the reason. Appointments take their vet's `color` unless they set one. Moves save through a pretend server: `pending` meanwhile, and moving surgery to the nurse fails and rolls back. Clashes come from `isAvailable`. -->
<script>
  import { EventCalendar, Avatar, Badge, Button, Menu, toaster } from '@milktop/svelte-ui'

  const staff = [
    { id: 'jones', title: 'Dr Jones', color: '#0d9488', surgery: true },
    { id: 'patel', title: 'Dr Patel', color: '#7c3aed', surgery: true },
    { id: 'okafor', title: 'Dr Okafor', color: '#d97706', surgery: false },
    { id: 'nurse', title: 'Nurse Kim', color: '#2563eb', surgery: false },
  ]
  const periodHours = {
    day: [{ start: '08:00', end: '12:30' }, { start: '13:30', end: '18:00' }],
    am: [{ start: '08:00', end: '13:00' }],
    pm: [{ start: '13:00', end: '18:00' }],
  }
  const periodName = { day: 'all day', am: 'mornings', pm: 'afternoons' }

  const today = new Date().toLocaleDateString('sv')
  const at = (id, vet, from, to, pet, owner, kind) => ({ id, resourceId: vet, start: `${today}T${from}`, end: `${today}T${to}`, title: pet, pet, owner, kind })

  let date = $state(today)
  // Who's in, per day (for the other days: Dr Jones and Nurse Kim, all day).
  let presences = $state({ [today]: { jones: 'day', patel: 'am', nurse: 'day' } })
  const present = $derived(presences[date] ?? { jones: 'day', nurse: 'day' })
  const setPresent = (next) => (presences = { ...presences, [date]: next })

  let appointments = $state([
    at('a1', 'jones', '09:00', '09:30', 'Biscuit', 'A. Lovelace', 'Consult'),
    at('a2', 'jones', '14:00', '15:30', 'Luna', 'K. Johnson', 'Surgery'),
    at('a3', 'patel', '10:00', '10:30', 'Mittens', 'A. Turing', 'Consult'),
    at('a4', 'nurse', '09:15', '09:30', 'Poppy', 'D. Knuth', 'Vaccination'),
    // Its own colour, not its vet's.
    { ...at('a5', 'nurse', '11:00', '11:30', 'Kiwi', 'B. Liskov', 'Consult'), color: 'danger' },
  ])

  // The columns: the vets in that day, available for their period.
  const resources = $derived(staff.filter((v) => present[v.id]).map((v) => ({
    // On a full day the only gap is lunch; otherwise it's the half they're not in.
    ...v, hours: periodHours[present[v.id]], offLabel: present[v.id] === 'day' ? 'Lunch break' : `${v.title} works ${periodName[present[v.id]]}`,
  })))

  // Clashes (bookings and drops only; the shading needn't show them).
  function isAvailable({ start, end, resourceId, event, shading }) {
    if (shading) return true
    const clash = appointments.find((a) => a.id !== event?.id && a.resourceId === resourceId && a.start < end && a.end > start)
    return clash ? `Clashes with ${clash.pet}` : true
  }

  // Saved by a pretend server: pending meanwhile; surgery can't go to someone who doesn't operate.
  function update({ event: appointment, change }) {
    const before = appointment
    appointments = appointments.map((a) => (a.id === appointment.id ? { ...a, ...change, pending: true } : a))
    setTimeout(() => {
      const vet = staff.find((v) => v.id === (change.resourceId ?? appointment.resourceId))
      const refused = appointment.kind === 'Surgery' && !vet?.surgery
      appointments = appointments.map((a) => (a.id === appointment.id ? (refused ? before : { ...a, pending: false }) : a))
      if (refused) toaster.error({ title: `${vet?.title} doesn't do surgery`, description: `${appointment.pet} stays with its vet.` })
    }, 900)
  }

  function book({ start, end, resourceId }) {
    appointments = [...appointments, { id: `n${Date.now()}`, resourceId, start, end, title: 'New patient', pet: 'New patient', owner: '—', kind: 'Consult' }]
  }

  function remove(vet) {
    const theirs = appointments.filter((a) => a.resourceId === vet.id && a.start.startsWith(date)).length
    if (theirs) return toaster.error({ title: `${vet.title} has ${theirs} appointment${theirs > 1 ? 's' : ''} today`, description: 'Move them to another vet first.' })
    const { [vet.id]: _gone, ...rest } = present
    setPresent(rest)
  }

  // A vet's period changed: say which of their appointments are now outside it.
  function changePeriod(vet, period) {
    setPresent({ ...present, [vet.id]: period })
    const minutes = (iso) => Number(iso.slice(11, 13)) * 60 + Number(iso.slice(14, 16))
    const clock = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5))
    const outside = appointments.filter((a) => a.resourceId === vet.id && a.start.startsWith(date)
      && !periodHours[period].some((h) => minutes(a.start) >= clock(h.start) && minutes(a.end) <= clock(h.end)))
    if (outside.length) toaster.warning({ title: `${vet.title} now works ${periodName[period]}`, description: `Outside those hours: ${outside.map((a) => `${a.pet} at ${a.start.slice(11)}`).join(', ')}` })
  }

  const absent = $derived(staff.filter((v) => !present[v.id]))
</script>

<EventCalendar events={appointments} {resources} view="day" views={[]} bind:date
  slotMinutes={15} hourHeight="4rem" startHour={8} endHour={18} height="30rem" scrollToTime="08:00" selectable editable
  {isAvailable} onunavailable={({ reason }) => toaster.error({ title: reason })}
  oneventchange={update} onslotselect={book} eventLabel={(a) => `${a.pet}, ${a.kind}`}>
  {#snippet actions()}
    {#if absent.length > 0}
      <Menu placement="bottom-end" items={absent.map((v) => ({ label: v.title, value: v.id }))} onselect={(id) => setPresent({ ...present, [String(id)]: 'day' })}>
        {#snippet trigger(props)}<Button {...props} size="sm" icon="lucide:user-plus">Add a vet</Button>{/snippet}
      </Menu>
    {/if}
  {/snippet}
  {#snippet resource(vet)}
    <span class="flex w-full min-w-0 items-center gap-2">
      <Avatar size="sm" name={vet.title.replace(/^(Dr|Nurse) /, '')} color="auto" />
      <span class="min-w-0 flex-1 text-left"><span class="block truncate">{vet.title}</span>
        <span class="block truncate text-xs font-normal text-(--ui-muted)">{periodName[present[vet.id]]}</span></span>
      <Menu placement="bottom-end" onselect={(value) => { if (value === 'remove') remove(vet) }}
        items={[
          { type: 'radio', name: `period-${vet.id}`, value: 'am', label: 'Morning', checked: present[vet.id] === 'am' },
          { type: 'radio', name: `period-${vet.id}`, value: 'pm', label: 'Afternoon', checked: present[vet.id] === 'pm' },
          { type: 'radio', name: `period-${vet.id}`, value: 'day', label: 'All day', checked: present[vet.id] === 'day' },
          { separator: true },
          { label: 'Remove from this day', value: 'remove', icon: 'lucide:user-minus', danger: true },
        ]}
        onchange={({ value }) => changePeriod(vet, value)}>
        {#snippet trigger(props)}<Button {...props} size="sm" variant="ghost" icon="lucide:ellipsis" aria-label="{vet.title}'s day" />{/snippet}
      </Menu>
    </span>
  {/snippet}
  {#snippet event({ event: a, compact })}
    <span class={compact ? 'flex min-w-0 items-center gap-1.5' : 'flex min-w-0 flex-col gap-0.5'}>
      <span class="truncate font-semibold">{a.pet}</span>
      <span class="truncate text-(--ui-muted)">{a.owner}</span>
      {#if !compact}<span><Badge>{a.kind}</Badge></span>{/if}
    </span>
  {/snippet}
</EventCalendar>
