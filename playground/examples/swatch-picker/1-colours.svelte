<!-- Colours
  Tailwind's colours by name (or your own `{ value, color }`); `swatches[name]` gives the CSS colour, e.g. for a vet's calendar colour. -->
<script>
  import { SwatchPicker, swatches, Avatar } from '@milktop/svelte-ui'

  let color = $state('teal')
  let few = $state('brand')
</script>

<SwatchPicker label="Calendar colour" bind:value={color} class="col-span-full" />
<SwatchPicker label="A few" size="sm" items={['teal', 'violet', 'amber', 'rose', { value: 'brand', color: '#0f172a', label: 'Brand' }]} bind:value={few} />
<div class="col-span-full flex items-center gap-2 text-sm text-(--ui-muted)">color: {JSON.stringify(color)}
  {#if color}<span class="inline-block size-4 rounded-full" style:background={swatches[color]}></span>{/if}
  <Avatar size="sm" name="Dr Jones" style="background: {color ? swatches[color] : ''}; color: white" />
</div>
