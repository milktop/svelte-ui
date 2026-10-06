<!-- Several open
  `multiple`: the value is an array. -->
<script>
  import { Accordion, AccordionItem, Button } from '@milktop/svelte-ui'

  let open = $state(['notes'])
</script>

<Accordion multiple bind:value={open}>
  <AccordionItem value="notes" heading="Lesson notes">Covered fractions and decimals; homework is worksheet 4.</AccordionItem>
  <AccordionItem value="goals" heading="Goals">Grade 7 in the summer exam.</AccordionItem>
  <AccordionItem value="contact" heading="Parent contact">Grace Hopper, grace@example.com</AccordionItem>
</Accordion>
<p class="m-0 flex w-full items-center gap-3 text-sm text-(--ui-muted)">open: {JSON.stringify(open)}
  <Button size="sm" onclick={() => (open = ['notes', 'goals', 'contact'])}>Open all</Button>
  <Button size="sm" onclick={() => (open = [])}>Close all</Button></p>
