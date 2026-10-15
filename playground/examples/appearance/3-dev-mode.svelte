<!-- Dev mode
  `dev` offers every accent and sidebar style, any colour, a reset, and the props to paste for the current choice. Its switch previews what users get. Take it off before shipping. -->
<script>
  import { Appearance } from '@milktop/svelte-ui'
</script>

<Appearance dev accents={['teal', 'blue']} sidebars={['neutral', 'dark']} />
