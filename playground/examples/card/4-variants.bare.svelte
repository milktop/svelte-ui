<!-- Variants
  'default' (bordered), 'elevated' (lifted), 'outline' (no fill) and 'subtle' (a tinted panel). -->
<script>
  import { Card } from '@milktop/svelte-ui'

  const variants = [
    ['default', 'A bordered surface, for most things.'],
    ['elevated', 'Lifted by a shadow, for what should stand out.'],
    ['outline', 'Just a border, quiet on the canvas.'],
    ['subtle', 'A tinted fill, for a panel inside a page or card.'],
  ]
</script>

<div class="grid w-full grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
  {#each variants as [variant, text]}
    <Card {variant} heading={variant[0].toUpperCase() + variant.slice(1)}><p class="m-0 text-(--ui-muted)">{text}</p></Card>
  {/each}
</div>
