<!-- Links
  With `href` it is an <a> that looks like a button, for navigation. `disabled`
  drops the href and sets aria-disabled. -->
<script>
  import { Button } from '@milktop/svelte-ui'
</script>

<Button variant="primary" icon="lucide:plus" href="#/card">Go to Card</Button>
<Button href="https://zagjs.com" target="_blank" rel="noopener" iconEnd="lucide:external-link">Zag docs</Button>
<Button variant="link" href="#/tabs">Tabs</Button>
<Button href="#/tabs" disabled>Disabled</Button>
