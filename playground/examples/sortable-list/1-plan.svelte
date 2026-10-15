<!-- A lesson plan
  Drag a topic by its grip, or focus the grip and use Space and the arrow keys. The rows hold anything: here a time, a title and a badge. -->
<script>
  import { SortableList, Badge } from '@milktop/svelte-ui'

  let plan = $state([
    { id: 'recap', title: 'Recap: equivalent fractions', minutes: 10, kind: 'Review' },
    { id: 'teach', title: 'Converting fractions to decimals', minutes: 20, kind: 'New' },
    { id: 'practice', title: 'Worksheet 4, questions 1–8', minutes: 20, kind: 'Practice' },
    { id: 'quiz', title: 'Five-minute quiz', minutes: 5, kind: 'Check' },
    { id: 'homework', title: 'Set homework', minutes: 5, kind: 'Admin' },
  ])
</script>

<SortableList bind:items={plan} label="Lesson plan" class="w-full max-w-lg">
  {#snippet item(step, { index })}
    <span class="flex items-center gap-3">
      <span class="w-6 text-xs text-(--ui-muted) tabular-nums">{index + 1}.</span>
      <span class="min-w-0 flex-1 truncate">{step.title}</span>
      <span class="text-xs text-(--ui-muted)">{step.minutes} min</span>
      <Badge variant={step.kind === 'New' ? 'accent' : 'neutral'}>{step.kind}</Badge>
    </span>
  {/snippet}
</SortableList>
<p class="m-0 w-full text-sm text-(--ui-muted)">{plan.map((step) => step.id).join(' → ')}</p>
