<!-- Onboarding checklist
  Getting started: progress and the steps left. -->
<script>
  import { Card, Progress } from '@milktop/svelte-ui'

  const steps = [
    { label: 'Add your first student', done: true },
    { label: 'Set your availability', done: true },
    { label: 'Book a lesson', done: false },
    { label: 'Send an invoice', done: false },
  ]
  const done = steps.filter((step) => step.done).length
</script>

<Card heading="Get started" description="{done} of {steps.length} done" class="max-w-md">
  <Progress value={(done / steps.length) * 100} label="Setup progress" />
  <ul class="mt-4 mb-0 flex list-none flex-col gap-2.5 p-0">
    {#each steps as step}
      <li class="flex items-center gap-2.5">
        <span class={['grid h-5 w-5 place-items-center rounded-full border-[1.5px] text-xs',
          step.done ? 'border-(--ui-success) bg-(--ui-success) text-white' : 'border-(--ui-border) text-transparent']}><iconify-icon icon="lucide:check"></iconify-icon></span>
        <span class={step.done ? 'text-(--ui-muted) line-through' : ''}>{step.label}</span>
      </li>
    {/each}
  </ul>
</Card>
