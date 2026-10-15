<!-- As functions
  For strings: chart formats, aria-labels, toasts. `formatNumber`, `formatBytes` and `formatRelative` keep their Intl formatters, so they're cheap in lists. -->
<script>
  import { formatNumber, formatBytes, formatRelative, Button, toaster } from '@milktop/svelte-ui'

  const total = 1820
  function send() {
    toaster.success({
      title: `Invoice sent: ${formatNumber(total, { style: 'currency', currency: 'GBP' })}`,
      description: `${formatBytes(48200)} PDF, ${formatRelative(new Date(Date.now() - 90000))}`,
    })
  }
</script>

<Button icon="lucide:receipt" onclick={send}>Send an invoice</Button>
<code class="text-xs text-(--ui-muted)">formatNumber(1820, {'{'} style: 'currency', currency: 'GBP' {'}'}) → {formatNumber(1820, { style: 'currency', currency: 'GBP' })}</code>
