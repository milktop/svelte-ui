<!-- The chosen item, drawn your way
  The `item` snippet draws the options; `chosen` draws the chosen one in the box (and each tag, picking several). A searchable box holds typed text, so there the `start` snippet shows something before it, given the chosen item. -->
<script>
  import { Select, Avatar, Badge } from '@milktop/svelte-ui'

  const vets = [
    { id: 1, name: 'Dr Jones', role: 'Small animals', status: 'online' },
    { id: 2, name: 'Dr Patel', role: 'Surgery', status: 'busy' },
    { id: 3, name: 'Dr Okafor', role: 'Exotics', status: 'away' },
    { id: 4, name: 'Nurse Kim', role: 'Vaccinations', status: 'online' },
  ]
  const priorities = [
    { value: 'high', label: 'High', icon: 'lucide:chevrons-up', color: 'text-red-500' },
    { value: 'normal', label: 'Normal', icon: 'lucide:equal', color: 'text-amber-500' },
    { value: 'low', label: 'Low', icon: 'lucide:chevrons-down', color: 'text-sky-500' },
  ]
  const short = (vet) => vet.name.replace(/^(Dr|Nurse) /, '')

  let vet = $state(2)
  let team = $state([1, 4])
  let searched = $state(1)
  let priority = $state('high')
</script>

{#snippet person(vet, withRole = false)}
  <span class="flex min-w-0 items-center gap-2">
    <Avatar size={20} name={short(vet)} color="auto" status={vet.status} />
    <span class="truncate">{vet.name}</span>
    {#if withRole}<span class="truncate text-xs text-(--ui-muted)">{vet.role}</span>{/if}
  </span>
{/snippet}
{#snippet personWithRole(vet)}{@render person(vet, true)}{/snippet}
{#snippet icon(p)}<iconify-icon icon={p.icon} class={p.color}></iconify-icon>{/snippet}

<Select label="Vet" items={vets} labelKey="name" valueKey="id" bind:value={vet} item={personWithRole} chosen={person} />
<Select label="Team" items={vets} labelKey="name" valueKey="id" multiple tags bind:value={team} item={personWithRole} chosen={person} />
<Select label="Vet (searchable)" items={vets} labelKey="name" valueKey="id" searchable bind:value={searched} item={personWithRole}>
  {#snippet start(v)}{#if v}<Avatar size={20} name={short(v)} color="auto" />{:else}<iconify-icon icon="lucide:search"></iconify-icon>{/if}{/snippet}
</Select>
<Select label="Priority" items={priorities} bind:value={priority}>
  {#snippet start(p)}{#if p}{@render icon(p)}{/if}{/snippet}
  {#snippet item(p)}<span class="flex items-center gap-2">{@render icon(p)}{p.label}</span>{/snippet}
</Select>
<p>{JSON.stringify({ vet, team, searched, priority })} <Badge size="sm">start = before, chosen = instead</Badge></p>
