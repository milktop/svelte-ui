<!-- In a field
  It takes the field's label, hint and error. -->
<script>
  import { Editor, Fields, Field } from '@milktop/svelte-ui'

  let message = $state('')
  // The value is HTML: count its text.
  const length = $derived(message.replace(/<[^>]*>/g, '').length)
</script>

<Fields class="w-full">
  <Field label="Message to parents" hint="They’ll get this by email."
    error={length > 0 && length < 20 ? 'A little more, please' : null}>
    <Editor bind:value={message} placeholder="Write a message…" minHeight="6rem" />
  </Field>
</Fields>
