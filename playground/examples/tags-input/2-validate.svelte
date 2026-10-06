<!-- Validating
  `validate` decides what gets in (emails only here); a rejected entry stays to fix. `max` caps the count. -->
<script>
  import { TagsInput } from '@milktop/svelte-ui'

  let emails = $state([])
  const isEmail = ({ inputValue }) => /^\S+@\S+\.\S+$/.test(inputValue)
</script>

<TagsInput label="Invite" bind:value={emails} validate={isEmail} max={3} variant="outline" placeholder="name@example.com" />
<p>Emails only, up to 3 ({emails.length} so far)</p>
