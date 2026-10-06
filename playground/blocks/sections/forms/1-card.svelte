<!-- Card form
  A form in a card, with its actions in the footer. -->
<script>
  import { Card, Fields, Field, Select, Button } from '@milktop/svelte-ui'
  import { subjectItems } from '../../data.js'

  let student = $state({ name: '', email: '', year: 10, subject: null })
</script>

<Card heading="Add a student" description="They’ll get an email to set up their account." class="max-w-xl">
  <Fields>
    <Field label="Name" bind:value={student.name} />
    <Field span={8} label="Email" type="email" bind:value={student.email} />
    <Field span={4} label="Year" type="number" min={7} max={13} bind:value={student.year} />
    <Field label="Subject"><Select items={subjectItems} placeholder="Choose a subject" bind:value={student.subject} /></Field>
  </Fields>
  {#snippet footer()}<Button>Cancel</Button><Button variant="primary">Add student</Button>{/snippet}
</Card>
