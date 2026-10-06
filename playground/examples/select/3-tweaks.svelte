<!-- Tweaks
  `classes` reaches into the trigger and the list. -->
<script>
  import { Select } from '@milktop/svelte-ui'
</script>

<Select label="Colour" items={['Pink', 'Teal', 'Amber']} value="Pink"
  classes={{ trigger: 'rounded-full border-pink-300', item: 'rounded-full', itemIndicator: 'text-pink-600' }} />
