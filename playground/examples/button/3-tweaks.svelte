<!-- Tweaks
  `class` for the button, `classes` for its parts, and a token for one instance. -->
<script>
  import { Button } from '@milktop/svelte-ui'
</script>

<Button variant="soft" class="px-8">Wider</Button>
<Button variant="primary" style="--ui-accent: #db2777">Pink accent</Button>
<Button icon="lucide:heart" classes={{ icon: 'text-pink-500' }}>Pink icon</Button>
<Button round icon="lucide:mail" count={5} classes={{ badge: 'bg-emerald-600' }} aria-label="Mail" />
