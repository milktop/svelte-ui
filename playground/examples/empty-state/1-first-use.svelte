<!-- First use -->
<script>
  import { EmptyState, Button } from '@milktop/svelte-ui'
</script>

<EmptyState icon="lucide:calendar-plus" heading="No lessons yet"
  description="Book your first lesson to see it here, or share your booking link with a student.">
  <Button variant="primary" icon="lucide:plus">Book a lesson</Button>
  <Button icon="lucide:link">Copy booking link</Button>
</EmptyState>
