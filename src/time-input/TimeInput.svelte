<!--
  A time of day, typed or picked with the browser's own time control (a wheel
  on phones), as 'HH:mm'.

  <TimeInput label="Starts" bind:value={time} step={15} min="08:00" max="18:00" />

  Inside a Field it takes the field's label, hint and error. (For booking
  from free slots, show the slots instead: a free time picked here can clash.)

  - `value`: bindable; 'HH:mm', or null
  - `step`: minutes between times (1); the arrow keys move by it
  - `min`, `max`: 'HH:mm'
  - `icon`: an Iconify name before it ('lucide:clock'; null for none)
  - and Input's props: `label`, `size`, `disabled`, `name`…
-->
<script>
  import Input from '../input/Input.svelte'

  let { value = $bindable(null), step = 1, icon = 'lucide:clock', ...rest } = $props()
</script>

<Input {...rest} type="time" {icon} step={step * 60} bind:value={() => value ?? '', (next) => (value = next || null)} />
