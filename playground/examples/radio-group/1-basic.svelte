<!-- Pick one
  Items can be strings, or objects with a `description`; `orientation="horizontal"` puts them in a row. -->
<script>
  import { RadioGroup } from '@milktop/svelte-ui'

  const plans = [
    { value: 'payg', label: 'Pay as you go', description: 'Pay for each lesson' },
    { value: 'block', label: 'Block of 10', description: 'One free lesson' },
    { value: 'term', label: 'Termly', description: 'Billed each term', disabled: true },
  ]

  let plan = $state('payg')
  let length = $state(60)
</script>

<RadioGroup label="Plan" items={plans} bind:value={plan} />
<RadioGroup label="Length" orientation="horizontal" items={[{ value: 30, label: '30 min' }, { value: 60, label: '60 min' }]} bind:value={length} />
<p>{plan}, {length} ({typeof length})</p>
