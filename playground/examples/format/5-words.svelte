<!-- The components' words
  `uiLocale` picks their words too: placeholders, empty states, summaries and screen-reader labels, in English or French (built in). Its second argument changes any of them, here the table's empty text; a prop given straight to a component still wins. -->
<script>
  import {
    uiLocale, Attachments, CopyButton, Pagination, PasswordInput, Segmented, Select, SwatchPicker, Table, TagsInput, confirm, Button,
  } from '@milktop/svelte-ui'

  const locales = [{ value: 'en-GB', label: 'English' }, { value: 'fr-FR', label: 'Français' }]
  const vets = [{ value: 1, label: 'Dr Martin' }, { value: 2, label: 'Dr Dubois' }]
  const pick = (locale) => locale && uiLocale.set(locale, { table: { empty: locale === 'fr-FR' ? 'Aucun patient' : 'No patients yet' } })
</script>

<div class="flex w-full flex-col gap-5">
  <Segmented size="sm" items={locales} bind:value={() => (uiLocale.locale.startsWith('fr') ? 'fr-FR' : 'en-GB'), pick} />
  <div class="grid gap-5 sm:grid-cols-2">
    <Select label="Vet" items={vets} />
    <Select label="Vet (searchable)" items={vets} searchable />
    <TagsInput label="Tags" />
    <PasswordInput label="Password" />
    <SwatchPicker label="Colour" variant="popover" />
    <div class="flex items-end gap-2">
      <CopyButton value="ABC-123" />
      <Button onclick={() => confirm({ heading: 'Archive?', typeToConfirm: 'Rex' })}>confirm()</Button>
    </div>
    <div class="sm:col-span-2"><Attachments maxFiles={3} addable removable /></div>
    <div class="sm:col-span-2"><Table columns={[{ key: 'name', label: 'Name' }]} rows={[]} /></div>
    <div class="sm:col-span-2"><Pagination count={95} summary /></div>
  </div>
</div>
