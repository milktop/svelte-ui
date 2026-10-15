<!-- One locale for the app
  `uiLocale.set(…)` sets the locale for everything: formatting, DatePicker, Progress, the charts, EventCalendar… (each can still take its own `locale`). Switch it here: it changes the whole playground, as the Appearance panel's Language does. -->
<script>
  import { uiLocale, FormatNumber, FormatRelative, FormatBytes, DatePicker, Progress, Segmented, Stat } from '@milktop/svelte-ui'

  const locales = [{ value: 'en-GB', label: 'English (UK)' }, { value: 'en-US', label: 'English (US)' }, { value: 'fr-FR', label: 'Français' }, { value: 'de-DE', label: 'Deutsch' }]
  let date = $state('2026-10-11')
</script>

<div class="flex w-full flex-col gap-5">
  <Segmented size="sm" items={locales} bind:value={() => uiLocale.locale, (next) => next && uiLocale.set(next)} />
  <div class="grid gap-5 sm:grid-cols-2">
    <div class="flex flex-col gap-1 text-sm">
      <span><FormatNumber value={1820.5} format={{ style: 'currency', currency: 'EUR' }} /></span>
      <span><FormatNumber value={1234567.891} /></span>
      <span><FormatBytes value={2516582} /></span>
      <span><FormatRelative value={new Date(Date.now() - 3 * 3600000)} /></span>
    </div>
    <Stat label="Revenue" value={18200} format={{ style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }} change={12.5} />
    <DatePicker label="Date" bind:value={date} />
    <Progress value={64} label="Progress" showValue />
  </div>
</div>
