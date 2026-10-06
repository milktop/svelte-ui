<!-- Area, several series -->
<script>
  import { AreaChart } from '@milktop/svelte-ui'
  import { months, subjects } from './months.js'
</script>

<AreaChart data={months} x="month" series={subjects} label="Lessons by subject" />
