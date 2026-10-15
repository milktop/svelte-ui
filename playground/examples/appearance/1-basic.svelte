<!-- Basic
  Light and dark, every accent and every sidebar style, behind one button. The accent becomes the `--ui-accent-50` … `-950` scale on <html>, so every accent token follows it; the sidebar styles recolour this page's own sidebar (in light mode). The choice is saved, and `appearance` reads it (reactively). -->
<script>
  import { Appearance, appearance } from '@milktop/svelte-ui'

  let picked = $state(null)
</script>

<Appearance onchange={(value) => (picked = value)} />
<p class="m-0 w-full text-sm text-(--ui-muted)">{JSON.stringify({ picked, appearance: appearance.value })}</p>
