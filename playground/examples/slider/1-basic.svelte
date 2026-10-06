<!-- A value or a range
  An array value gives two thumbs; `formatOptions` formats the value and marks; `marks` can carry their own labels. -->
<script>
  import { Fields, Field, Slider } from '@milktop/svelte-ui'

  let volume = $state(40)
  let price = $state([20, 60])
  let level = $state(2)
</script>

<Fields class="w-full">
  <Field label="Volume" span={6}><Slider bind:value={volume} /></Field>
  <Field label="Price" span={6}>
    <Slider bind:value={price} step={5} formatOptions={{ style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }} locale="en-GB" marks={[0, 50, 100]} />
  </Field>
  <Field label="Confidence" span={12}>
    <Slider bind:value={level} min={1} max={3} showValue={false} marks={[{ value: 1, label: 'Unsure' }, { value: 2, label: 'Getting there' }, { value: 3, label: 'Confident' }]} />
  </Field>
</Fields>
