<!-- Order, light and dark only, labels
  `options` sets which schemes show and their order; `system={false}` leaves out System; `labels` and `label` rename them. -->
<script>
  import { ThemeToggle } from '@milktop/svelte-ui'
</script>

<ThemeToggle options={['light', 'dark', 'system']} />
<ThemeToggle system={false} />
<ThemeToggle labels={{ light: 'Clair', dark: 'Sombre', system: 'Système' }} label="Thème" />
