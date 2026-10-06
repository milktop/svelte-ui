<!-- With an action
  The action button runs its handler and dismisses the toast. -->
<script>
  import { toaster, Button } from '@milktop/svelte-ui'

  function removed() {
    toaster.create({
      title: 'Lesson removed',
      description: 'It’s gone from the calendar.',
      action: { label: 'Undo', onClick: () => toaster.info({ title: 'Lesson restored' }) },
    })
  }
</script>

<Button icon="lucide:undo-2" onclick={removed}>Remove lesson</Button>
