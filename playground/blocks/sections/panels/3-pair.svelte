<!-- Side by side
  A figure with a breakdown, and a to-do list. -->
<script>
  import { Card, Progress, Checkbox } from '@milktop/svelte-ui'
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4">
  <Card heading="Revenue" description="October so far">
    <div class="text-3xl leading-tight font-bold">£1,820</div>
    <div class="mt-5 flex flex-col gap-3">
      <Progress label="Maths" value={62} showValue />
      <Progress label="Physics" value={24} showValue />
      <Progress label="English" value={14} showValue />
    </div>
  </Card>
  <Card heading="To do">
    <div class="flex flex-col gap-3">
      <Checkbox label="Send October invoices" checked />
      <Checkbox label="Mark Thursday’s homework" />
      <Checkbox label="Reply to Anne about half term" />
      <Checkbox label="Plan Year 11 mock revision" />
    </div>
  </Card>
</div>
