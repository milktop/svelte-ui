<!-- In French, with a full all-day strip
  `locale="fr-FR"` for its dates and `translations` for its words (French is built in: `fr.calendar`), here without changing the rest of the app. Editable like the others (select, move, resize, right-click). Past `allDayMax` lanes the all-day strip folds into "+3 de plus"; the label opens it. -->
<script>
  import { EventCalendar, fr, confirm, toaster } from '@milktop/svelte-ui'
  import { lessons, day } from './lessons.js'

  const busy = [0, 1, 2, 3].map((n) => ({ id: `fete-${n}`, title: ['Formation', 'Inventaire', 'Congrès', 'Portes ouvertes'][n], student: '', subject: '',
    start: day(n % 2), end: day(2 + (n % 2)), allDay: true, color: ['accent', 'success', 'warning', 'neutral'][n] }))

  let events = $state([...lessons, ...busy])
  const add = ({ start, end, allDay }) =>
    (events = [...events, { id: Date.now(), title: allDay ? 'Journée bloquée' : 'Nouveau cours', student: '', subject: '', start, end, allDay, color: allDay ? 'neutral' : 'accent' }])
  // Selecting a time asks first (choosing it from the menu already says so).
  const time = (iso) => iso.slice(11)
  async function ask(slot) {
    const when = slot.allDay
      ? (slot.start === slot.end ? slot.start : `du ${slot.start} au ${slot.end}`)
      : `${slot.start.slice(0, 10)}, de ${time(slot.start)} à ${time(slot.end)}`
    const ok = await confirm({
      heading: slot.allDay ? 'Bloquer ces journées ?' : 'Ajouter un cours ?', description: when,
      confirmLabel: slot.allDay ? 'Bloquer' : 'Ajouter', cancelLabel: 'Annuler',
    })
    if (ok) add(slot)
  }
  const update = ({ event, change }) => (events = events.map((e) => (e.id === event.id ? { ...e, ...change } : e)))
  const remove = (event) => (events = events.filter((e) => e.id !== event.id))
</script>

<EventCalendar {events} locale="fr-FR" translations={fr.calendar} selectable editable onslotselect={ask} oneventchange={update}
  oneventclick={(event) => toaster.info({ title: String(event.title) })}
  eventMenu={(event) => [
    { label: 'Ouvrir', icon: 'lucide:file-text', onSelect: () => toaster.info({ title: String(event.title) }) },
    { separator: true },
    { label: 'Supprimer', icon: 'lucide:trash-2', danger: true, onSelect: () => remove(event) },
  ]}
  slotMenu={(slot) => [{ label: slot.allDay ? 'Bloquer la journée' : `Ajouter un cours à ${slot.start.slice(11)}`, icon: 'lucide:plus', onSelect: () => add(slot) }]}
  views={['day', 'week']} allDayMax={3} startHour={8} endHour={20} />
