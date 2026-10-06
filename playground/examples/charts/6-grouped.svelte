<!-- Grouped and stacked bars -->
<script>
  import { BarChart } from '@milktop/svelte-ui'
  import { months, subjects } from './months.js'
</script>

<div class="flex w-full flex-col gap-6">
  <BarChart data={months} x="month" series={subjects} height={220} label="Lessons by subject" />
  <BarChart data={months} x="month" series={subjects} stacked height={220} label="Lessons by subject, stacked" />
</div>
