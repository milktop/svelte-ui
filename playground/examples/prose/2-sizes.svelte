<!-- Sizes and other elements
  `size`: 'sm', 'md' or 'lg'; tables, code, rules and headings are styled too. -->
<script>
  import { Prose } from '@milktop/svelte-ui'
</script>

<Prose size="sm" class="max-w-prose">
  <h1>Terms</h1>
  <p>Lessons are booked by the hour. Cancel up to <code>24h</code> before at no charge.</p>
  <hr />
  <table><thead><tr><th>Length</th><th>Price</th></tr></thead><tbody><tr><td>60 min</td><td>£40</td></tr><tr><td>90 min</td><td>£58</td></tr></tbody></table>
</Prose>
