<!-- Checkboxes
  `bind:checked`, with the label as text or children; 'indeterminate' shows a dash. -->
<script>
  import { Checkbox } from '@milktop/svelte-ui'

  let agreed = $state(false)
</script>

<Checkbox bind:checked={agreed}>I agree to the <a href="#/checkbox">terms</a></Checkbox>
<Checkbox label="Indeterminate" checked="indeterminate" />
<Checkbox label="Disabled" disabled />
<p>agreed: {agreed}</p>
