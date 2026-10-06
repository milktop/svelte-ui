<!--
  A date picker: type a date, or pick it from a calendar.

  <DatePicker label="Lesson date" bind:value={date} min="2026-01-01" />

  - `value`: bindable, an ISO date ('YYYY-MM-DD'), or an array of two with `range`
  - `range`: pick a start and an end
  - `min`, `max`: ISO dates
  - `unavailable`: function(CalendarDate) returning true for dates that can't
    be picked (weekends, holidays); they show struck through

  Up and Down in the input step its date by a day (Shift: a week), skipping
  unavailable ones; on an empty input the first press picks today.
  - `locale`: for formatting and the first day of the week ('en-GB')
  - `placement`: where the calendar opens ('bottom-start')
  - `prev`, `next` snippets: replace those buttons; they get Zag's props
    (spread them onto your button) and the part's classes
-->
<script>
  import * as datepicker from '@zag-js/date-picker'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { today, getLocalTimeZone } from '@internationalized/date'
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './date-picker.css'

  let {
    label = null, value = $bindable(null), range = false, min = null, max = null, unavailable = null,
    locale = 'en-GB', placement = 'bottom-start', disabled = false,
    class: className = '', classes = {}, prev = null, next = null, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('date-picker', () => classes)

  const id = $props.id()
  const service = useMachine(datepicker.machine, () => ({
    id, locale, disabled,
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
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('control')} {...api.getControlProps()}>
    {#each range ? [0, 1] : [0] as index}
      {@const inputProps = api.getInputProps({ index })}
      {#if index === 1}<span {...part('separator')}>–</span>{/if}
      <input {...part('input')} {...inputProps} size="10" {...fieldAttrs(field)}
        onkeydown={(e) => step(e, index) || inputProps.onkeydown?.(e)} />
    {/each}
    <button {...part('clear')} {...api.getClearTriggerProps()}><iconify-icon icon="lucide:x"></iconify-icon></button>
    <button {...part('trigger')} {...api.getTriggerProps()}><iconify-icon icon="lucide:calendar"></iconify-icon></button>
  </div>

  <div {...part('positioner')} {...api.getPositionerProps()}>
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
