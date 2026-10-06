<!-- Bar -->
<script>
  import { Progress, Button } from '@milktop/svelte-ui'

  let value = $state(40)
  let uploading = $state(false)

  async function upload() {
    uploading = true
    value = 0
    while (value < 100) {
      await new Promise((resolve) => setTimeout(resolve, 120))
      value = Math.min(100, value + 7)
    }
    uploading = false
  }
</script>

<Progress label="Course completion" showValue {value} />
<div class="flex gap-2">
  <Button size="sm" onclick={() => (value = Math.max(0, value - 10))}>−10</Button>
  <Button size="sm" onclick={() => (value = Math.min(100, value + 10))}>+10</Button>
  <Button size="sm" onclick={upload} loading={uploading}>Simulate upload</Button>
</div>
