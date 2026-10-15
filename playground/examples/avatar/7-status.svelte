<!-- Status
  `status`: a dot on the corner, 'online', 'away', 'busy', 'offline' or any CSS colour. -->
<script>
  import { Avatar } from '@milktop/svelte-ui'
</script>

<Avatar name="Ada Lovelace" src="https://i.pravatar.cc/120?img=47" status="online" />
<Avatar name="Alan Turing" status="away" />
<Avatar name="Grace Hopper" size="lg" status="busy" statusLabel="In surgery" />
<Avatar name="Tim Berners-Lee" size="sm" status="offline" />
