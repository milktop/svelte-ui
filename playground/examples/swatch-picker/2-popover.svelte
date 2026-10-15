<!-- In a popover, or a Select
  `variant="popover"`: a field showing the chosen colour, opening the swatches (it closes once one's chosen); it works in a Field like the other inputs. Or our Select: the `item` snippet draws the options, `chosen` the chosen one, and `start` puts the dot before a searchable box. -->
<script>
  import { SwatchPicker, Select, Field, swatches } from '@milktop/svelte-ui'

  const names = ['teal', 'violet', 'amber', 'rose', 'sky', 'emerald']
  let vet = $state('teal')
  let room = $state(null)
  let team = $state('violet')
</script>

{#snippet dot(name)}<span class="inline-block size-3 shrink-0 rounded-full" style:background={swatches[name]}></span>{/snippet}
{#snippet colour(name)}<span class="flex items-center gap-2">{@render dot(name)}<span class="capitalize">{name}</span></span>{/snippet}

<SwatchPicker variant="popover" label="Dr Jones's colour" bind:value={vet} />
<Field label="Room colour" hint="In a Field, with a placeholder">
  <SwatchPicker variant="popover" items={names} bind:value={room} />
</Field>
<!-- `item` draws the options; `chosen` the chosen one in the box. -->
<Select label="Team colour (a Select)" items={names} bind:value={team} item={colour} chosen={colour} />
<!-- Searchable: the box is typed text, so the dot goes in `start`. -->
<Select label="Searchable, with start" items={names} searchable bind:value={team} item={colour}>
  {#snippet start(name)}{#if name}{@render dot(name)}{:else}<iconify-icon icon="lucide:palette"></iconify-icon>{/if}{/snippet}
</Select>
<p>{JSON.stringify({ vet, room, team })}</p>
