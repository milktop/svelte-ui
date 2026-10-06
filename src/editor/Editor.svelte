<!--
  A rich text editor on TipTap (ProseMirror): a toolbar over an editable area
  whose value is HTML.

  <Editor label="Notes" placeholder="Lesson notes…" bind:value={notes} />

  Inside a Field it takes the field's label, hint and error.

  - `value`: bindable; the HTML ('' when empty)
  - `label`: a label above it (skipped inside a Field)
  - `tools`: which toolbar buttons, in order ('|' for a divider): bold,
    italic, underline, strike, code, h2, h3, bulletList, orderedList,
    blockquote, link, image, undo, redo
  - `toolbar`: false hides the toolbar
  - `placeholder`: shown while it's empty
  - `maxLength`: a character limit, with a counter
  - `minHeight`, `maxHeight`: CSS lengths; it scrolls past maxHeight
  - `disabled`: read only
  - `uploadImage`: an async function taking a File and returning its URL, or
    `{ src, alt, title, data-* }` (data-* kept on the <img>, e.g. a signed id
    for your server). With it, images can be dropped, pasted or picked with
    the image button, and are inserted once uploaded; without it, dropped
    and pasted files are ignored. A failed upload calls `onerror`
  - `editor`: bindable; the TipTap editor, for anything more

  Keyboard shortcuts are TipTap's (⌘B, ⌘I, ⌘U, ⌘⇧7/8 for lists, ⌘Z…).
-->
<script module>
  export const defaultTools = ['bold', 'italic', 'underline', 'strike', '|', 'h2', 'h3', '|', 'bulletList', 'orderedList', 'blockquote', '|', 'link', 'image', '|', 'undo', 'redo']

  // Each tool: its icon and label, how it runs, and when it's active.
  const toolDefs = {
    bold: { icon: 'lucide:bold', label: 'Bold', run: (c) => c.toggleBold(), active: ['bold'] },
    italic: { icon: 'lucide:italic', label: 'Italic', run: (c) => c.toggleItalic(), active: ['italic'] },
    underline: { icon: 'lucide:underline', label: 'Underline', run: (c) => c.toggleUnderline(), active: ['underline'] },
    strike: { icon: 'lucide:strikethrough', label: 'Strikethrough', run: (c) => c.toggleStrike(), active: ['strike'] },
    code: { icon: 'lucide:code', label: 'Code', run: (c) => c.toggleCode(), active: ['code'] },
    h2: { icon: 'lucide:heading-2', label: 'Heading', run: (c) => c.toggleHeading({ level: 2 }), active: ['heading', { level: 2 }] },
    h3: { icon: 'lucide:heading-3', label: 'Subheading', run: (c) => c.toggleHeading({ level: 3 }), active: ['heading', { level: 3 }] },
    bulletList: { icon: 'lucide:list', label: 'Bulleted list', run: (c) => c.toggleBulletList(), active: ['bulletList'] },
    orderedList: { icon: 'lucide:list-ordered', label: 'Numbered list', run: (c) => c.toggleOrderedList(), active: ['orderedList'] },
    blockquote: { icon: 'lucide:text-quote', label: 'Quote', run: (c) => c.toggleBlockquote(), active: ['blockquote'] },
    undo: { icon: 'lucide:undo-2', label: 'Undo', run: (c) => c.undo(), can: 'undo' },
    redo: { icon: 'lucide:redo-2', label: 'Redo', run: (c) => c.redo(), can: 'redo' },
  }
</script>

