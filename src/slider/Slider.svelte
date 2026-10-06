<!--
  A slider: pick a number, or a range with two thumbs.

  <Slider label="Volume" bind:value={volume} />
  <Slider label="Price" bind:value={range} min={0} max={100} step={5} />  (range = [20, 80])

  - `value`: bindable; a number, or an array of two for a range
  - `min`, `max`, `step`
  - `showValue`: the value beside the label (`format` turns it into text)
  - `markers`: values to label under the track
  - `name`: for plain form posts
-->
<script>
  import * as slider from '@zag-js/slider'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './slider.css'

  let {
    label = null, value = $bindable(0), min = 0, max = 100, step = 1, showValue = true,
    format = (n) => String(n), markers = null, name = null, disabled = false,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('slider', () => classes)
  const range = $derived(Array.isArray(value))

  const id = $props.id()
  const service = useMachine(slider.machine, () => ({
    id, name, disabled, min, max, step, thumbAlignment: 'center',
    invalid: !!field?.invalid,
    ids: field ? { label: field.labelId } : undefined,
    value: range ? value : [value],
    onValueChange: (details) => { value = range ? details.value : details.value[0] },
  }))
  const api = $derived(slider.connect(service, normalizeProps))
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>
  {#if (label && !field) || showValue}
    <div {...part('header')}>
      {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
      {#if showValue}<output {...part('value-text')} {...api.getValueTextProps()}>{api.value.map(format).join(' – ')}</output>{/if}
    </div>
  {/if}
  <div {...part('control')} {...api.getControlProps()}>
    <div {...part('track')} {...api.getTrackProps()}><div {...part('range')} {...api.getRangeProps()}></div></div>
    {#each api.value as _, index}
      <div {...part('thumb')} {...api.getThumbProps({ index })} {...fieldAttrs(field)}><input {...api.getHiddenInputProps({ index })} /></div>
    {/each}
  </div>
  {#if markers}
    <div {...part('markers')} {...api.getMarkerGroupProps()}>
      {#each markers as marker}<span {...part('marker')} {...api.getMarkerProps({ value: marker })}>{format(marker)}</span>{/each}
    </div>
  {/if}
</div>
