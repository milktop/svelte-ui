<!-- People
  Avatar, name and email, a role, and a menu per row. -->
<script>
  import { Avatar, Badge, Menu, Button } from '@milktop/svelte-ui'
  import { students } from '../../data.js'

  const items = [
    { value: 'message', label: 'Message', icon: 'lucide:message-square' },
    { value: 'profile', label: 'View profile', icon: 'lucide:user' },
    { separator: true },
    { value: 'remove', label: 'Remove', icon: 'lucide:user-minus', danger: true },
  ]
</script>

<ul class="m-0 flex list-none flex-col rounded-[calc(var(--ui-radius)+4px)] border border-(--ui-border) bg-(--ui-surface) p-0">
  {#each students.slice(0, 5) as student, i}
    <li class="flex items-center gap-3 border-b border-(--ui-border) px-4 py-3 last:border-0">
      <Avatar name={student.name} />
      <div class="min-w-0 grow">
        <div class="font-medium">{student.name}</div>
        <div class="truncate text-xs text-(--ui-muted)">{student.email}</div>
      </div>
      <Badge variant={i === 0 ? 'accent' : 'neutral'}>{i === 0 ? 'Parent' : 'Student'}</Badge>
      <Menu {items} label={student.name} placement="bottom-end">
        {#snippet trigger(props)}<Button {...props} size="sm" variant="ghost" icon="lucide:ellipsis" aria-label="Actions for {student.name}" />{/snippet}
      </Menu>
    </li>
  {/each}
</ul>
