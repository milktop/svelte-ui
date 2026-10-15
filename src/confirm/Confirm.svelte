<!--
  confirm(): asks before doing something, from anywhere. A dialog you
  `await` for a yes or no, with no state to keep and nothing to put in the
  layout. Resolves true when confirmed, false when cancelled (Cancel, Escape
  or the close button). Calls made while one is open wait their turn.

  if (await confirm({ heading: 'Archive Ada?', confirmLabel: 'Archive' })) archive(ada)
  await confirm({ heading: 'Delete Ada?', danger: true, typeToConfirm: 'Ada Lovelace', onConfirm: () => api.delete(ada.id) })

  This component is the dialog it shows; call confirm() rather than using it.
  confirm()'s options:
  - `heading`, `description`; `content`: more text under them
  - `confirmLabel` ('Confirm'), `cancelLabel` ('Cancel'; null for none, an
    acknowledgement)
  - `danger`: a red confirm button, for things that can't be undone
  - `typeToConfirm`: text to type before the button enables
  - `onConfirm`: runs before it closes, with the button loading; if it
    throws (or rejects), the dialog stays open and shows the error's message
  - `size`: the dialog's size ('sm')
  - `request`: the options above, with the promise's `resolve` (confirm() passes it)
  - `onfinish`: called once it has closed (confirm() then shows the next)
-->
<script>
  import Dialog from '../dialog/Dialog.svelte'
  import Button from '../button/Button.svelte'
  import Input from '../input/Input.svelte'
  import Alert from '../alert/Alert.svelte'
  import { partsOf } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './confirm.css'

  let { request, onfinish } = $props()

  const part = partsOf('confirm', () => ({}))
  const id = $props.id()
  let open = $state(false)
  let typed = $state('')
  let busy = $state(false)
  let error = $state(null)
  let answered = false

  const t = $derived(uiLocale.messages)
  const ready = $derived(!request.typeToConfirm || typed.trim() === request.typeToConfirm)
  const cancelLabel = $derived(request.cancelLabel === undefined ? t.common.cancel : request.cancelLabel)

  // Opened after mounting, so it animates in; the text to type takes focus
  // (an alert dialog would focus its close button).
  $effect(() => {
    open = true
    if (!request.typeToConfirm) return
    const timer = setTimeout(() => document.querySelector(`#${CSS.escape(id)} input`)?.focus(), 60)
    return () => clearTimeout(timer)
  })

  // Answers once: resolves the promise, then closes.
  function settle(confirmed) {
    if (answered) return
    answered = true
    open = false
    request.resolve(confirmed)
  }

  async function accept() {
    if (!ready || busy) return
    if (request.onConfirm) {
      busy = true
      error = null
      try {
        await request.onConfirm()
      } catch (e) {
        busy = false
        error = e?.message ?? String(e)
        return
      }
      busy = false
    }
    settle(true)
  }
</script>

<!-- Closing any other way (Escape, the close button) is a no, unless it's still working. -->
<Dialog alert size={request.size ?? 'sm'} heading={request.heading} description={request.description} onexitcomplete={onfinish}
  bind:open={() => open, (next) => { if (!next && !busy) settle(false) }}>
  {#if request.content || request.typeToConfirm || error}
    <div {...part('body')}>
      {#if request.content}<p {...part('content')}>{request.content}</p>{/if}
      {#if request.typeToConfirm}
        <form {...part('type')} {id} onsubmit={(e) => { e.preventDefault(); accept() }}>
          <span {...part('type-label')}>{t.confirm.typePrefix} <strong>{request.typeToConfirm}</strong> {t.confirm.typeSuffix}</span>
          <Input bind:value={typed} autocomplete="off" aria-label={t.confirm.typeToConfirm(request.typeToConfirm)} />
        </form>
      {/if}
      {#if error}<Alert variant="danger">{error}</Alert>{/if}
    </div>
  {/if}
  {#snippet footer()}
    {#if cancelLabel !== null}<Button disabled={busy} onclick={() => settle(false)}>{cancelLabel}</Button>{/if}
    <Button variant={request.danger ? 'danger' : 'primary'} disabled={!ready} loading={busy} onclick={accept}>{request.confirmLabel ?? t.common.confirm}</Button>
  {/snippet}
</Dialog>
