# @milktop/svelte-ui

Svelte 5 components on [Zag](https://zagjs.com) state machines, with
[imba-ui](https://github.com/milktop/imba-ui)'s API, tokens and design.

**Playground:** https://svelte-ui.pages.dev, with every component, its props and
examples.

```svelte
<script>
  import { Field, Select, DatePicker, Button } from '@milktop/svelte-ui'
</script>

<Field label="Student" error={form.errors.student_id}>
  <Select items={students} labelKey="name" valueKey="id" bind:value={form.student_id} />
</Field>
<DatePicker label="Date" bind:value={form.date} classes={{ prev: 'rounded-full' }} />
<Button variant="primary" loading={form.processing}>Save</Button>
```

## Components

The same set as imba-ui:

- Actions: Button · CopyButton
- Display: Avatar/AvatarGroup · Badge · Kbd · FormatNumber/FormatBytes/FormatRelative ·
  RollingNumber · Divider · Prose · Highlight · TreeView · Card · Table · Pagination ·
  DataList · Stat/Stats · AreaChart · BarChart · DonutChart · Sparkline ·
  EventCalendar · SortableList · Timeline
- Feedback: Alert · Banner · Progress · Skeleton · Spinner · EmptyState · Toaster (`toaster`)
- Inputs: Input · Textarea · Editable · NumberInput · PasswordInput · PinInput · TagsInput ·
  Slider · FileUpload · Attachments · Editor (TipTap)
- Pickers: Select (one component: searchable, server `load`, `oncreate`,
  multiple, tags) · DatePicker (or `inline`) · TimeInput · NativeSelect
- Choices: Checkbox · CheckboxGroup · Switch · RadioGroup · Segmented · SwatchPicker ·
  ThemeToggle (`colorScheme`) · Appearance (`appearance`: accent scales, sidebar styles)
- Forms: Field · Fields
- Navigation: AppShell (flat or inset; an inset shell, or `scroll="page"`, scrolls
  only the page on wide screens) · Topbar · Sidebar · NavSection · NavGroup · NavItem ·
  SidebarUser · Page · Breadcrumbs · Command (⌘K)
- Overlays: Tooltip · Popover · HoverCard · Dialog · `confirm()` · Sheet · ActionBar · Menu ·
  ContextMenu (with Submenu, MenuItem, MenuGroup, MenuCheckbox, MenuRadioGroup…)
- Disclosure: Tabs/Tab · Accordion/AccordionItem · Collapsible

## Every component works the same way

- One package and namespace: `import { Button, DatePicker } from '@milktop/svelte-ui'`.
- `bind:value` on every input-like component.
- `class`: classes for the outer element.
- `classes`: classes per part, keyed by camelCased part name
  (`classes={{ viewTrigger: 'text-pink-700' }}`). The playground lists each
  component's parts.
- Snippets replace a part (a date picker's `prev`); they get its props.
- `style="--ui-accent: …"`: tokens for one instance; on `:root` for the whole app.

The library adds no classes of its own: parts carry Zag-style `data-scope`
and `data-part` attributes, which its CSS targets, all in `@layer ui`. So your
classes and Tailwind's utilities always win without `!important`, and a part
never picks up another component's rules.

## Setup

Components import their own CSS. With Tailwind, declare the layer order at
the top of your app's CSS, so its reset stays below the library and its
utilities above:

```css
@layer theme, base, ui, components, utilities;
@import "tailwindcss";
```

The app's locale and the components' words (English and French built in)
are one setting, `uiLocale`: dates, numbers, placeholders, empty states and
screen-reader labels follow it.

```js
import { uiLocale } from '@milktop/svelte-ui'
uiLocale.set('fr-FR')
uiLocale.set('en-GB', { table: { empty: 'No pupils yet' } })
```

Theme it by setting tokens (see `src/theme.css`, or the playground's Tokens page):

```css
:root { --ui-accent: #e11d48; --ui-radius: 10px; }
:root.dark { --ui-accent-soft: #4c0519; }
```

## Develop

```sh
npm install
npm run dev     # the playground, http://localhost:5193
npm run check   # compile errors and undefined names, which the build lets through
```

Each playground page reads its component's doc comment, props, snippets and
parts from the source, and its examples are the files in
`playground/examples/<component>/`, shown with their code. Blocks
(composed screens) are in `playground/blocks/`; Theming and Installation are
guide pages.

## Deploy the playground

`npm run build` writes a static, client-side site to `playground/dist`, which
any static host can serve. It's on **Cloudflare Pages** at
https://svelte-ui.pages.dev:

1. **Workers & Pages → Create**, then the Pages option ("Looking to deploy
   Pages? Get started") → **Import an existing Git repository**, and pick
   `milktop/svelte-ui`.
2. Framework preset None; build command `npm run build`; build output
   directory `playground/dist`. `.nvmrc` sets Node 22.
3. Deploy. Every push to `main` redeploys; other branches get preview URLs.
   For a custom subdomain, use **Custom domains** in the project and add the
   CNAME it asks for at your DNS host.

The playground routes on the URL hash, so it needs no SPA fallback. The site
is public but kept out of search results: a `noindex` meta tag in
`index.html`, and an `X-Robots-Tag` header on every file from
`playground/public/_headers`. To make it private instead, turn on
**Cloudflare Access** for the project.
