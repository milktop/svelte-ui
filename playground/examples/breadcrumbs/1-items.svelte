<!-- From items
  The last item is the current page; items without a link show as plain text. -->
<script>
  import { Breadcrumbs } from '@milktop/svelte-ui'
</script>

<Breadcrumbs items={[{ label: 'Home', href: '#/' }, { label: 'Students', href: '#/breadcrumbs' }, { label: 'Ada Lovelace' }]} />
