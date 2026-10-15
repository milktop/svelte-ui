<!--
  The files added to a page or form, as a grid of tiles (image thumbnails, or
  an icon and the extension) or a compact list.

  <Attachments bind:items={files} removable addable />

  - `items`: bindable; plain objects `{ name, size (bytes, or text), type
    (MIME), url, thumb }` or File objects (e.g. from FileUpload or an
    <input type=file>), which are previewed locally
  - `layout`: bindable; 'grid' (default) or 'list'; `onlayoutchange` gets
    the new one when the switch changes it
  - `switchable`: a grid/list switch above the files, so people pick; with
    `persist` (a localStorage key) their choice is remembered
  - `label`: a label above it (skipped inside a Field, whose label, hint and
    error it takes, as the other controls do)
  - `name`: posts the new Files with a plain <form> (a hidden file input);
    `keptName` also posts the `id` of each saved item still in the list, so
    the server can tell what was removed
  - `disabled`: read only (no adding or removing)
  - `columns`: the most tiles per row in the grid; fewer when tiles would get
    too small (without it, as many as fit)
  - `removable`: a remove button on each; `onremove` gets the item
  - `addable`: an "Add files" tile that opens the file picker, and files can
    be dropped onto the attachments; `onadd` gets the Files
  - `accept` (MIME types or extensions, e.g. 'image/*,.pdf'), `maxFiles` and
    `maxFileSize` (bytes) limit what's added; files that don't fit are listed
    with the reason, and `onreject` gets `[{ file, reason }]`
  - `addLabel`, `emptyText`

  Clicking an image opens it large; other files open their `url`, if any, in
  a new tab. Files with a `url` get a download button.

  In a new-record form, start with no items; in an edit form, with the
  record's saved files as plain objects (with an `id`). Files added are Files,
  so on submit: new = items that are Files, kept = the rest, removed = the
  saved ones no longer there.
