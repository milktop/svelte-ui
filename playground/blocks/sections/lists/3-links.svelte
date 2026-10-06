<!-- Links
  An icon, a title and a hint, and a chevron, as in a settings menu. -->
<script>
  const links = [
    { icon: 'lucide:user', title: 'Profile', hint: 'Name, photo and bio' },
    { icon: 'lucide:calendar', title: 'Availability', hint: 'When students can book' },
    { icon: 'lucide:credit-card', title: 'Payments', hint: 'Bank details and payouts' },
    { icon: 'lucide:bell', title: 'Notifications', hint: 'Emails and reminders' },
  ]
</script>

<ul class="m-0 max-w-md list-none overflow-hidden rounded-[calc(var(--ui-radius)+4px)] border border-(--ui-border) bg-(--ui-surface) p-0">
  {#each links as link}
    <li class="border-b border-(--ui-border) last:border-0">
      <a href="#/blocks/lists" class="flex items-center gap-3 px-4 py-3 text-inherit no-underline hover:bg-(--ui-hover) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ui-ring-soft)">
        <span class="grid h-8 w-8 place-items-center rounded-(--ui-radius) bg-(--ui-hover) text-base text-(--ui-muted)"><iconify-icon icon={link.icon}></iconify-icon></span>
        <div class="grow"><div class="font-medium">{link.title}</div><div class="text-xs text-(--ui-muted)">{link.hint}</div></div>
        <iconify-icon icon="lucide:chevron-right" class="text-(--ui-muted)"></iconify-icon>
      </a>
    </li>
  {/each}
</ul>
