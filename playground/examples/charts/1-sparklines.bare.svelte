<!-- Sparklines
  Colours come from the theme (--ui-chart-1…5, the first being the accent), so they follow dark mode and the accent picker. -->
<script>
  import { Sparkline, Card } from '@milktop/svelte-ui'
  import { months } from './months.js'
</script>

<div class="grid w-full grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
  <Card><span class="text-sm text-(--ui-muted)">Revenue</span><div class="mb-2 text-xl font-bold">£1,820</div>
    <Sparkline data={months} y="revenue" label="Revenue, April to October" /></Card>
  <Card><span class="text-sm text-(--ui-muted)">Maths lessons</span><div class="mb-2 text-xl font-bold">33</div>
    <Sparkline data={months} y="maths" variant="area" color="success" /></Card>
  <Card><span class="text-sm text-(--ui-muted)">Physics lessons</span><div class="mb-2 text-xl font-bold">12</div>
    <Sparkline data={months} y="physics" variant="bar" height={40} /></Card>
</div>
