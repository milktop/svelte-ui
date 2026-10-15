<!--
  A date picker: type a date, or pick it from a calendar.

  <DatePicker label="Lesson date" bind:value={date} min="2026-01-01" />

  - `value`: bindable, an ISO date ('YYYY-MM-DD'), or an array of two with `range`
  - `range`: pick a start and an end
  - `min`, `max`: ISO dates
  - `unavailable`: function(CalendarDate) returning true for dates that can't
    be picked (weekends, holidays); they show struck through

  - `locale`: for formatting and the first day of the week (the app's, uiLocale)
  - `placement`: where the calendar opens ('bottom-start')
  - `inline`: just the calendar, always showing (no input or popup), e.g. a
    month beside a schedule
  - `prev`, `next` snippets: replace those buttons; they get Zag's props
    (spread them onto your button) and the part's classes

  Up and Down in the input step its date by a day (Shift: a week), skipping
  unavailable ones; on an empty input the first press picks today. Typing
  puts in the locale's separators (11102026 → 11/10/2026; 11.10.2026 in
  German); a separator typed by hand, or a pasted date, works too.

  A typed date is taken on Enter or when the input loses focus. One it can't
  take (past `min` or `max`, `unavailable`, or not a whole date) stays in the
  input, marked invalid with the reason under it, and the value doesn't
  change; the input's validity is set too, so a form won't submit with it.
  - `oninvalidchange`: called with the reason when that happens, and null
    once the input holds a date it takes (or is cleared)
