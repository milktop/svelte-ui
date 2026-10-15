<!-- Ask, then act
  `confirm()` returns a promise of true or false, so the code reads in order: no open state, no dialog in your markup. -->
<script>
  import { confirm, Button } from '@milktop/svelte-ui'

  let archived = $state(false)
  async function archive() {
    if (await confirm({ heading: 'Archive Ada Lovelace?', description: 'She’ll leave your lists; you can bring her back.', confirmLabel: 'Archive' })) {
      archived = true
    }
  }
</script>

<Button icon="lucide:archive" onclick={archive} disabled={archived}>{archived ? 'Archived' : 'Archive student'}</Button>
{#if archived}<Button variant="link" onclick={() => (archived = false)}>Undo</Button>{/if}
