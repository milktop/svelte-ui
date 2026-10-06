<!-- Icons, affixes and snippets
  `icon`, `prefix` and `suffix` for the usual cases; `start` and `end` snippets for anything else. -->
<script>
  import { Input, Button } from '@milktop/svelte-ui'

  let query = $state('')
</script>

<Input icon="lucide:search" placeholder="Search…" round bind:value={query} />
<Input prefix="£" suffix="per hour" type="number" class="w-48" />
<Input placeholder="Invite by email" type="email">
  {#snippet end()}<Button size="sm" variant="ghost" class="-mr-2">Send</Button>{/snippet}
</Input>
