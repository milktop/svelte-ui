<!-- One at a time
  Click the open item to close it again; the last item is disabled. -->
<script>
  import { Accordion, AccordionItem } from '@milktop/svelte-ui'

  let faq = $state('pricing')
</script>

<Accordion bind:value={faq}>
  <AccordionItem value="pricing" heading="How much are lessons?">Lessons are £40 an hour, or £35 when you book a block of ten.</AccordionItem>
  <AccordionItem value="cancel" heading="Can I cancel a lesson?">Yes, free of charge up to 24 hours before it starts.</AccordionItem>
  <AccordionItem value="online" heading="Do you teach online?">Most tutors teach both online and in person; check their profile.</AccordionItem>
  <AccordionItem value="exams" heading="Exam preparation" disabled>Available from January.</AccordionItem>
</Accordion>
<p class="m-0 w-full text-sm text-(--ui-muted)">faq: {JSON.stringify(faq)}</p>
