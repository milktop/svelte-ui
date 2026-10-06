<!-- Icons, affixes and snippets
  `icon`, `prefix` and `suffix` for the usual cases; `start` and `end` snippets for anything else; `round` for a pill. -->
<script>
  import { Fields, Field, Input, Button } from '@milktop/svelte-ui'
</script>

<Fields class="w-full">
  <Field label="Search" span={6}><Input icon="lucide:search" placeholder="Search…" round /></Field>
  <Field label="Rate" span={6}><Input prefix="£" suffix="per hour" type="number" /></Field>
  <Field label="Invite" span={12}>
    <Input placeholder="name@example.com" type="email">
      {#snippet end()}<Button size="sm" variant="ghost" class="-mr-2">Send</Button>{/snippet}
    </Input>
  </Field>
</Fields>
