<!-- As markup
  DataItem takes the same fields, with the value inside, so it can be any markup. -->
<script>
  import { DataList, DataItem } from '@milktop/svelte-ui'
</script>

<DataList>
  <DataItem label="Name">Ada Lovelace</DataItem>
  <DataItem label="Email"><a href="mailto:ada@example.com" class="text-(--ui-accent) underline underline-offset-2">ada@example.com</a></DataItem>
  <DataItem label="Year" info="School year from September">11</DataItem>
</DataList>