<script>
  import { untrack } from 'svelte'
  import { Editor } from '@tiptap/core'
  import StarterKit from '@tiptap/starter-kit'
  import { Placeholder, CharacterCount } from '@tiptap/extensions'
  import 'iconify-icon'
  import { RichImage } from './image.js'
  import Popover from '../popover/Popover.svelte'
  import Input from '../input/Input.svelte'
  import Button from '../button/Button.svelte'
  import { cx, partsOf, useField } from '../utils.js'
  import '../theme.css'
  import './editor.css'

  let {
    value = $bindable(''), label = null, placeholder = '', tools = defaultTools, toolbar = true, maxLength = null,
    minHeight = '8rem', maxHeight = null, disabled = false, uploadImage = null, onerror = null, editor = $bindable(null),
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('editor', () => classes)
  const id = $props.id()
  const labelId = $derived(field ? field.labelId : label ? `${id}-label` : undefined)

  let contentEl = $state()
  let focused = $state(false)
  let uploading = $state(0)
  // Bumped on every transaction, so the toolbar's states re-read the editor.
  let version = $state(0)
  let html = ''

  // Made once (untracked, so typing doesn't remake it); the effects below
  // keep it in step with the props.
  $effect(() => untrack(() => {
    html = value ?? ''
    const instance = new Editor({
      element: contentEl,
      content: html,
      editable: !disabled,
      extensions: [
        StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true } }),
        Placeholder.configure({ placeholder: () => placeholder }),
        CharacterCount.configure({ limit: maxLength }),
        RichImage,
      ],
      editorProps: {
        // Files dropped or pasted: images go to `uploadImage`; anything else
        // is ignored, so the browser doesn't open the file in the tab.
        handleDrop(view, event, slice, moved) {
          const files = Array.from(event.dataTransfer?.files ?? [])
          if (moved || !files.length) return false
          event.preventDefault()
          insertImages(files, view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos)
          return true
        },
        handlePaste(view, event) {
          const files = Array.from(event.clipboardData?.files ?? [])
          if (!files.length) return false
          insertImages(files)
          return true
        },
        // Read on every update, so the field's label and messages follow.
        attributes: () => ({
          role: 'textbox', 'aria-multiline': 'true',
          'aria-labelledby': labelId ?? '', 'aria-describedby': field?.describedBy ?? '',
          'aria-invalid': field?.invalid ? 'true' : 'false',
        }),
      },
      onUpdate: ({ editor }) => {
        html = editor.isEmpty ? '' : editor.getHTML()
        value = html
      },
      onTransaction: () => version++,
      onFocus: () => (focused = true),
      onBlur: () => (focused = false),
    })
    editor = instance
    return () => {
      instance.destroy()
      editor = null
    }
  }))

  // A new value from outside (not the editor's own) replaces the content.
  $effect(() => {
    if (editor && (value ?? '') !== html) {
      html = value ?? ''
      editor.commands.setContent(html, { emitUpdate: false })
    }
  })
  $effect(() => { if (editor && editor.isEditable === !!disabled) editor.setEditable(!disabled) })
  // ProseMirror reads its attributes on updates; refresh them when the field changes.
  $effect(() => {
    labelId; field?.describedBy; field?.invalid
    editor?.view.setProps({})
  })

  const isActive = (tool) => (version, !!editor && !!tool.active && editor.isActive(...tool.active))
  const canRun = (tool) => (version, !!editor && !disabled && (tool.can ? editor.can()[tool.can]() : true))
  const run = (tool) => tool.run(editor.chain().focus()).run()
  const characters = $derived((version, editor ? editor.storage.characterCount.characters() : 0))

  // The link popover: the current link's address, applied or removed.
  let linkOpen = $state(false)
  let linkUrl = $state('')
  $effect(() => { if (linkOpen) linkUrl = editor?.getAttributes('link')?.href ?? '' })
  const linkActive = $derived((version, !!editor?.isActive('link')))

  function applyLink(e) {
    e.preventDefault()
    const url = linkUrl.trim()
    const chain = editor.chain().focus().extendMarkRange('link')
    if (url) chain.setLink({ href: /^[a-z]+:/i.test(url) ? url : `https://${url}` }).run()
    else chain.unsetLink().run()
    linkOpen = false
  }

  function removeLink() {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    linkOpen = false
  }

  // A URL, or { src, alt, title, data-*… }, as the image node's attributes.
  function imageAttrs(result, file) {
    if (!result) return null
    if (typeof result === 'string') return { src: result, alt: file.name }
    const data = Object.fromEntries(Object.entries(result).filter(([key]) => key.startsWith('data-')))
    return { src: result.src, alt: result.alt ?? file.name, title: result.title ?? null, data: Object.keys(data).length ? data : null }
  }

  // Uploads the images among `files` and inserts each at `pos` (or the cursor) as it arrives.
  async function insertImages(files, pos = null) {
    if (!uploadImage) return
    for (const file of files.filter((f) => (f.type ?? '').startsWith('image/'))) {
      uploading++
      try {
        const attrs = imageAttrs(await uploadImage(file), file)
        if (attrs && editor) editor.chain().focus().insertContentAt(pos ?? editor.state.selection.to, { type: 'image', attrs }).run()
      } catch (error) {
        onerror?.(error)
      }
      uploading--
    }
  }

  function pickedImages(e) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    insertImages(files)
  }
</script>

{#if label && !field}<span {...part('label')} id={labelId}>{label}</span>{/if}
<div {...rest} {...part('root')} class={cx(className)} data-focused={focused || undefined} data-disabled={disabled || undefined}
  data-invalid={field?.invalid || undefined}>
  {#if toolbar && !disabled}
    <div {...part('toolbar')} role="toolbar" aria-label="Formatting">
      {#each tools as name, i (name === '|' ? `d${i}` : name)}
        {#if name === '|'}
          <span {...part('divider')}></span>
        {:else if name === 'link'}
          <Popover placement="bottom-start" bind:open={linkOpen}>
            {#snippet trigger(props)}
              <button {...props} {...part('tool')} type="button" aria-label="Link" aria-pressed={linkActive} onmousedown={(e) => e.preventDefault()}>
                <iconify-icon icon="lucide:link" aria-hidden="true"></iconify-icon>
              </button>
            {/snippet}
            <form {...part('link-form')} onsubmit={applyLink}>
              <Input size="sm" icon="lucide:link" placeholder="https://…" bind:value={linkUrl} />
              <div {...part('link-actions')}>
                {#if linkActive}<Button size="sm" variant="ghost" onclick={removeLink}>Remove</Button>{/if}
                <Button size="sm" variant="primary" type="submit">Apply</Button>
              </div>
            </form>
          </Popover>
        {:else if name === 'image'}
          {#if uploadImage}
            <label {...part('tool')} aria-label="Image" onmousedown={(e) => e.preventDefault()}>
              <input {...part('image-input')} type="file" accept="image/*" multiple onchange={pickedImages} />
              <iconify-icon icon="lucide:image" aria-hidden="true"></iconify-icon>
            </label>
          {/if}
        {:else if toolDefs[name]}
          {@const tool = toolDefs[name]}
          <button {...part('tool')} type="button" aria-label={tool.label} aria-pressed={tool.active ? isActive(tool) : undefined}
            disabled={!canRun(tool)} onmousedown={(e) => e.preventDefault()} onclick={() => run(tool)}>
            <iconify-icon icon={tool.icon} aria-hidden="true"></iconify-icon>
          </button>
        {/if}
      {/each}
    </div>
  {/if}
  <div {...part('content')} bind:this={contentEl} style:--min-height={minHeight} style:--max-height={maxHeight ?? 'none'}></div>
  {#if uploading}<div {...part('uploading')}>Uploading…</div>{/if}
  {#if maxLength}<div {...part('count')} data-over={characters >= maxLength || undefined}>{characters} / {maxLength}</div>{/if}
</div>
