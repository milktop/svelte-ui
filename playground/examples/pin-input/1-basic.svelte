<!-- Codes and PINs
  Typing moves along the boxes, pasting fills them all, and `oncomplete` fires once they're full. `mask` hides the characters. -->
<script>
  import { Fields, Field, PinInput } from '@milktop/svelte-ui'

  let code = $state('')
  let pin = $state('')
  let done = $state(null)
</script>

<Fields class="w-full">
  <Field label="Code" span={6} hint={done ? `Completed: ${done}` : 'Six digits'}>
    <PinInput count={6} otp bind:value={code} oncomplete={(value) => (done = value)} />
  </Field>
  <Field label="PIN" span={6} hint="{pin.length} of 4"><PinInput mask bind:value={pin} count={4} /></Field>
</Fields>
