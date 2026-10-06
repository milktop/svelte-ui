<!--
  An avatar: an image, or initials while it loads and if it fails.

  <Avatar name="Ada Lovelace" src={ada.photo} />
  <Avatar name="Ada Lovelace" color="auto" tooltip />

  - `src`: the image URL
  - `name`: the alt text and the initials ("Ada Lovelace" → AL); without one
    the fallback is a person icon
  - `letters`: how many initials, 2 (default) or 1
  - `size`: 'sm', 'md' (default), 'lg' or 'xl', or any CSS length; the
    initials scale with it
  - `square`: a rounded square instead of a circle
  - `color`: 'accent' (default), 'gray', 'red', 'orange', 'amber', 'green',
    'teal', 'blue', 'purple' or 'pink'; 'auto' picks one from the name, so the
    same person always gets the same colour
  - `tooltip`: true shows the name on hover (handy in a stack), or a string
    shows that instead
-->
<script>
  import * as avatar from '@zag-js/avatar'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import Tooltip from '../tooltip/Tooltip.svelte'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './avatar.css'

  let {
    src = null, name = null, letters = 2, size = 'md', square = false, color = 'accent', tooltip = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('avatar', () => classes)
  const id = $props.id()
  const service = useMachine(avatar.machine, () => ({ id }))
  const api = $derived(avatar.connect(service, normalizeProps))

  const named = ['sm', 'md', 'lg', 'xl']
  const custom = $derived(named.includes(size) ? null : typeof size === 'number' ? `${size}px` : size)

  const initials = $derived.by(() => {
    const words = String(name ?? '').trim().split(/\s+/).filter(Boolean)
    if (!words.length) return ''
    if (Number(letters) === 1) return words[0][0].toUpperCase()
    return (words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words.at(-1)[0]).toUpperCase()
  })

  // FNV-1a, which spreads similar names well.
  const autoColors = ['red', 'orange', 'amber', 'green', 'teal', 'blue', 'purple', 'pink']
  const tone = $derived.by(() => {
    if (color !== 'auto') return color
    const key = String(name ?? '').trim()
    if (!key) return 'accent'
    let hash = 2166136261
    for (const ch of key) hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619) >>> 0
    return autoColors[hash % autoColors.length]
  })

  const tip = $derived(tooltip === true ? name : tooltip || null)
</script>

<span {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}
  data-size={custom ? 'custom' : size} data-square={square || undefined} data-color={tone} style:--avatar-size={custom}>
  {#if src}<img {...part('image')} {...api.getImageProps()} {src} alt={name ?? ''} />{/if}
  <span {...part('fallback')} {...api.getFallbackProps()} aria-hidden={name ? undefined : 'true'}>
    {#if initials}{initials}{:else}<iconify-icon {...part('person')} icon="lucide:user"></iconify-icon>{/if}
  </span>
  <!-- The tooltip's trigger is a layer over the whole avatar, which carries Zag's root props. -->
  {#if tip}
    <Tooltip content={tip}>{#snippet trigger(props)}<span {...props} {...part('tooltip-target')}></span>{/snippet}</Tooltip>
  {/if}
</span>
