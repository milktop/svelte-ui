<!-- A value or a range
  An array value gives two thumbs. `format` turns values into text. -->
<script>
  import { Slider } from '@milktop/svelte-ui'

  let volume = $state(40)
  let price = $state([20, 60])
</script>

<div class="flex w-full max-w-md flex-col gap-6">
  <Slider label="Volume" bind:value={volume} />
  <Slider label="Price" bind:value={price} step={5} format={(n) => `£${n}`} markers={[0, 50, 100]} />
</div>
