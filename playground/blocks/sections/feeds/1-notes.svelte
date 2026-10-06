<!-- Notes with a composer
  Notes on a student, newest last, with a box to add one. -->
<script>
  import { Avatar, Textarea, Button } from '@milktop/svelte-ui'

  let draft = $state('')
  let notes = $state([
    { who: 'Grace Hopper', when: '24 Sep', text: 'Worked through ratio problems; still unsure with unequal shares.' },
    { who: 'Anne Byron', when: '25 Sep', text: 'Thanks! She practised a few more at home.' },
    { who: 'Grace Hopper', when: '1 Oct', text: 'Much better today. Moving on to percentages next week.' },
  ])

  function add() {
    if (!draft.trim()) return
    notes = [...notes, { who: 'Grace Hopper', when: 'Just now', text: draft.trim() }]
    draft = ''
  }
</script>

<div class="flex max-w-2xl flex-col gap-4">
  {#each notes as note}
    <div class="flex gap-3">
      <Avatar size="sm" name={note.who} />
      <div class="grow rounded-[calc(var(--ui-radius)+4px)] border border-(--ui-border) bg-(--ui-surface) p-3">
        <div class="flex justify-between gap-2 text-xs"><span class="text-sm font-semibold">{note.who}</span><span class="text-(--ui-muted)">{note.when}</span></div>
        <p class="mt-1 mb-0">{note.text}</p>
      </div>
    </div>
  {/each}
  <div class="flex items-start gap-3">
    <Avatar size="sm" name="Grace Hopper" />
    <div class="flex grow flex-col gap-2">
      <Textarea placeholder="Add a note…" rows={2} bind:value={draft} />
      <div class="flex justify-end"><Button size="sm" variant="primary" disabled={!draft.trim()} onclick={add}>Add note</Button></div>
    </div>
  </div>
</div>
