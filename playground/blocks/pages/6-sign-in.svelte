<!-- Sign in
  A centred card with the form, a social sign-in and a link to create an account. -->
<script>
  import { Card, Fields, Field, Checkbox, Button } from '@milktop/svelte-ui'

  let email = $state('')
  let password = $state('')
  let remember = $state(true)
  let busy = $state(false)

  function submit(e) {
    e.preventDefault()
    busy = true
    setTimeout(() => (busy = false), 1200)
  }
</script>

<div class="grid place-items-center py-8">
  <div class="w-full max-w-sm">
    <div class="mb-6 flex flex-col items-center gap-3 text-center">
      <span class="grid h-10 w-10 place-items-center rounded-[calc(var(--ui-radius)+2px)] bg-(--ui-accent) font-bold text-(--ui-accent-text)">T</span>
      <div>
        <h2 class="m-0 text-xl font-bold">Welcome back</h2>
        <p class="m-0 text-sm text-(--ui-muted)">Sign in to your tutoring account</p>
      </div>
    </div>
    <Card>
      <form onsubmit={submit} class="flex flex-col gap-4">
        <Fields>
          <Field label="Email" type="email" icon="lucide:mail" placeholder="you@example.com" autocomplete="email" bind:value={email} />
          <Field label="Password" type="password" autocomplete="current-password" bind:value={password} />
        </Fields>
        <div class="flex items-center justify-between">
          <Checkbox label="Remember me" bind:checked={remember} />
          <a href="#/blocks/sign-in" class="text-sm text-(--ui-accent) no-underline hover:underline">Forgot password?</a>
        </div>
        <Button type="submit" variant="primary" block loading={busy}>Sign in</Button>
        <div class="my-1 flex items-center gap-3 text-xs text-(--ui-muted) before:h-px before:grow before:bg-(--ui-border) after:h-px after:grow after:bg-(--ui-border)">or</div>
        <Button block icon="logos:google-icon">Continue with Google</Button>
      </form>
    </Card>
    <p class="mt-6 mb-0 text-center text-sm text-(--ui-muted)">New here? <a href="#/blocks/sign-in" class="text-(--ui-accent) no-underline hover:underline">Create an account</a></p>
  </div>
</div>
