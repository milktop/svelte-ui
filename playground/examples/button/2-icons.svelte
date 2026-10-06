<!-- Icons, loading and counts
  Any Iconify name; with no text it's a square icon button. -->
<script>
  import { Button } from '@milktop/svelte-ui'

  let saving = $state(false)

  function save() {
    saving = true
    setTimeout(() => (saving = false), 1500)
  }
</script>

<Button variant="primary" icon="lucide:save" loading={saving} onclick={save}>Save</Button>
<Button iconEnd="lucide:arrow-right">Next</Button>
<Button icon="lucide:settings" aria-label="Settings" />
<Button round icon="lucide:bell" count={3} aria-label="Notifications" />
<Button round variant="soft" count={120}>Inbox</Button>
