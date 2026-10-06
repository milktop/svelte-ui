<!-- Variants -->
<script>
  import { Alert } from '@milktop/svelte-ui'
</script>

<div class="flex w-full flex-col gap-3">
  <Alert heading="Lessons resume on Monday">Half term runs from 26 to 30 October.</Alert>
  <Alert variant="success" heading="Payment received">Thanks, invoice #1042 is paid.</Alert>
  <Alert variant="warning" heading="Two lessons overlap">Ada has another lesson at 16:30 on Thursday.</Alert>
  <Alert variant="danger" heading="Card declined">Update your payment details to keep booking.</Alert>
</div>
