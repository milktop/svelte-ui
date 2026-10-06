# @milktop/svelte-ui

Svelte 5 components on [Zag](https://zagjs.com) state machines, with
[imba-ui](https://github.com/milktop/imba-ui)'s API, tokens and design.

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

Button · Input · Textarea · NumberInput · PasswordInput · PinInput · TagsInput ·
Select · Combobox · DatePicker · Checkbox · CheckboxGroup · Switch · RadioGroup ·
Segmented · Slider · Field · Fields · FileUpload · Popover · Card · Page ·
AppShell · Topbar · Sidebar · NavSection · NavGroup · NavItem · Breadcrumbs

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

Theme it by setting tokens (see `src/theme.css`):

```css
:root { --ui-accent: #e11d48; --ui-radius: 10px; }
:root.dark { --ui-accent-soft: #4c0519; }
```

## Develop

```sh
npm install
npm run dev   # the playground, http://localhost:5193
```

Each playground page reads its component's doc comment, props, snippets and
parts from the source, and its examples are the files in
`playground/examples/<component>/`, shown with their code.
