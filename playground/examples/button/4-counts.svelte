<!-- Counts, dots and pulses
  `count` (over `max` shows "99+"), `dot` for "something new", `pulse` to draw the eye, and `countColor`. Assistive tech hears "Inbox, 3 new" (`countLabel`). -->
<script>
  import { Button } from '@milktop/svelte-ui'
</script>

<Button round icon="lucide:bell" count={3} aria-label="Notifications" />
<Button round icon="lucide:message-square" dot pulse aria-label="Messages" />
<Button icon="lucide:inbox" count={120} countColor="accent" countLabel="unread">Inbox</Button>
<Button icon="lucide:check" count={4} countColor="success">Done</Button>
<Button icon="lucide:clock" dot countColor="warning">Pending</Button>
