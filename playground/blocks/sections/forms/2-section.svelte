<!-- Settings section
  What it's for on one side, the fields on the other. -->
<script>
  import { Card, Switch, Button } from '@milktop/svelte-ui'
</script>

<div class="flex flex-wrap gap-x-8 gap-y-4">
  <div class="flex-[1_1_14rem]">
    <h3 class="m-0 text-base font-semibold">Reminders</h3>
    <p class="mt-1 mb-0 text-sm text-(--ui-muted)">Sent to students (and parents) before each lesson.</p>
  </div>
  <Card class="min-w-0 flex-[2_1_24rem]">
    <div class="flex flex-col gap-4">
      <Switch label="Email, the day before" checked />
      <Switch label="Text message, an hour before" />
    </div>
    {#snippet footer()}<Button variant="primary" size="sm">Save</Button>{/snippet}
  </Card>
</div>
