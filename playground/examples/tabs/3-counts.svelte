<!-- Counts and dots
  A Tab's `count` follows its label (hidden at 0, "99+" past `max`), or a `dot`; `countColor` colours it and `pulse` ripples it. Quiet by default, it takes the accent on the selected tab. Inline suits both variants; `counts="corner"` raises them into the tab's top right instead, like a button's. -->
<script>
  import { Tabs, Tab } from '@milktop/svelte-ui'
</script>

<Tabs>
  <Tab value="inbox" label="Inbox" count={4} countLabel="unread">4 unread messages.</Tab>
  <Tab value="invoices" label="Invoices" count={2} countColor="danger" countLabel="overdue">2 invoices are overdue.</Tab>
  <Tab value="reports" label="Reports" dot pulse countColor="accent" countLabel="new">A new report is ready.</Tab>
  <Tab value="archive" label="Archive" count={120}>Everything else.</Tab>
</Tabs>
<Tabs variant="pills">
  <Tab value="inbox" label="Inbox" count={4} countColor="danger">4 unread messages.</Tab>
  <Tab value="drafts" label="Drafts" dot countColor="accent">One draft has changed.</Tab>
  <Tab value="sent" label="Sent">Sent messages.</Tab>
</Tabs>
<Tabs counts="corner">
  <Tab value="inbox" label="Inbox" count={4} countColor="danger">4 unread messages.</Tab>
  <Tab value="drafts" label="Drafts" dot countColor="accent">One draft has changed.</Tab>
  <Tab value="sent" label="Sent">Sent messages.</Tab>
</Tabs>
