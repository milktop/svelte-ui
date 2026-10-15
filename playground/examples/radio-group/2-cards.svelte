<!-- Cards
  `variant="cards"`: each option a card, with the item's `icon` and `description`; the chosen one outlined. -->
<script>
  import { RadioGroup } from '@milktop/svelte-ui'

  const kinds = [
    { value: 'consult', label: 'Consultation', description: '15 minutes, any vet', icon: 'lucide:stethoscope' },
    { value: 'vaccine', label: 'Vaccination', description: '15 minutes, a nurse', icon: 'lucide:syringe' },
    { value: 'surgery', label: 'Surgery', description: 'Half a day, a surgeon', icon: 'lucide:scissors' },
  ]
  let kind = $state('consult')
</script>

<RadioGroup label="Appointment" variant="cards" items={kinds} bind:value={kind} class="col-span-full" />
<p>kind: {JSON.stringify(kind)}</p>
