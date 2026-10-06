<!-- Show and hide
  The eye button toggles it; `visible` is bindable too. -->
<script>
  import { PasswordInput } from '@milktop/svelte-ui'

  let password = $state('')
</script>

<PasswordInput label="Password" icon="lucide:lock" bind:value={password} placeholder="At least 8 characters" autocomplete="new-password" class="w-72" />
<p class="m-0 self-end text-sm text-(--ui-muted)">{password.length} characters</p>
