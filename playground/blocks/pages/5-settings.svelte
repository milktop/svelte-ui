<!-- Settings
  Sections with a title and description beside their fields, and a bar to save or discard changes. -->
<script>
  import { Card, Fields, Field, Textarea, Segmented, Switch, Button } from '@milktop/svelte-ui'

  let saved = $state({ name: 'Grace Hopper', email: 'grace@example.com', bio: 'Maths and physics tutor, GCSE and A level.', lessonLength: 60, reminders: true, digest: false, marketing: false })
  let form = $state({ ...saved })
  const lengths = [{ value: 45, label: '45 min' }, { value: 60, label: '60 min' }, { value: 90, label: '90 min' }]
  const dirty = $derived(JSON.stringify(form) !== JSON.stringify(saved))
</script>

{#snippet about(heading, text)}
  <div class="flex-[1_1_14rem]"><h3 class="m-0 text-base font-semibold">{heading}</h3><p class="mt-1 mb-0 text-sm text-(--ui-muted)">{text}</p></div>
{/snippet}

<div class="flex flex-col gap-8">
  <div>
    <h2 class="m-0 text-xl font-bold">Settings</h2>
    <p class="mt-1 mb-0 text-sm text-(--ui-muted)">Your profile, lesson defaults and notifications.</p>
  </div>
  <!-- Title beside the fields when there's room, above them when not. -->
  <div class="flex flex-wrap gap-x-8 gap-y-4">
    {@render about('Profile', 'How students and parents see you.')}
    <Card class="min-w-0 flex-[2_1_24rem]">
      <Fields>
        <Field span={6} label="Name" bind:value={form.name} />
        <Field span={6} label="Email" type="email" bind:value={form.email} />
        <Field label="Bio" hint="Shown on your booking page."><Textarea bind:value={form.bio} /></Field>
      </Fields>
    </Card>
  </div>
  <div class="flex flex-wrap gap-x-8 gap-y-4">
    {@render about('Lessons', 'Defaults for new bookings.')}
    <Card class="min-w-0 flex-[2_1_24rem]">
      <Fields><Field label="Default length"><Segmented items={lengths} bind:value={form.lessonLength} /></Field></Fields>
    </Card>
  </div>
  <div class="flex flex-wrap gap-x-8 gap-y-4">
    {@render about('Notifications', 'What we email you about.')}
    <Card class="min-w-0 flex-[2_1_24rem]">
      <div class="flex flex-col gap-4">
        <Switch label="Lesson reminders, the day before" bind:checked={form.reminders} />
        <Switch label="A weekly summary" bind:checked={form.digest} />
        <Switch label="News and offers" bind:checked={form.marketing} />
      </div>
    </Card>
  </div>
  <div class="flex flex-wrap items-center justify-end gap-2">
    {#if dirty}<span class="mr-auto text-sm text-(--ui-muted)">You have unsaved changes</span>{/if}
    <Button disabled={!dirty} onclick={() => (form = { ...saved })}>Discard</Button>
    <Button variant="primary" disabled={!dirty} onclick={() => (saved = { ...form })}>Save changes</Button>
  </div>
</div>
