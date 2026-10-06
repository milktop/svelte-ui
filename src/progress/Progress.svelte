<!--
  A progress indicator, as a bar or a circle.

  <Progress label="Course" value={64} showValue />
  <Progress variant="circle" value={80} showValue />

  - `value`: from `min` to `max` (0 to 100); null means indeterminate, for
    work of unknown length
  - `label`, `showValue`: a label and the formatted value (a percentage by
    default; see `formatOptions`, `locale`)
  - `variant`: 'linear' (default) or 'circle'; `size` and `thickness` set the
    circle's diameter and stroke in px
-->
<script>
  import * as progress from '@zag-js/progress'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './progress.css'

  let {
    value = null, min = 0, max = 100, label = null, showValue = false, variant = 'linear', size = 48, thickness = 5,
    formatOptions = undefined, locale = 'en-GB', class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('progress', () => classes)
  const id = $props.id()
  // Zag treats a missing value as the midpoint, and null as indeterminate.
  const service = useMachine(progress.machine, () => ({ id, value: value ?? null, min, max, formatOptions, locale }))
  const api = $derived(progress.connect(service, normalizeProps))
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)} data-variant={variant}>
  {#if label || (showValue && variant === 'linear')}
    <div {...part('header')}>
      {#if label}<span {...part('label')} {...api.getLabelProps()}>{label}</span>{/if}
      {#if showValue && variant === 'linear'}<span {...part('value')} {...api.getValueTextProps()}>{api.valueAsString}</span>{/if}
    </div>
  {/if}
  {#if variant === 'circle'}
    <div {...part('circle-wrap')} style:--size="{size}px" style:--thickness="{thickness}px">
      <svg {...part('circle')} {...api.getCircleProps()}>
        <circle {...part('circle-track')} {...api.getCircleTrackProps()} />
        <circle {...part('circle-range')} {...api.getCircleRangeProps()} />
      </svg>
      {#if showValue}<span {...part('circle-value')} {...api.getValueTextProps()}>{api.valueAsString}</span>{/if}
    </div>
  {:else}
    <div {...part('track')} {...api.getTrackProps()}><div {...part('range')} {...api.getRangeProps()}></div></div>
  {/if}
</div>
