<!-- Waits for the work
  With `onConfirm`, the button spins while it runs and the dialog closes when it's done. If it throws, the dialog stays open with the error: this one fails the first time, so try twice. -->
<script>
  import { confirm, Button, toaster } from '@milktop/svelte-ui'

  let tries = 0
  async function send() {
    const sent = await confirm({
      heading: 'Send 3 invoices?', description: 'Parents get them by email straight away.', confirmLabel: 'Send',
      onConfirm: async () => {
        await new Promise((done) => setTimeout(done, 900))
        if (tries++ === 0) throw new Error('The mail server didn’t answer. Try again.')
      },
    })
    if (sent) toaster.success({ title: 'Invoices sent' })
  }
</script>

<Button variant="primary" icon="lucide:send" onclick={send}>Send invoices</Button>
