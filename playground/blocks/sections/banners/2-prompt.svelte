<!-- Prompt
  A prompt to do something next, with an illustration-like icon. -->
<script>
  import { Button } from '@milktop/svelte-ui'
</script>

<div class="flex flex-wrap items-center gap-5 rounded-[calc(var(--ui-radius)+6px)] border border-(--ui-border) bg-(--ui-surface) p-6">
  <span class="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-(--ui-accent-soft) text-[28px] text-(--ui-accent-soft-text)"><iconify-icon icon="lucide:calendar-sync"></iconify-icon></span>
  <div class="min-w-64 grow">
    <h3 class="m-0 text-base font-semibold">Connect your calendar</h3>
    <p class="mt-1 mb-0 text-sm text-(--ui-muted)">Lessons appear in Google or Outlook, and busy times block bookings.</p>
  </div>
  <div class="flex gap-2"><Button variant="ghost">Later</Button><Button variant="primary">Connect</Button></div>
</div>
