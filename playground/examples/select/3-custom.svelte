<!-- Custom items and parts
  The `item` snippet renders each option; `classes` reaches into the trigger and the list. -->
<script>
  import { Fields, Field, Select } from '@milktop/svelte-ui'

  const students = [
    { id: 1, name: 'Ada Lovelace', level: 'A Level' },
    { id: 2, name: 'Alan Turing', level: 'GCSE' },
  ]
</script>

<Fields class="w-full">
  <Field label="Student" span={6}>
    <Select items={students} labelKey="name" valueKey="id" value={1}>
      {#snippet item(student)}
        <span class="flex flex-col"><span>{student.name}</span><span class="text-xs text-(--ui-muted)">{student.level}</span></span>
      {/snippet}
    </Select>
  </Field>
  <Field label="Colour" span={6}>
    <Select items={['Pink', 'Teal', 'Amber']} value="Pink" classes={{ trigger: 'rounded-full border-pink-300', item: 'rounded-full', itemIndicator: 'text-pink-600' }} />
  </Field>
</Fields>
