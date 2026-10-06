<!-- Checkboxes
  `bind:checked`, with the label as text or children; 'indeterminate' shows a dash. -->
<script>
  import { Fields, Field, Checkbox } from '@milktop/svelte-ui'

  let agreed = $state(false)
</script>

<Fields class="w-full">
  <Field span={12} hint="agreed: {agreed}">
    <div class="flex flex-col gap-3">
      <Checkbox bind:checked={agreed}>I agree to the <a href="#/checkbox">terms</a></Checkbox>
      <Checkbox label="Indeterminate" checked="indeterminate" />
      <Checkbox label="Disabled" disabled />
    </div>
  </Field>
</Fields>
