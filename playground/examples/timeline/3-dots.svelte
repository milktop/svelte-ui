<!-- Dots
  Without icons, small. -->
<script>
  import { Timeline } from '@milktop/svelte-ui'
  import { history } from './history.js'
</script>

<Timeline size="sm" items={history.map(({ icon, ...rest }) => rest)} />
