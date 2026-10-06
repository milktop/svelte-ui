<!-- Text and numbers
  `bind:value` for every type; a number input binds a number. -->
<script>
  import { Fields, Field, Input } from '@milktop/svelte-ui'

  let name = $state('Ada Lovelace')
  let age = $state(16)
</script>

<Fields class="w-full">
  <Field label="Name" span={6} hint="Bound: {name}"><Input bind:value={name} /></Field>
  <Field label="Age" span={6} hint="Bound: {age} ({typeof age})"><Input type="number" bind:value={age} suffix="years" /></Field>
</Fields>