-->
<script>
  import '../icons.js'
  import Dialog from '../dialog/Dialog.svelte'
  import Segmented from '../segmented/Segmented.svelte'
  import { formatBytes } from '../format/format.js'
  import { cx, partsOf, useField, provideField } from '../utils.js'
  import { uiLocale } from '../locale.svelte.js'
  import '../theme.css'
  import './attachments.css'

  let {
    items = $bindable([]), layout = $bindable('grid'), switchable = false, persist = null, label = null, name = null, keptName = null,
    disabled = false, removable = false, addable = false, accept = null, addLabel = null,
    emptyText = null, maxFiles = null, columns = null, maxFileSize = null, onremove = null, onadd = null, onreject = null, onlayoutchange = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  // Its own parts (the layout switch) aren't the field's control.
  provideField(null)
  const part = partsOf('attachments', () => classes)
  const id = $props.id()
  const t = $derived(uiLocale.messages.attachments)

  // A layout remembered under `persist` wins over the one given.
  if (persist) {
    try {
      const saved = localStorage.getItem(persist)
      if (saved === 'grid' || saved === 'list') layout = saved
    } catch {}
  }
  function setLayout(next) {
    if (!next || next === layout) return
    layout = next
    try { if (persist) localStorage.setItem(persist, next) } catch {}
    onlayoutchange?.(next)
  }
  const layouts = $derived([
    { value: 'grid', label: t.grid, icon: 'lucide:layout-grid' },
    { value: 'list', label: t.list, icon: 'lucide:list' },
  ])

  // Read only: no adding or removing.
  const canAdd = $derived(addable && !disabled)
  const canRemove = $derived(removable && !disabled)
  const isFile = (item) => typeof File !== 'undefined' && item instanceof File

  // Local previews for Files, made once each.
  const urls = new WeakMap()
  function localUrl(file) {
    if (!urls.has(file)) urls.set(file, URL.createObjectURL(file))
    return urls.get(file)
  }

  const formatSize = (bytes) => formatBytes(bytes)

  function iconFor(type, name) {
    const n = name.toLowerCase()
    if (type.startsWith('image/') || /\.(jpe?g|png|gif|webp|avif|svg)$/.test(n)) return 'lucide:image'
    if (type.startsWith('video/') || /\.(mp4|mov|webm)$/.test(n)) return 'lucide:file-video'
    if (type.startsWith('audio/') || /\.(mp3|wav|m4a)$/.test(n)) return 'lucide:file-audio'
    if (/\.(xlsx?|csv|numbers)$/.test(n)) return 'lucide:file-spreadsheet'
    if (/\.(zip|rar|7z|gz)$/.test(n)) return 'lucide:file-archive'
    if (/\.(pdf|docx?|txt|md|pages|rtf)$/.test(n)) return 'lucide:file-text'
    return 'lucide:file'
  }

  // One shape for both plain objects and Files.
  function info(item) {
    const url = isFile(item) ? localUrl(item) : item.url
    const type = item.type ?? ''
    const name = item.name || uiLocale.messages.attachments.untitled
    const image = type.startsWith('image/') || /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(name)
    return {
      item, name, url, image,
      size: typeof item.size === 'number' ? formatSize(item.size) : (item.size ?? ''),
      thumb: item.thumb ?? (image ? url : null),
      ext: (name.match(/\.([a-z0-9]+)$/i)?.[1] ?? '').toUpperCase(),
      icon: iconFor(type, name),
    }
  }

  const list = $derived((items ?? []).map(info))
  const count = $derived((items ?? []).length)
  const atMax = $derived(!!maxFiles && count >= maxFiles)

  function remove(entry) {
    items = (items ?? []).filter((item) => item !== entry.item)
    onremove?.(entry.item)
  }

  // Whether a file matches `accept`: an extension, a type/* or a MIME type.
  function accepts(file) {
    if (!accept) return true
    return accept.split(',').map((rule) => rule.trim().toLowerCase()).filter(Boolean).some((rule) =>
      rule.startsWith('.') ? file.name.toLowerCase().endsWith(rule)
        : rule.endsWith('/*') ? (file.type ?? '').startsWith(rule.slice(0, -1))
        : file.type === rule)
  }

  // Adds what fits (type, size, count); the rest is rejected with a reason.
  let rejected = $state([])
  function addFiles(files) {
    const ok = []
    const bad = []
    for (const file of files) {
      if (!accepts(file)) bad.push({ file, reason: t.notType })
      else if (maxFileSize && file.size > maxFileSize) bad.push({ file, reason: t.over(formatSize(maxFileSize)) })
      else if (maxFiles && count + ok.length >= maxFiles) bad.push({ file, reason: t.limit(maxFiles).replace(/^./, (c) => c.toLowerCase()) })
      else ok.push(file)
    }
    rejected = bad
    if (bad.length) onreject?.(bad)
    if (!ok.length) return
    items = [...(items ?? []), ...ok]
    onadd?.(ok)
  }

  function added(e) {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (files.length) addFiles(files)
  }

  // Dropping files: only while addable, and only for files (not text).
  let root = $state()
  let dragging = $state(false)
  const hasFiles = (e) => canAdd && Array.from(e.dataTransfer?.types ?? []).includes('Files')
  function dragOver(e) {
    if (!hasFiles(e)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = atMax ? 'none' : 'copy'
    dragging = true
  }
  function dragLeave(e) {
    if (!root.contains(e.relatedTarget)) dragging = false
  }
  function dropped(e) {
    if (!hasFiles(e)) return
    e.preventDefault()
    dragging = false
    addFiles(Array.from(e.dataTransfer.files ?? []))
  }

  // The add tile would start a row on its own when the files fill their rows;
  // then it becomes a slim full-width row instead of a big empty tile. The
  // column count is read off the grid, so it works for auto-fill grids too.
  let filesEl = $state()
  let gridColumns = $state(0)
  $effect(() => {
    if (!filesEl) return
    // Again when the layout or the number of files changes.
    layout; columns; list.length
    const measure = () => {
      const tracks = getComputedStyle(filesEl).gridTemplateColumns
      gridColumns = tracks === 'none' ? 0 : tracks.split(' ').filter(Boolean).length
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(filesEl)
    return () => observer.disconnect()
  })
  const addWide = $derived(layout === 'grid' && gridColumns > 0 && list.length > 0 && list.length % gridColumns === 0)

  // For a plain <form>: the new Files, in a hidden file input. A
  // DataTransfer is the only way to set an input's files.
  let posted = $state()
  $effect(() => {
    if (!name || !posted) return
    const transfer = new DataTransfer()
    for (const file of (items ?? []).filter(isFile)) transfer.items.add(file)
    posted.files = transfer.files
  })
  const keptIds = $derived((items ?? []).filter((item) => !isFile(item)).map((item) => item.id).filter((kept) => kept != null))

  const labelledBy = $derived(field ? field.labelId : label ? `${id}-label` : undefined)
  const invalid = $derived(!!field?.invalid)

  let previewing = $state(null)
  let previewOpen = $state(false)
  function open(entry) {
    if (entry.image && entry.url) {
      previewing = entry
      previewOpen = true
    } else if (entry.url) window.open(entry.url, '_blank', 'noopener')
  }
</script>

<div {...rest} {...part('root')} class={cx(className)} bind:this={root} data-layout={layout} data-empty={!list.length || undefined}
  data-add-wide={addWide || undefined} data-fixed={columns ? '' : undefined} data-invalid={invalid || undefined} data-disabled={disabled || undefined}
  style:--columns={columns} ondragenter={dragOver} ondragover={dragOver} ondragleave={dragLeave} ondrop={dropped}
  role="group" aria-labelledby={labelledBy} aria-describedby={field?.describedBy} aria-invalid={invalid ? 'true' : undefined}>
  {#if (label && !field) || switchable}
    <div {...part('header')}>
      {#if label && !field}<span {...part('label')} id="{id}-label">{label}</span>{/if}
      {#if switchable}
        <Segmented size="sm" iconOnly items={layouts} bind:value={() => layout, setLayout} aria-label={t.layout} />
      {/if}
    </div>
  {/if}
  {#if !list.length && !canAdd && emptyText}<p {...part('empty')}>{emptyText}</p>{/if}
  <ul {...part('files')} bind:this={filesEl}>
    {#each list as entry (entry.item)}
      <li {...part('file')}>
        <button {...part('open')} type="button" aria-label={t.open(entry.name)} onclick={() => open(entry)}>
          <span {...part('thumb')}>
            {#if entry.thumb}<img src={entry.thumb} alt="" loading="lazy" />
            {:else}
              <iconify-icon {...part('icon')} icon={entry.icon} aria-hidden="true"></iconify-icon>
              {#if entry.ext}<span {...part('ext')}>{entry.ext}</span>{/if}
            {/if}
          </span>
          <span {...part('meta')}>
            <span {...part('name')}>{entry.name}</span>
            {#if entry.size}<span {...part('size')}>{entry.size}</span>{/if}
          </span>
        </button>
        <span {...part('actions')}>
          {#if entry.url}
            <a {...part('action')} href={entry.url} download={entry.name} aria-label={t.downloadFile(entry.name)}><iconify-icon icon="lucide:download"></iconify-icon></a>
          {/if}
          {#if canRemove}
            <button {...part('action')} type="button" aria-label={uiLocale.messages.common.remove(entry.name)} onclick={() => remove(entry)}><iconify-icon icon="lucide:x"></iconify-icon></button>
          {/if}
        </span>
      </li>
    {/each}
    {#if canAdd && !atMax}
      <li {...part('file')} data-add>
        <label {...part('add-tile')}>
          <input {...part('add-input')} type="file" id={field?.id} multiple={maxFiles !== 1} {accept} onchange={added} />
          <span {...part('add-icon')}><iconify-icon icon="lucide:plus"></iconify-icon></span>
          <span {...part('add-text')}>
            <span {...part('add-label')}>{addLabel ?? t.add}</span>
            {#if !list.length}<span {...part('limit')}>{t.orDrop}</span>{/if}
            {#if maxFiles && list.length}<span {...part('limit')}>{t.count(count, maxFiles)}</span>{/if}
          </span>
        </label>
      </li>
    {/if}
  </ul>
  {#if rejected.length}
    <ul {...part('rejected')} role="alert">
      {#each rejected as item}<li>{t.notAdded(item.file.name, item.reason)}</li>{/each}
    </ul>
  {/if}
  {#if dragging}
    <div {...part('drop-hint')} aria-hidden="true">
      <iconify-icon icon="lucide:upload"></iconify-icon>
      <span>{atMax ? t.limit(maxFiles) : t.dropToAdd}</span>
    </div>
  {/if}

  <Dialog size="lg" heading={previewing?.name} bind:open={previewOpen}>
    {#if previewing}<img {...part('preview')} src={previewing.url} alt={previewing.name} />{/if}
    {#snippet footer()}
      {#if previewing}<a {...part('download-link')} href={previewing.url} download={previewing.name}>{t.download}</a>{/if}
    {/snippet}
  </Dialog>
  {#if name}<input bind:this={posted} type="file" {name} multiple hidden aria-hidden="true" tabindex="-1" />{/if}
  {#if keptName}{#each keptIds as kept}<input type="hidden" name={keptName} value={String(kept)} />{/each}{/if}
</div>
