<!-- Show and hide
  The eye button toggles it; `visible` is bindable too. -->
<script>
  import { Fields, Field, PasswordInput } from '@milktop/svelte-ui'

  let password = $state('')
</script>

<Fields class="w-full">
  <Field label="Password" span={6} hint="{password.length} characters">
    <PasswordInput icon="lucide:lock" bind:value={password} placeholder="At least 8 characters" autocomplete="new-password" />
  </Field>
</Fields>
