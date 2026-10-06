<!-- Every input in a Field
  Each control picks up its Field's label, hint and error. Submit to see the errors. -->
<script>
  import { Fields, Field, Input, Textarea, NumberInput, PasswordInput, Select, DatePicker, TagsInput,
    Segmented, RadioGroup, CheckboxGroup, Slider, PinInput, Switch, FileUpload, Button } from '@milktop/svelte-ui'

  let form = $state({
    name: '', password: '', level: null, date: null, rate: null, subjects: [], topics: [], cadence: null,
    code: '', plan: null, days: [], confidence: 50, notes: '', files: [], reminders: false,
  })
  let errors = $state({})

  function check(e) {
    e.preventDefault()
    const filled = (value) => (Array.isArray(value) ? value.length > 0 : !!value)
    errors = Object.fromEntries(['name', 'level', 'date', 'subjects'].map((key) => [key, filled(form[key]) ? null : 'Required']))
  }
</script>

<form onsubmit={check} class="w-full">
  <Fields>
    <Field label="Name" span={6} error={errors.name}><Input bind:value={form.name} /></Field>
    <Field label="Password" span={6}><PasswordInput bind:value={form.password} /></Field>
    <Field label="Level" span={4} error={errors.level}><Select items={['GCSE', 'A Level']} bind:value={form.level} /></Field>
    <Field label="Start date" span={4} error={errors.date}><DatePicker bind:value={form.date} /></Field>
    <Field label="Rate" span={4}><NumberInput bind:value={form.rate} prefix="£" /></Field>
    <Field label="Subjects" span={6} error={errors.subjects}><Select items={['Maths', 'Physics', 'Chemistry']} searchable multiple bind:value={form.subjects} /></Field>
    <Field label="Topics" span={6} hint="Enter to add"><TagsInput bind:value={form.topics} /></Field>
    <Field label="Sessions" span={6}><Segmented items={['Weekly', 'Fortnightly']} bind:value={form.cadence} /></Field>
    <Field label="Code" span={6}><PinInput count={4} bind:value={form.code} /></Field>
    <Field label="Plan" span={6}><RadioGroup items={['Pay as you go', 'Termly']} bind:value={form.plan} /></Field>
    <Field label="Days" span={6}><CheckboxGroup orientation="horizontal" items={['Mon', 'Wed', 'Fri']} bind:value={form.days} /></Field>
    <Field label="Confidence" span={12}><Slider bind:value={form.confidence} /></Field>
    <Field label="Notes" span={12}><Textarea bind:value={form.notes} /></Field>
    <Field label="Worksheet" span={12}><FileUpload bind:files={form.files} /></Field>
    <Field span={12}><Switch bind:checked={form.reminders}>Email reminders</Switch></Field>
  </Fields>
  <div class="mt-5 flex justify-end"><Button type="submit" variant="primary">Save</Button></div>
</form>
