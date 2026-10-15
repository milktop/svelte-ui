<!-- Lines, labels and toolbars
  Across with an optional `label` (`align`), `variant` dashed or dotted, or `orientation="vertical"` between toolbar buttons. -->
<script>
  import { Divider, Button } from '@milktop/svelte-ui'
</script>

<div class="flex w-full flex-col">
  <p class="m-0 text-sm">Above</p>
  <Divider />
  <p class="m-0 text-sm">Below</p>
  <Divider label="or" />
  <Divider label="Today" align="start" variant="dashed" />
  <Divider label="Earlier" align="end" variant="dotted" />
  <div class="mt-2 flex items-center">
    <Button size="sm" variant="ghost" icon="lucide:bold" aria-label="Bold" />
    <Button size="sm" variant="ghost" icon="lucide:italic" aria-label="Italic" />
    <Divider orientation="vertical" />
    <Button size="sm" variant="ghost" icon="lucide:link" aria-label="Link" />
  </div>
</div>
