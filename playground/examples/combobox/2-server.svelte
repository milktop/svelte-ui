<!-- Server search
  `load` is an async function(query) returning items: here a fake API with a delay. It's debounced, shows "Loading…", and only the latest answer counts. -->
<script>
  import { Combobox } from '@milktop/svelte-ui'

  const all = ['Aberdeen', 'Bath', 'Belfast', 'Brighton', 'Bristol', 'Cambridge', 'Cardiff', 'Edinburgh', 'Glasgow', 'Leeds', 'Liverpool', 'London', 'Manchester', 'Norwich', 'Oxford', 'York']
    .map((name, id) => ({ id, name }))

  // Stands in for fetch(`/cities?q=${query}`).
  const search = (query) => new Promise((resolve) =>
    setTimeout(() => resolve(all.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)), 400))

  let cityId = $state(null)
</script>

<Combobox label="City" load={search} labelKey="name" valueKey="id" bind:value={cityId} placeholder="Search cities…" />
<p>{cityId ?? '—'}</p>
