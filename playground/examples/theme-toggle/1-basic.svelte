<!-- Basic
  It drives `colorScheme`, so every toggle on the page (and the Appearance panel) stays in step, and the choice is saved. -->
<script>
  import { ThemeToggle, colorScheme } from '@milktop/svelte-ui'

  let picked = $state(null)
</script>

<ThemeToggle onchange={(scheme) => (picked = scheme)} />
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify({ picked, scheme: colorScheme.value, dark: colorScheme.dark })}</p>
