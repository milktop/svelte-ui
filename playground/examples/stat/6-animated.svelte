<!-- Live, rolling
  A number `value` is formatted (`format`: Intl's options); `animate` rolls its digits when it changes. -->
<script>
  import { Stats, Stat } from '@milktop/svelte-ui'

  let today = $state(23)
  let revenue = $state(1820)
  // New bookings and payments every few seconds.
  $effect(() => {
    const timer = setInterval(() => {
      today++
      revenue += 40 * Math.ceil(Math.random() * 3)
    }, 2500)
    return () => clearInterval(timer)
  })
</script>

<Stats columns={2}>
  <Stat label="Appointments today" value={today} animate />
  <Stat label="Taken this month" value={revenue} animate format={{ style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }} change={8.4} />
</Stats>
