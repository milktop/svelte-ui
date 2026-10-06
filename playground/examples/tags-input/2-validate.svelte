<!-- Validating
  `validate` decides what gets in (emails only here); `max` caps the count. -->
<script>
  import { Fields, Field, TagsInput } from '@milktop/svelte-ui'

  let emails = $state([])
  const isEmail = ({ inputValue }) => /^\S+@\S+\.\S+$/.test(inputValue)
</script>

<Fields class="w-full">
  <Field label="Invite" span={12} hint="Emails only, up to 3 ({emails.length} so far)">
    <TagsInput bind:value={emails} validate={isEmail} max={3} variant="outline" placeholder="name@example.com" />
  </Field>
</Fields>
