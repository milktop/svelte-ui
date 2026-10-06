<!-- Stacked area -->
<script>
  import { AreaChart } from '@milktop/svelte-ui'
  import { months, subjects } from './months.js'
</script>

<AreaChart data={months} x="month" series={subjects} stacked height={200} label="Lessons by subject, stacked" />
