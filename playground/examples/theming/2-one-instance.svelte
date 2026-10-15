<!-- Part of a page, or one instance: tokens in a class
  Set tokens on any element and only what's inside it changes: a wrapper for part of a page, or the component itself for one instance. With Tailwind that's an arbitrary-property class (`[--ui-accent:#16a34a]`); without it, the same in `style` (`style="--ui-accent: #16a34a"`), which is also how to set a value worked out at run time. Tokens made from others (the soft tint, the ring) are worked out on `:root`, so set those too wherever you change the accent. -->
<script>
  import { Button, Switch, Card, Badge } from '@milktop/svelte-ui'

  // The accent, its soft tint and the focus ring, green.
  const green = '[--ui-accent:#16a34a] [--ui-accent-soft:#dcfce7] [--ui-accent-soft-text:#166534] [--ui-ring:#16a34a] [--ui-ring-soft:#16a34a33]'
  let on = $state(true)
</script>

<Button variant="primary">The app's accent</Button>
<Button variant="primary" class={green}>Just this one</Button>
<!-- A section: green, square and dense, everything inside it. -->
<div class="{green} [--ui-radius:4px] [--ui-control-height:2rem] flex w-full flex-wrap items-center gap-3 rounded-md border border-(--ui-border) p-3">
  <Button variant="primary">Pay invoice</Button>
  <Button variant="soft">Download</Button>
  <Badge variant="accent">Paid</Badge>
  <Switch label="Autopay" bind:checked={on} />
</div>
<Card class="w-full [--ui-radius:16px]" heading="A rounder card">Only this card's radius changed.</Card>
