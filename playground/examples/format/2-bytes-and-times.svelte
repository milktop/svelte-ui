<!-- Sizes and times
  `FormatBytes` ('2.4 MB'; `binary` for MiB), and `FormatRelative` ('2 hours ago'), which keeps itself up to date and shows the full date on hover. -->
<script>
  import { FormatBytes, FormatRelative, DataList, DataItem } from '@milktop/svelte-ui'

  const ago = (minutes) => new Date(Date.now() - minutes * 60000)
</script>

<DataList class="w-full max-w-md" labelWidth="9rem">
  <DataItem label="A photo"><FormatBytes value={910000} /></DataItem>
  <DataItem label="Slides"><FormatBytes value={2516582} /></DataItem>
  <DataItem label="Binary"><FormatBytes value={2516582} binary /></DataItem>
  <DataItem label="Just now"><FormatRelative value={ago(0.2)} /></DataItem>
  <DataItem label="Earlier"><FormatRelative value={ago(125)} /></DataItem>
  <DataItem label="Yesterday"><FormatRelative value={ago(60 * 26)} /></DataItem>
  <DataItem label="Next week"><FormatRelative value={new Date(Date.now() + 8 * 86400000)} /></DataItem>
</DataList>
