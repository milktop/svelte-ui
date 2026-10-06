<!-- A popover
  The `trigger` snippet gets Zag's props for your button. -->
<script>
  import { Popover, Button, Switch } from '@milktop/svelte-ui'

  let open = $state(false)
</script>

<Popover heading="Lesson settings" description="For this lesson only." closable bind:open>
  {#snippet trigger(props)}<Button {...props} icon="lucide:settings">Settings</Button>{/snippet}
  <div class="flex flex-col gap-3">
    <Switch label="Send a reminder" checked />
    <Switch label="Record the lesson" />
  </div>
</Popover>
<p class="m-0 self-center text-sm text-(--ui-muted)">open: {open}</p>
