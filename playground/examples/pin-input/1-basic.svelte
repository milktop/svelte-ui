<!-- A verification code
  Typing moves along the boxes, pasting fills them all, and `oncomplete` fires once they're full. -->
<script>
  import { PinInput } from '@milktop/svelte-ui'

  let code = $state('')
  let pin = $state('')
  let done = $state(null)
</script>

<PinInput label="Code" count={6} otp bind:value={code} oncomplete={(value) => (done = value)} />
<PinInput label="PIN" mask bind:value={pin} count={4} />
<p class="m-0 self-end text-sm text-(--ui-muted)">code: {code || '—'}{done ? ` (completed: ${done})` : ''}, pin: {pin.length} digits</p>
