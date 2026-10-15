<!-- Rolling digits
  Change the number and its digits roll (still, with reduced motion). Formatted like FormatNumber; screen readers hear the whole number. -->
<script>
  import { RollingNumber, Button } from '@milktop/svelte-ui'

  let count = $state(128)
  let money = $state(18240)
</script>

<div class="flex w-full flex-col gap-4">
  <div class="flex items-center gap-3">
    <span class="text-3xl font-bold"><RollingNumber value={count} /></span>
    <Button size="sm" icon="lucide:minus" aria-label="One less" onclick={() => count--} />
    <Button size="sm" icon="lucide:plus" aria-label="One more" onclick={() => count++} />
    <Button size="sm" onclick={() => (count = Math.round(Math.random() * 2000))}>Random</Button>
  </div>
  <div class="flex items-center gap-3">
    <span class="text-2xl font-semibold"><RollingNumber value={money} format={{ style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }} duration={900} /></span>
    <Button size="sm" onclick={() => (money += Math.round(Math.random() * 500))}>Payment in</Button>
  </div>
</div>
