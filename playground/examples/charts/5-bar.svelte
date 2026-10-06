<!-- Bar -->
<script>
  import { BarChart } from '@milktop/svelte-ui'
  import { months, pounds } from './months.js'
</script>

<BarChart data={months} x="month" y="revenue" format={pounds} label="Revenue by month" />
