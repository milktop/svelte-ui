<!-- Cards and chips
  CheckboxGroup's `variant="cards"` (with `icon` and `description`) and `variant="chips"`: pills that toggle, e.g. quick filters above a table. -->
<script>
  import { CheckboxGroup } from '@milktop/svelte-ui'

  const extras = [
    { value: 'reminder', label: 'Text reminder', description: 'The day before', icon: 'lucide:message-square' },
    { value: 'invoice', label: 'Email the invoice', description: 'After the visit', icon: 'lucide:receipt' },
  ]
  const species = ['Dogs', 'Cats', 'Rabbits', 'Birds', 'Reptiles']
  let chosen = $state(['reminder'])
  let filters = $state(['Dogs', 'Cats'])
</script>

<CheckboxGroup label="Extras" variant="cards" items={extras} bind:value={chosen} class="col-span-full" />
<CheckboxGroup label="Show" variant="chips" items={species} bind:value={filters} class="col-span-full" />
<p>{JSON.stringify({ chosen, filters })}</p>
