<!-- Pick one
  Items can be strings, or objects with a `description`; `orientation="horizontal"` puts them in a row. -->
<script>
  import { Fields, Field, RadioGroup } from '@milktop/svelte-ui'

  const plans = [
    { value: 'payg', label: 'Pay as you go', description: 'Pay for each lesson' },
    { value: 'block', label: 'Block of 10', description: 'One free lesson' },
    { value: 'term', label: 'Termly', description: 'Billed each term', disabled: true },
  ]

  let plan = $state('payg')
  let length = $state(60)
</script>

<Fields class="w-full">
  <Field label="Plan" span={6} hint="Bound: {plan}"><RadioGroup items={plans} bind:value={plan} /></Field>
  <Field label="Length" span={6} hint="Bound: {length} ({typeof length})">
    <RadioGroup orientation="horizontal" items={[{ value: 30, label: '30 min' }, { value: 60, label: '60 min' }]} bind:value={length} />
  </Field>
</Fields>