-->
<script>
  import * as datepicker from '@zag-js/date-picker'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { today, getLocalTimeZone, DateFormatter } from '@internationalized/date'
  import { parseDateString } from '@zag-js/date-utils'
  import '../icons.js'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './date-picker.css'

  let {
    label = null, value = $bindable(null), range = false, min = null, max = null, unavailable = null,
    locale = undefined, placement = 'bottom-start', disabled = false, inline = false, oninvalidchange = null,
    class: className = '', classes = {}, prev = null, next = null, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('date-picker', () => classes)

  const id = $props.id()
  const currentLocale = $derived(locale ?? uiLocale.locale)
  const service = useMachine(datepicker.machine, () => ({
    id, locale: currentLocale, disabled,
    ...(inline && { inline: true }),
    ...(uiLocale.zag('datePicker') && { translations: uiLocale.zag('datePicker') }),
    invalid: !!field?.invalid,
    // Inside a Field, its label points at our input.
    ids: field ? { input: () => field.id, label: () => field.labelId } : undefined,
    selectionMode: range ? 'range' : 'single',
    value: [].concat(value ?? []).filter(Boolean).map(datepicker.parse),
    min: min ? datepicker.parse(min) : undefined,
    max: max ? datepicker.parse(max) : undefined,
    isDateUnavailable: unavailable ?? undefined,
    positioning: { placement },
    // CalendarDate#toString is ISO.
    onValueChange: (details) => {
      report(null)
      const iso = details.value.map(String)
      value = range ? iso : iso[0] ?? null
    },
  }))
  const api = $derived(datepicker.connect(service, normalizeProps))
  const view = $derived(api.view)

  // Up/Down step an input's date by a day (Shift: a week), skipping unavailable
  // ones; in range mode the other end moves along so start never passes end.
  function step(e, index) {
    const dir = { ArrowUp: 1, ArrowDown: -1 }[e.key]
    if (!dir || e.altKey || e.metaKey || e.ctrlKey) return false
    e.preventDefault()
    const values = api.value.slice()
    let date = values[index] ? values[index].add({ days: dir * (e.shiftKey ? 7 : 1) }) : today(getLocalTimeZone())
    for (let tries = 0; api.isUnavailable(date); date = date.add({ days: dir })) if (++tries > 366) return true
    values[index] = date
    if (range) {
      const other = 1 - index
      const crossed = values[other] && (index === 0 ? date.compare(values[1]) > 0 : date.compare(values[0]) < 0)
      if (!values[other] || crossed) values[other] = date
    }
    api.setValue(values)
    return true
  }

  // The input's date pattern for the locale: its fields in order (with how
  // many digits each takes) and the separator between them ('/', '.', '-').
  const pattern = $derived.by(() => {
    const parts = new Intl.DateTimeFormat(currentLocale).formatToParts(new Date(2000, 0, 1))
    const fields = parts.filter((p) => ['day', 'month', 'year'].includes(p.type)).map((p) => (p.type === 'year' ? 4 : 2))
    return { fields, separator: parts.find((p) => p.type === 'literal')?.value.trim() || '/' }
  })

  // Typing at the end: once a field has its digits, the separator goes in
  // after it; more digits than it takes (pasted in one go) carry on into the
  // next field; a separator typed straight after one put in is dropped (no
  // "11//"). Runs before Zag's own handler, which then reads the new value.
  function separate(e) {
    const input = e.currentTarget
    if (e.inputType !== 'insertText' || input.selectionStart !== input.value.length) return
    const { fields, separator } = pattern
    if (e.data === separator && input.value.endsWith(separator + separator)) {
      input.value = input.value.slice(0, -1)
      return
    }
    const pieces = input.value.split(separator)
    if (!pieces.every((piece) => /^\d*$/.test(piece))) return
    while (pieces.length < fields.length && pieces.at(-1).length > fields[pieces.length - 1]) {
      const last = pieces.pop()
      pieces.push(last.slice(0, fields[pieces.length]), last.slice(fields[pieces.length]))
    }
    const index = pieces.length - 1
    if (index < fields.length - 1 && pieces[index].length === fields[index]) pieces.push('')
    const next = pieces.join(separator)
    if (next !== input.value) input.value = next
  }

  const dateText = (date) => new DateFormatter(currentLocale).format(date.toDate(getLocalTimeZone()))

  // Why a typed date can't be taken, or the date itself (null when empty).
  function check(input) {
    const text = input.value.trim()
    if (!text) return null
    const t = uiLocale.messages.datePicker
    const pieces = text.split(pattern.separator)
    const whole = pieces.length === pattern.fields.length && pieces.every((piece) => /^\d+$/.test(piece))
    const date = whole ? parseDateString(text, currentLocale, getLocalTimeZone()) : undefined
    if (!date) return { reason: t.format(input.placeholder) }
    if (min && date.compare(datepicker.parse(min)) < 0) return { reason: t.min(dateText(datepicker.parse(min))) }
    if (max && date.compare(datepicker.parse(max)) > 0) return { reason: t.max(dateText(datepicker.parse(max))) }
    if (api.isUnavailable(date)) return { reason: t.unavailable }
    return { date }
  }

  // A typed date it can't take: the reason, shown under the input and set as
  // its validity (so a form won't submit), until one it takes is chosen.
  let problem = $state(null)
  let rootEl = $state()
  function report(next, input = null) {
    if (next) input?.setCustomValidity(next.reason)
    else for (const el of rootEl?.querySelectorAll('[data-part=input]') ?? []) el.setCustomValidity('')
    if (next?.reason === problem?.reason && next?.index === problem?.index) return
    problem = next
    oninvalidchange?.(next ? next.reason : null)
  }

  // Takes the typed date, or reports why not (Zag would clamp or revert it).
  function commit(input, index) {
    const result = check(input)
    if (!result) { report(null, input); return true }
    if (result.reason) { report({ index, reason: result.reason }, input); return false }
    report(null, input)
    const values = api.value.slice()
    values[index] = result.date
    if (range && !values[1 - index]) values[1 - index] = result.date
    if (range && values[0] && values[1] && values[0].compare(values[1]) > 0) values.reverse()
    api.setValue(values)
    return true
  }

  // Enter takes the typed date only if it can (Zag shows "undefined" for a
  // part-typed one, 11/1); otherwise it says why.
  function keydown(e, index, props) {
    if (e.key === 'Enter') {
      if (!commit(e.currentTarget, index)) e.preventDefault()
      return
    }
    step(e, index) || props.onkeydown?.(e)
  }

  // An input's props: the field's description, and the reason it's invalid.
  function inputProps(index) {
    const props = { ...api.getInputProps({ index, fixOnBlur: false }), ...fieldAttrs(field) }
    if (problem?.index !== index) return props
    return { ...props, 'aria-invalid': 'true', 'aria-describedby': [props['aria-describedby'], `${id}-error`].filter(Boolean).join(' ') }
  }
</script>

<div bind:this={rootEl} {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)} data-inline={inline || undefined}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  {#if !inline}
    <div {...part('control')} {...api.getControlProps()}>
      {#each range ? [0, 1] : [0] as index}
        {@const props = inputProps(index)}
        {#if index === 1}<span {...part('separator')}>–</span>{/if}
        <input {...part('input')} {...props} size="10" oninputcapture={separate}
          onkeydown={(e) => keydown(e, index, props)} onblur={(e) => { props.onblur?.(e); commit(e.currentTarget, index) }} />
      {/each}
      <button {...part('clear')} {...api.getClearTriggerProps()} onclickcapture={() => report(null)}><iconify-icon icon="lucide:x"></iconify-icon></button>
      <button {...part('trigger')} {...api.getTriggerProps()}><iconify-icon icon="lucide:calendar"></iconify-icon></button>
    </div>
    {#if problem}<div {...part('error')} id="{id}-error" role="alert">{problem.reason}</div>{/if}
  {/if}

  <div {...part('positioner')} {...(inline ? {} : api.getPositionerProps())}>
    <div {...part('content')} {...api.getContentProps()}>
      <div {...part('view')} {...api.getViewProps({ view })}>
        <div {...part('view-control')} {...api.getViewControlProps({ view })}>
          {#if prev}{@render prev({ ...part('prev'), ...api.getPrevTriggerProps({ view }) })}
          {:else}<button {...part('prev')} {...api.getPrevTriggerProps({ view })}><iconify-icon icon="lucide:chevron-left"></iconify-icon></button>{/if}
          <button {...part('view-trigger')} {...api.getViewTriggerProps({ view })}>
            {#if view === 'day'}{api.visibleRangeText.start}
            {:else if view === 'month'}{api.visibleRange.start.year}
            {:else}{api.getDecade().start} – {api.getDecade().end}{/if}
          </button>
          {#if next}{@render next({ ...part('next'), ...api.getNextTriggerProps({ view }) })}
          {:else}<button {...part('next')} {...api.getNextTriggerProps({ view })}><iconify-icon icon="lucide:chevron-right"></iconify-icon></button>{/if}
        </div>

        {#if view === 'day'}
          <table {...part('table')} {...api.getTableProps({ view: 'day' })}>
            <thead {...api.getTableHeadProps({ view: 'day' })}>
              <tr {...api.getTableRowProps({ view: 'day' })}>
                {#each api.weekDays as day}<th {...part('weekday')} scope="col" aria-label={day.long}>{day.narrow}</th>{/each}
              </tr>
            </thead>
            <tbody {...api.getTableBodyProps({ view: 'day' })}>
              {#each api.weeks as week}
                <tr {...api.getTableRowProps({ view: 'day' })}>
                  {#each week as date}
                    <td {...api.getDayTableCellProps({ value: date })}>
                      <div {...part('cell')} {...api.getDayTableCellTriggerProps({ value: date })}>{date.day}</div>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        {:else if view === 'month'}
          <table {...part('table')} {...api.getTableProps({ view: 'month', columns: 4 })}>
            <tbody {...api.getTableBodyProps({ view: 'month' })}>
              {#each api.getMonthsGrid({ columns: 4, format: 'short' }) as row}
                <tr {...api.getTableRowProps({ view: 'month' })}>
                  {#each row as month}
                    <td {...api.getMonthTableCellProps({ value: month.value, columns: 4 })}>
                      <div {...part('cell')} {...api.getMonthTableCellTriggerProps({ value: month.value, columns: 4 })} data-wide>{month.label}</div>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        {:else}
          <table {...part('table')} {...api.getTableProps({ view: 'year', columns: 4 })}>
            <tbody {...api.getTableBodyProps({ view: 'year' })}>
              {#each api.getYearsGrid({ columns: 4 }) as row}
                <tr {...api.getTableRowProps({ view: 'year' })}>
                  {#each row as year}
                    <td {...api.getYearTableCellProps({ value: year.value, columns: 4 })}>
                      <div {...part('cell')} {...api.getYearTableCellTriggerProps({ value: year.value, columns: 4 })} data-wide>{year.label}</div>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    </div>
  </div>
</div>
