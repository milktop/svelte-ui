<!-- Icons, affixes and snippets
  `icon`, `prefix` and `suffix` for the usual cases; `start` and `end` snippets for anything else; `round` for a pill. -->
<script>
  import { Input, Button } from '@milktop/svelte-ui'
</script>

<Input label="Search" icon="lucide:search" placeholder="Search…" round />
<Input label="Rate" prefix="£" suffix="per hour" type="number" />
<Input label="Invite" placeholder="name@example.com" type="email">
  {#snippet end()}<Button size="sm" variant="ghost" class="-mr-2">Send</Button>{/snippet}
</Input>
