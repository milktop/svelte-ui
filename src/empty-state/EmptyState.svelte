<!--
  What to show where a list or page has nothing yet.

  <EmptyState icon="lucide:users" heading="No students yet" description="Add one to start booking lessons.">
    <Button variant="primary">Add student</Button>
  </EmptyState>

  - `icon`: an Iconify name; `heading`, `description`
  - the content: actions, e.g. a button to create the first item
-->
<script>
  import 'iconify-icon'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './empty-state.css'

  let { icon = null, heading = null, description = null, class: className = '', classes = {}, children, ...rest } = $props()

  const part = partsOf('empty-state', () => classes)
</script>

<div {...rest} {...part('root')} class={cx(className)}>
  {#if icon}<span {...part('icon-wrap')}><iconify-icon {...part('icon')} {icon} aria-hidden="true"></iconify-icon></span>{/if}
  {#if heading}<h3 {...part('heading')}>{heading}</h3>{/if}
  {#if description}<p {...part('description')}>{description}</p>{/if}
  {#if children}<div {...part('actions')}>{@render children()}</div>{/if}
</div>
