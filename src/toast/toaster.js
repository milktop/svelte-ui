import * as toast from '@zag-js/toast'

// Toasts: brief notifications stacked in a corner.
//
//   import { toaster } from '@milktop/svelte-ui'
//   toaster.success({ title: 'Lesson booked', description: 'Thursday at 16:00' })
//   const id = toaster.loading({ title: 'Uploading…' })
//   toaster.update(id, { type: 'success', title: 'Uploaded' })
//
// Render one <Toaster /> (e.g. in the app layout). The shared `toaster`
// stacks at bottom-end; make another with createToaster and pass it to a
// Toaster as `store`.
export const createToaster = (options = {}) => toast.createStore({ placement: 'bottom-end', overlap: true, max: 5, ...options })

export const toaster = createToaster()
