<!-- With an avatar
  A person or account: avatar, name, status and actions. -->
<script>
  import { Avatar, Badge, Button } from '@milktop/svelte-ui'
</script>

<div class="flex flex-wrap items-center justify-between gap-4">
  <div class="flex items-center gap-4">
    <Avatar size="xl" name="Grace Hopper" />
    <div>
      <h1 class="m-0 text-2xl font-bold">Grace Hopper</h1>
      <div class="mt-1 flex items-center gap-2 text-sm text-(--ui-muted)"><Badge variant="accent">Tutor</Badge>Maths and physics · since 2019</div>
    </div>
  </div>
  <div class="flex gap-2">
    <Button icon="lucide:share-2">Share profile</Button>
    <Button variant="primary">Edit profile</Button>
  </div>
</div>
