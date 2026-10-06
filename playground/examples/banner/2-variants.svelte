<!-- Variants -->
<script>
  import { Banner } from '@milktop/svelte-ui'
</script>

<div class="flex w-full flex-col gap-2">
  <Banner icon="lucide:megaphone">Accent: the default, for news.</Banner>
  <Banner variant="soft" icon="lucide:info">Soft: quieter, for tips.</Banner>
  <Banner variant="neutral" icon="lucide:calendar">Neutral: half term starts on 26 October.</Banner>
  <Banner variant="success" icon="lucide:circle-check">Success: your calendar is connected.</Banner>
  <Banner variant="warning" icon="lucide:triangle-alert">Warning: your card expires this month.</Banner>
  <Banner variant="danger" icon="lucide:circle-x">Danger: payouts are paused until you add your bank details.</Banner>
</div>
