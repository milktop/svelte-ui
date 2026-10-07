<!--
  Avatars in an overlapping stack, each ringed in the page colour, with a
  "+3" for the rest.

  <AvatarGroup items={students} max={4} tooltip />
  <AvatarGroup size="sm"><Avatar name="Ada Lovelace" /><Avatar name="Alan Turing" /></AvatarGroup>

  - `items`: `{ name, src, color }` (or names), shown as Avatars; or put
    Avatars in it yourself
  - `max`: with `items`, show this many and a "+N" for the rest (its tooltip
    lists them)
  - `size`, `color`, `square`, `letters`: passed to each Avatar
  - `tooltip`: each name in a tooltip on hover
  - `spacing`: 'tight', 'normal' (default) or 'loose', how much they overlap
  - `label`: what the group is, for assistive tech ('3 students')
  - the ring is `--ui-avatar-ring` (the surface by default): set it to the
    background the group sits on
-->
<script>
  import Avatar from './Avatar.svelte'
  import Tooltip from '../tooltip/Tooltip.svelte'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './avatar.css'

  let {
    items = null, max = null, size = 'md', color = 'accent', square = false, letters = 2, tooltip = false,
    spacing = 'normal', label = null, class: className = '', classes = {}, children, ...rest
  } = $props()

  const part = partsOf('avatar-group', () => classes)
  const people = $derived((items ?? []).map((item) => (typeof item === 'string' ? { name: item } : item)))
  const shown = $derived(max && people.length > max ? people.slice(0, max) : people)
  const hidden = $derived(people.slice(shown.length))
  const named = ['sm', 'md', 'lg', 'xl']
</script>

<div {...rest} {...part('root')} class={cx(className)} role="group" aria-label={label ?? (items ? `${people.length} people` : undefined)}
  data-size={named.includes(size) ? size : 'custom'} data-spacing={spacing}>
  {#each shown as person (person.name ?? person.src)}
    <Avatar {size} {square} {letters} color={person.color ?? color} name={person.name} src={person.src} tooltip={tooltip || null} />
  {/each}
  {@render children?.()}
  {#if hidden.length}
    <Tooltip content={hidden.map((person) => person.name).join(', ')}>
      {#snippet trigger(props)}
        <span {...props} {...part('more')} data-square={square || undefined} style:--avatar-size={named.includes(size) ? undefined : typeof size === 'number' ? `${size}px` : size}
          aria-label="{hidden.length} more: {hidden.map((person) => person.name).join(', ')}">+{hidden.length}</span>
      {/snippet}
    </Tooltip>
  {/if}
</div>
