<!-- Native select
  The browser's own select (the phone's own picker), styled like the other inputs; `group` sorts items under headings. -->
<script>
  import { NativeSelect, Field } from '@milktop/svelte-ui'

  const species = [
    { value: 'dog', label: 'Dog', group: 'Mammals' }, { value: 'cat', label: 'Cat', group: 'Mammals' }, { value: 'rabbit', label: 'Rabbit', group: 'Mammals' },
    { value: 'parrot', label: 'Parrot', group: 'Birds' }, { value: 'tortoise', label: 'Tortoise', group: 'Reptiles' },
  ]
  let value = $state(null)
  let size = $state('Medium')
</script>

<NativeSelect label="Species" items={species} placeholder="Choose…" bind:value />
<Field label="Size" hint="In a Field">
  <NativeSelect items={['Small', 'Medium', 'Large']} bind:value={size} />
</Field>
<p>value: {JSON.stringify(value)}</p>
