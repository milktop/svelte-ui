<!-- One part: `class` and `classes`
  `class` goes on the component's outer element; `classes` on its parts, by camelCased part name. The library's CSS sits in `@layer ui`, so these Tailwind classes win without `!important`. -->
<script>
  import { Checkbox, Select, Tabs, Tab, Badge } from '@milktop/svelte-ui'

  const subjects = ['Maths', 'English', 'Physics']
  let agree = $state(true)
  let subject = $state('Maths')
</script>

<Badge class="tracking-wider uppercase">Root only</Badge>
<Checkbox label="Round tick box" bind:checked={agree} classes={{ control: 'rounded-full', label: 'font-semibold' }} />
<Select items={subjects} bind:value={subject} class="w-48" classes={{ trigger: 'rounded-full', content: 'rounded-xl', item: 'font-medium' }} />
<Tabs variant="pills" class="w-full" classes={{ trigger: 'uppercase text-xs tracking-wide', content: 'pt-4 text-sm' }}>
  <Tab value="notes" label="Notes">Pills with uppercase triggers.</Tab>
  <Tab value="files" label="Files">The panel padding is ours too.</Tab>
</Tabs>
