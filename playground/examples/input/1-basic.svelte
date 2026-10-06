<!-- Text, numbers and binding
  `bind:value` works for every type; a number input binds a number. -->
<script>
  import { Input } from '@milktop/svelte-ui'

  let name = $state('Ada')
  let age = $state(16)
</script>

<Input bind:value={name} placeholder="Name" />
<Input type="number" bind:value={age} suffix="years" class="w-36" />
<p class="m-0 self-center text-sm text-(--ui-muted)">{name}, {age} ({typeof age})</p>
