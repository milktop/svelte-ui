<!-- Text and numbers
  `bind:value` for every type; a number input binds a number. -->
<script>
  import { Input } from '@milktop/svelte-ui'

  let name = $state('Ada Lovelace')
  let age = $state(16)
</script>

<Input label="Name" bind:value={name} />
<Input label="Age" type="number" bind:value={age} suffix="years" />
<p>{name}, {age} ({typeof age})</p>
