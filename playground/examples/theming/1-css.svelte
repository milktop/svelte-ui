<!-- Every instance: CSS on the parts
  Parts carry `data-scope` and `data-part` (and modifiers like `data-variant`), so your own CSS can restyle a component everywhere. Unlayered (or in a later layer), it beats the library's. Scoped to a class here, so only this box changes; in an app you'd drop the `.brand` prefix. -->
<script>
  import { Button, Checkbox, Progress } from '@milktop/svelte-ui'

  const css = `
.brand [data-scope=button][data-variant=primary] { background: linear-gradient(135deg, #7c3aed, #db2777); border: none; }
.brand [data-scope=checkbox][data-part=control] { border-radius: 9999px; }
.brand [data-scope=progress][data-part=range] { background: linear-gradient(90deg, #7c3aed, #db2777); }
`
  let agree = $state(true)
</script>

<div class="brand flex w-full flex-wrap items-center gap-4">
  {@html `<style>${css}</style>`}
  <Button variant="primary" icon="lucide:sparkles">Gradient primary</Button>
  <Checkbox label="Round boxes" bind:checked={agree} />
  <Progress value={64} label="Gradient bar" class="w-64" />
</div>
