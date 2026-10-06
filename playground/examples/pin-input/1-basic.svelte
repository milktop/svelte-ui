<!-- Codes and PINs
  Typing moves along the boxes, pasting fills them all, and `oncomplete` fires once they're full. `mask` hides the characters. -->
<script>
  import { PinInput } from '@milktop/svelte-ui'

  let code = $state('')
  let pin = $state('')
  let done = $state(null)
</script>

<PinInput label="Code" count={6} otp bind:value={code} oncomplete={(value) => (done = value)} />
<PinInput label="PIN" mask bind:value={pin} count={4} />
<p>Code: {code || '—'}{done ? ` (completed: ${done})` : ''}, PIN: {pin.length} of 4</p>
