<!-- Numbers
  `FormatNumber` takes Intl.NumberFormat's options as `format`; the raw number stays in a <data> element. -->
<script>
  import { FormatNumber, DataList, DataItem } from '@milktop/svelte-ui'
</script>

<DataList class="w-full max-w-md" labelWidth="9rem">
  <DataItem label="Plain"><FormatNumber value={1820.5} /></DataItem>
  <DataItem label="Currency"><FormatNumber value={1820} format={{ style: 'currency', currency: 'GBP' }} /></DataItem>
  <DataItem label="No pence"><FormatNumber value={1820} format={{ style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }} /></DataItem>
  <DataItem label="Percent"><FormatNumber value={0.125} format={{ style: 'percent' }} /></DataItem>
  <DataItem label="Unit"><FormatNumber value={48.5} format={{ style: 'unit', unit: 'hour', unitDisplay: 'long' }} /></DataItem>
  <DataItem label="Compact"><FormatNumber value={12400} format={{ notation: 'compact' }} /></DataItem>
  <DataItem label="Change"><FormatNumber value={0.069} format={{ style: 'percent', signDisplay: 'always', maximumFractionDigits: 1 }} /></DataItem>
</DataList>
