<!--
  The files added to a page or form, as a grid of tiles (image thumbnails, or
  an icon and the extension) or a compact list.

  <Attachments bind:items={files} removable addable />

  - `items`: bindable; plain objects `{ name, size (bytes, or text), type
    (MIME), url, thumb }` or File objects (e.g. from FileUpload or an
    <input type=file>), which are previewed locally
  - `layout`: 'grid' (default) or 'list'
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
-->
<script>
  import 'iconify-icon'
  import Dialog from '../dialog/Dialog.svelte'
  import { cx, partsOf } from '../utils.js'
  import '../theme.css'
  import './attachments.css'

  let {
    items = $bindable([]), layout = 'grid', removable = false, addable = false, accept = null, addLabel = 'Add files',
    emptyText = null, maxFiles = null, columns = null, maxFileSize = null, onremove = null, onadd = null, onreject = null,
    class: className = '', classes = {}, ...rest
  } = $props()

  const part = partsOf('attachments', () => classes)

  // Local previews for Files, made once each.
  const urls = new WeakMap()
  function localUrl(file) {
    if (!urls.has(file)) urls.set(file, URL.createObjectURL(file))
    return urls.get(file)
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${Number((bytes / 1024 / 1024).toFixed(1))} MB`
  }

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
    const file = typeof File !== 'undefined' && item instanceof File
    const url = file ? localUrl(item) : item.url
    const type = item.type ?? ''
    const name = item.name || 'Untitled'
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
      if (!accepts(file)) bad.push({ file, reason: 'not an accepted type' })
      else if (maxFileSize && file.size > maxFileSize) bad.push({ file, reason: `over ${formatSize(maxFileSize)}` })
      else if (maxFiles && count + ok.length >= maxFiles) bad.push({ file, reason: `the limit is ${maxFiles} files` })
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
  const hasFiles = (e) => addable && Array.from(e.dataTransfer?.types ?? []).includes('Files')
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
  data-add-wide={addWide || undefined} data-fixed={columns ? '' : undefined} style:--columns={columns}
  ondragenter={dragOver} ondragover={dragOver} ondragleave={dragLeave} ondrop={dropped} role="group">
  {#if !list.length && !addable && emptyText}<p {...part('empty')}>{emptyText}</p>{/if}
  <ul {...part('files')} bind:this={filesEl}>
    {#each list as entry (entry.item)}
      <li {...part('file')}>
        <button {...part('open')} type="button" aria-label="Open {entry.name}" onclick={() => open(entry)}>
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
            <a {...part('action')} href={entry.url} download={entry.name} aria-label="Download {entry.name}"><iconify-icon icon="lucide:download"></iconify-icon></a>
          {/if}
          {#if removable}
            <button {...part('action')} type="button" aria-label="Remove {entry.name}" onclick={() => remove(entry)}><iconify-icon icon="lucide:x"></iconify-icon></button>
          {/if}
        </span>
      </li>
    {/each}
    {#if addable && !atMax}
      <li {...part('file')} data-add>
        <label {...part('add-tile')}>
          <input {...part('add-input')} type="file" multiple={maxFiles !== 1} {accept} onchange={added} />
          <span {...part('add-icon')}><iconify-icon icon="lucide:plus"></iconify-icon></span>
          <span {...part('add-text')}>
            <span {...part('add-label')}>{addLabel}</span>
            {#if !list.length}<span {...part('limit')}>or drop files here</span>{/if}
            {#if maxFiles && list.length}<span {...part('limit')}>{count} of {maxFiles}</span>{/if}
          </span>
        </label>
      </li>
    {/if}
  </ul>
  {#if rejected.length}
    <ul {...part('rejected')} role="alert">
      {#each rejected as item}<li>{item.file.name} wasn’t added: {item.reason}.</li>{/each}
    </ul>
  {/if}
  {#if dragging}
    <div {...part('drop-hint')} aria-hidden="true">
      <iconify-icon icon="lucide:upload"></iconify-icon>
      <span>{atMax ? `The limit is ${maxFiles} files` : 'Drop to add'}</span>
    </div>
  {/if}

  <Dialog size="lg" heading={previewing?.name} bind:open={previewOpen}>
    {#if previewing}<img {...part('preview')} src={previewing.url} alt={previewing.name} />{/if}
    {#snippet footer()}
      {#if previewing}<a {...part('download-link')} href={previewing.url} download={previewing.name}>Download</a>{/if}
    {/snippet}
  </Dialog>
</div>
