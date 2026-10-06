<!-- Strings
  The simplest items: a list of strings. -->
<script>
  import { Select } from '@milktop/svelte-ui'

  let level = $state(null)
</script>

<Select label="Level" items={['Key Stage 3', 'GCSE', 'A Level', 'IB']} bind:value={level} />
<p class="m-0 self-end text-sm text-(--ui-muted)">Level: {level ?? '—'}</p>
