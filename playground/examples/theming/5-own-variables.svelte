<!-- A component's own variables
  Some components read variables of their own, for things no shared token covers: Button's `--ui-button-count-bg` and `--ui-button-count-text`, AvatarGroup's `--ui-avatar-ring`. Each page's Styling panel lists them. Set them like tokens: on the component or any element around it. -->
<script>
  import { Button, AvatarGroup } from '@milktop/svelte-ui'
</script>

<Button icon="lucide:inbox" count={12} class="[--ui-button-count-bg:#0f172a] [--ui-button-count-text:#fde047]">Inbox</Button>
<AvatarGroup items={['Ada Lovelace', 'Alan Turing', 'Grace Hopper']} class="[--ui-avatar-ring:var(--ui-accent-soft)]" />
