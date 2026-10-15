// Loads iconify-icon (the <iconify-icon> element) for the components that
// draw icons. Icons draw inside its shadow root, out of reach of page CSS,
// but custom properties inherit into it: this rule there gives Lucide-style
// icons (a stroke width of 2 in their markup) the --ui-icon-stroke weight.
// Icons with any other stroke, or none, are left alone.
import { appendCustomStyle } from 'iconify-icon'

appendCustomStyle('[stroke-width="2"] { stroke-width: var(--ui-icon-stroke, 2); }')
