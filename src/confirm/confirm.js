// confirm(): asks before doing something, from anywhere. A dialog you
// `await` for a yes or no, with no state to keep and nothing to put in the
// layout.
//
//   if (await confirm({ heading: 'Archive Ada?', confirmLabel: 'Archive' })) archive(ada)
//
//   await confirm({
//     heading: 'Delete Ada Lovelace?',
//     description: 'Her lessons and invoices go too.',
//     danger: true,
//     confirmLabel: 'Delete',
//     typeToConfirm: 'Ada Lovelace',
//     onConfirm: () => api.delete(ada.id),   // the button spins until it's done
//   })
//
// Resolves true when confirmed, false when cancelled (Cancel, Escape or the
// close button). Calls made while one is open wait their turn.
//
// - `heading`, `description`; `content`: more text under them
// - `confirmLabel` ('Confirm'), `cancelLabel` ('Cancel'; null for none, an
//   acknowledgement)
// - `danger`: a red confirm button, for things that can't be undone
// - `typeToConfirm`: text to type before the button enables
// - `onConfirm`: runs before it closes, with the button loading; if it
//   throws (or rejects), the dialog stays open and shows the error's message
// - `size`: the dialog's size ('sm')
import { mount, unmount } from 'svelte'
import Confirm from './Confirm.svelte'

// The open request first, then the ones waiting.
const queue = []

function showNext() {
  const request = queue[0]
  if (!request || request.shown) return
  request.shown = true
  const target = document.createElement('div')
  target.style.display = 'contents'
  document.body.append(target)
  // Gone once it has animated out; the next one (if any) opens.
  const app = mount(Confirm, {
    target,
    props: {
      request,
      onfinish: () => {
        queue.shift()
        setTimeout(() => {
          unmount(app)
          target.remove()
          showNext()
        })
      },
    },
  })
}

export function confirm(options = {}) {
  return new Promise((resolve) => {
    queue.push({ ...options, resolve })
    showNext()
  })
}
