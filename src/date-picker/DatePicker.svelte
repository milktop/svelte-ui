<!--
  A date picker: type a date, or pick it from a calendar.

  <DatePicker label="Lesson date" bind:value={date} min="2026-01-01" />

  - `value`: bindable, an ISO date ('YYYY-MM-DD')
  - `min`, `max`: ISO dates
  - `locale`: for formatting and the first day of the week ('en-GB')
  - `placement`: where the calendar opens ('bottom-start')
  - `prev`, `next` snippets: replace those buttons; they get Zag's props
    (spread them onto your button) and the part's classes
-->
<script>
  import * as datepicker from '@zag-js/date-picker'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './date-picker.css'

  let {
    label = null, value = $bindable(null), min = null, max = null,
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
    value: value ? [datepicker.parse(value)] : [],
    min: min ? datepicker.parse(min) : undefined,
    max: max ? datepicker.parse(max) : undefined,
    positioning: { placement },
    // CalendarDate#toString is ISO.
    onValueChange: (details) => { value = details.value[0]?.toString() ?? null },
  }))
  const api = $derived(datepicker.connect(service, normalizeProps))
  const view = $derived(api.view)
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('control')} {...api.getControlProps()}>
    <input {...part('input')} {...api.getInputProps()} size="10" {...fieldAttrs(field)} />
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
