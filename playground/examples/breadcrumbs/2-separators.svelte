<!-- Icons and separators -->
<script>
  import { Breadcrumbs } from '@milktop/svelte-ui'
  import { lesson } from './lesson.js'
</script>

<div class="flex w-full flex-col gap-3">
  <Breadcrumbs items={lesson.slice(0, 3)} />
  <Breadcrumbs separator="/" items={lesson.slice(0, 3)} />
  <Breadcrumbs separator="·" items={lesson.slice(1, 4)} />
</div>
