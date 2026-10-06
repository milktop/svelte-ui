<!-- Area
  Hover for a tooltip. -->
<script>
  import { AreaChart, Button } from '@milktop/svelte-ui'
  import { months, pounds } from './months.js'

  let data = $state(months)

  function shuffle() {
    data = months.map((m) => ({ ...m, revenue: Math.round(m.revenue * (0.6 + Math.random() * 0.8)) }))
  }
</script>

<AreaChart {data} x="month" y="revenue" format={pounds} label="Revenue by month" />
<div class="flex gap-2"><Button size="sm" onclick={shuffle}>New data</Button><Button size="sm" onclick={() => (data = months)}>Reset</Button></div>
