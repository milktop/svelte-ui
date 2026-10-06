<!-- Types
  Call `toaster.success(…)`, `.error`, `.warning`, `.info` or `.loading` from anywhere; one `<Toaster />` in the layout shows them. -->
<script>
  import { toaster, Button } from '@milktop/svelte-ui'
</script>

<Button icon="lucide:check" onclick={() => toaster.success({ title: 'Lesson booked', description: 'Maths with Ada, Thursday at 16:00' })}>Success</Button>
<Button icon="lucide:circle-x" onclick={() => toaster.error({ title: 'Could not save', description: 'Check your connection and try again.' })}>Error</Button>
<Button icon="lucide:triangle-alert" onclick={() => toaster.warning({ title: 'Lesson overlaps', description: 'Ada has another lesson at 16:30.' })}>Warning</Button>
<Button icon="lucide:info" onclick={() => toaster.info({ title: 'New message', description: 'Grace replied about Thursday.' })}>Info</Button>
