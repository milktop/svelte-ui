<!-- Divided, with markup values -->
<script>
  import { DataList, DataItem, Avatar, Badge } from '@milktop/svelte-ui'
</script>

<DataList variant="divided">
  <DataItem label="Student"><span class="flex items-center gap-2"><Avatar size="sm" name="Ada Lovelace" />Ada Lovelace</span></DataItem>
  <DataItem label="Status"><Badge variant="success">Active</Badge></DataItem>
  <DataItem label="Next lesson">Thursday 8 October, 16:00</DataItem>
  <DataItem label="Notes" info="Only tutors see these">Prefers worked examples; revise fractions before the mock exam.</DataItem>
</DataList>
