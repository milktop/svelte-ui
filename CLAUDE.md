# @milktop/svelte-ui

Svelte 5 components on Zag, ported from imba-ui (`~/sites/imba/ui`): same
props, tokens, part names and look. Read `readme.md` first.

## Layout

- `src/<component>/<Name>.svelte` and `<component>.css`, exported from `src/index.js`
- `src/theme.css`: `--ui-*` tokens (dark under `html.dark`); `src/utils.js`: `cx`, `partsOf`, field, shell and sidebar contexts
- `src/presence.svelte.js`: `Presence` (keeps a closing part until its animation ends) and `portal` (an attachment moving an element to <body>)
- `src/color-scheme.svelte.js`: `colorScheme` (light/dark/system, saved, on <html>)
- `playground/`: Vite app (`npm run dev`). Pages are listed in `registry.js`;
  examples are `playground/examples/<slug>/<n>-<name>.svelte`, with a leading
  `<!-- Title\n  description -->` comment. The API panel parses the
  component's source (`lib/api.js`), so keep the doc comment format.
  Pages in a `form` group (Inputs, Pickers, Choices) lay their examples on a
  two-column grid, so an example is just the components, each with its own
  `label`, plus a `<p>` readout (spanning both columns) where binding matters.
  Only the Field page wraps examples in Fields. A page can opt out with
  `form: false` in the registry (Editor, Attachments, File upload).
  An example named `<n>-<name>.bare.svelte` shows without the card round it.
  Pages without examples are left out of the nav.
- `playground/blocks/`: composed screens. `pages/<n>-<slug>.svelte` (one per
  page) and `sections/<slug>/<n>-<name>.svelte` (variants), listed by
  `blocks/registry.js`; shared data in `blocks/data.js`.

## Select

One component for every kind of pick: `Select.svelte` declares (and
documents) all the props and renders `ListSelect` (a button, Zag's select)
or, with `searchable`, `load` or `oncreate`, `SearchSelect` (an input, Zag's
combobox). Shared props go to both; keep the two in step. The playground's
API panel reads parts from both through the imports.

## Every component

- Starts with a doc comment: a summary line, a usage example, then one bullet
  per prop: ``- `name`: what it does``.
- Form controls take `label` (skipped inside a Field).
- Props: `class` (outer element), `classes` (per part), `...rest` onto the
  natural element (the button, the input), and `$bindable()` for its value.
- `const part = partsOf('<scope>', () => classes)` and `{...part('name')}` on
  every part, including the root (`{...part('root')} class={cx(className)}`).
  On a Zag element spread `part(…)` first, so Zag's data-part wins, but only
  when the scopes match (Popover on Zag's popover). When the component's
  scope differs from the machine's (Sheet and Command on Zag's dialog,
  Segmented on radio-group), spread `part(…)` last, or the parts pick up the
  other component's CSS (Sheet would look like Dialog).
- Overlays that render at the end of <body>: `{@attach portal}`. Exit
  animations: `const presence = new Presence(() => api.open)`, render while
  `presence.present`, `hidden={false}` after Zag's props, and
  `onanimationend={presence.done}`.
- Child components that register with a parent through context (Tab,
  NavGroup in a NavSection): the parent's `register` must `untrack` its list
  changes, or the child's effect loops (effect_update_depth_exceeded).
- Modifiers are data attributes (`data-variant`, `data-size`), never classes:
  plain class names collide with Tailwind's (`block`, `hidden`).
- CSS: `@layer ui`, selectors `[data-scope=x][data-part=y]`. Containers (Card,
  Page) use `>` for modifiers, so they don't reach into nested components.
- Imports its CSS and `../theme.css` itself.
- Inside a Field (`useField()`): skip your own label, pass `ids` to Zag so the
  field's label points at the control, and spread `fieldAttrs(field)` last on it.
- Snippets for parts people replace (triggers, prev/next, items): render the
  default when the snippet is absent; pass `{ ...part('x'), ...zagProps }`.

## Checks

- `npm run check` compiles every .svelte file and fails on compile errors
  (which 500 the module and blank the playground) and undefined names (a
  prop used but never declared, which blank the page at runtime). Run it
  after editing a component.

## Gotchas

- Tags input: Zag clears the box (in the next frame) even when `validate`
  rejects a tag; the component puts the text back two frames later.
- SearchSelect `load`: show "Loading…" instead of the previous query's results.
- AppShell listens for ⌘B on the window: a second shell on the page needs
  `shortcut={false}` (and `breakpoint={0}` to stay out of drawer mode).
- Deleting an example and recreating it under the same name can leave the
  browser running the old one (a cached registry.js with old ?t= URLs):
  restart the dev server and change registry.js.

- Zag's Svelte adapter maps `onChange` to the `input` event (and `defaultValue`
  to `value`); a script testing a file input must fire `input`, not just `change`.
- Inside a Field, a control's own `min-width` must give way (`min-width: 0` on
  the field's control), or it overflows narrow grid cells.
- SearchSelect: `inputBehavior: 'autohighlight'`, or Enter picks nothing until
  you arrow down. Filter on `reason === 'input-change'` only.
- Tags input: Zag doesn't always clear the box after a delimiter adds a tag;
  the component clears it when the value grows.
- Two inputs bound to one value must agree on its shape (a 6-box and a 4-box
  PinInput on one string fight over its length).

- Don't name a local `props`: Svelte then reads `$props()` as that store's
  auto-subscription ("$bindable() can only be used inside a $props() declaration").

- Zag machine props: don't pass a key as `undefined` to mean "default"
  (`closeOnSelect: undefined` overrides Zag's `true`); leave it out or pass
  the value.
- Snippets declared at the top of a template can go in script data (Table's
  `columns: [{ key, cell: mySnippet }]`).
- `{@const}` must sit directly inside a block (`{#each}`, `{#if}`), not inside
  an element.
- Svelte 5 binding a getter/setter pair (`bind:value={() => x, (v) => …}`)
  is how a component's value maps onto something that isn't a plain state.
- The in-app browser throttles animations and transitions while its pane is
  hidden: a part can look stuck mid-animation (opacity 0, the rail still
  240px wide). Check state with scripts, not screenshots, then.
- Zag in Svelte: pass props as a getter (`useMachine(m, () => ({…}))`) so they
  stay reactive; controlled `value` then works.
- Field ids come from `$props.id()`; Zag ids options take functions for
  indexed parts (`input: () => id`).
