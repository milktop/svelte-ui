# @milktop/svelte-ui

Svelte 5 components on Zag, ported from imba-ui (`~/sites/imba/ui`): same
props, tokens, part names and look. Read `readme.md` first.

## Layout

- `src/<component>/<Name>.svelte` and `<component>.css`, exported from `src/index.js`
- `src/theme.css`: `--ui-*` tokens (dark under `html.dark`); `src/utils.js`: `cx`, `partsOf`, field context
- `playground/`: Vite app (`npm run dev`). Pages are listed in `registry.js`;
  examples are `playground/examples/<slug>/<n>-<name>.svelte`, with a leading
  `<!-- Title\n  description -->` comment. The API panel parses the
  component's source (`lib/api.js`), so keep the doc comment format.

## Every component

- Starts with a doc comment: a summary line, a usage example, then one bullet
  per prop: ``- `name`: what it does``.
- Props: `class` (outer element), `classes` (per part), `...rest` onto the
  natural element (the button, the input), and `$bindable()` for its value.
- `const part = partsOf('<scope>', () => classes)` and `{...part('name')}` on
  every part, including the root (`{...part('root')} class={cx(className)}`).
  On a Zag element spread `part(…)` first, so Zag's data-part wins.
- Modifiers are data attributes (`data-variant`, `data-size`), never classes:
  plain class names collide with Tailwind's (`block`, `hidden`).
- CSS: `@layer ui`, selectors `[data-scope=x][data-part=y]`. Containers (Card,
  Page) use `>` for modifiers, so they don't reach into nested components.
- Imports its CSS and `../theme.css` itself.
- Inside a Field (`useField()`): skip your own label, pass `ids` to Zag so the
  field's label points at the control, and spread `fieldAttrs(field)` last on it.
- Snippets for parts people replace (triggers, prev/next, items): render the
  default when the snippet is absent; pass `{ ...part('x'), ...zagProps }`.

## Gotchas

- Zag in Svelte: pass props as a getter (`useMachine(m, () => ({…}))`) so they
  stay reactive; controlled `value` then works.
- Field ids come from `$props.id()`; Zag ids options take functions for
  indexed parts (`input: () => id`).
