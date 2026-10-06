// Keeps a closing part in the page until its closing animation ends, so
// dialogs, sheets and cards can animate out:
//
//   const presence = new Presence(() => api.open)
//   {#if presence.present}<div {...api.getContentProps()} hidden={false} onanimationend={presence.done}>…{/if}
//
// If no animation ends (reduced motion), it goes after `wait` ms anyway.
export class Presence {
  present = $state(false)

  constructor(open, wait = 300) {
    this.open = open
    $effect.pre(() => {
      if (open()) this.present = true
    })
    $effect(() => {
      if (open() || !this.present) return
      const timer = setTimeout(() => (this.present = false), wait)
      return () => clearTimeout(timer)
    })
  }

  // An animationend handler (only the element's own, not its children's).
  done = (e) => {
    if (e && e.target !== e.currentTarget) return
    if (!this.open()) this.present = false
  }
}

// Moves an element to the end of <body>, so no ancestor's stacking,
// transform or overflow can trap it: <div {@attach portal}>.
export function portal(node) {
  document.body.appendChild(node)
  return () => node.remove()
}
