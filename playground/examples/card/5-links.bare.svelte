<!-- As links
  With `href` the whole card is a link: it lifts on hover. `size` sets the padding. -->
<script>
  import { Card } from '@milktop/svelte-ui'

  const links = [
    { icon: 'lucide:users', heading: 'Students', description: '31 active, 3 new this month', href: '#/card' },
    { icon: 'lucide:calendar', heading: 'Calendar', description: '14 lessons this week', href: '#/card' },
    { icon: 'lucide:wallet', heading: 'Billing', description: '£320 outstanding', href: '#/card' },
  ]
</script>

<div class="grid w-full grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
  {#each links as link}<Card size="sm" {...link} />{/each}
</div>
