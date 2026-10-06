<!--
  A file upload: drop files on it or browse, then see and remove them.

  <FileUpload label="Worksheets" bind:files accept=".pdf" maxFiles={5} hint="PDFs, up to 5" />

  - `files`: bindable array of the accepted Files
  - `accept`: types to allow ('image/*', '.pdf', or an array of them)
  - `maxFiles`: how many (1); `maxFileSize`: in bytes
  - `hint`: text under the prompt
  - `name`: for plain form posts
-->
<script>
  import * as fileUpload from '@zag-js/file-upload'
  import { useMachine, normalizeProps } from '@zag-js/svelte'
  import 'iconify-icon'
  import { cx, partsOf, useField, fieldAttrs } from '../utils.js'
  import '../theme.css'
  import './file-upload.css'

  let {
    label = null, files = $bindable([]), accept = undefined, maxFiles = 1, maxFileSize = undefined, hint = null,
    name = null, disabled = false, class: className = '', classes = {}, ...rest
  } = $props()

  const field = useField()
  const part = partsOf('file-upload', () => classes)
  const id = $props.id()
  const service = useMachine(fileUpload.machine, () => ({
    id, name, disabled, accept, maxFiles, maxFileSize, acceptedFiles: files,
    invalid: !!field?.invalid,
    onFileChange: (details) => { files = details.acceptedFiles },
  }))
  const api = $derived(fileUpload.connect(service, normalizeProps))

  const urls = new WeakMap()
  const urlOf = (file) => urls.get(file) ?? urls.set(file, URL.createObjectURL(file)).get(file)
  const size = (bytes) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1048576).toFixed(1)} MB`
  const reasons = { FILE_INVALID_TYPE: 'Not an allowed type', FILE_TOO_LARGE: 'Too large', TOO_MANY_FILES: 'Too many files', FILE_TOO_SMALL: 'Too small' }
</script>

<div {...rest} {...part('root')} {...api.getRootProps()} class={cx(className)}>
  {#if label && !field}<label {...part('label')} {...api.getLabelProps()}>{label}</label>{/if}
  <div {...part('dropzone')} {...api.getDropzoneProps()} {...fieldAttrs(field)}>
    <iconify-icon {...part('icon')} icon="lucide:upload" aria-hidden="true"></iconify-icon>
    <span {...part('prompt')}>Drop {maxFiles > 1 ? 'files' : 'a file'} here or <button {...part('browse')} {...api.getTriggerProps()}>browse</button></span>
    {#if hint}<span {...part('hint')}>{hint}</span>{/if}
  </div>
  <input {...api.getHiddenInputProps()} id={field?.id} />

  {#if api.acceptedFiles.length || api.rejectedFiles.length}
    <ul {...part('files')} {...api.getItemGroupProps()}>
      {#each api.acceptedFiles as file (file)}
        <li {...part('file')} {...api.getItemProps({ file })}>
          <span {...part('preview')} {...api.getItemPreviewProps({ file })}>
            {#if file.type.startsWith('image/')}<img {...api.getItemPreviewImageProps({ file, url: urlOf(file) })} alt="" />
            {:else}<iconify-icon icon="lucide:file" aria-hidden="true"></iconify-icon>{/if}
          </span>
          <span {...part('name')} {...api.getItemNameProps({ file })}>{file.name}</span>
          <span {...part('size')}>{size(file.size)}</span>
          <button {...part('remove')} {...api.getItemDeleteTriggerProps({ file })}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </li>
      {/each}
      {#each api.rejectedFiles as { file, errors } (file)}
        <li {...part('file')} {...api.getItemProps({ file, type: 'rejected' })} data-rejected>
          <span {...part('preview')} {...api.getItemPreviewProps({ file, type: 'rejected' })}><iconify-icon icon="lucide:file-x" aria-hidden="true"></iconify-icon></span>
          <span {...part('name')} {...api.getItemNameProps({ file, type: 'rejected' })}>{file.name}</span>
          <span {...part('reason')}>{errors.map((e) => reasons[e] ?? e).join(', ')}</span>
          <button {...part('remove')} {...api.getItemDeleteTriggerProps({ file, type: 'rejected' })}><iconify-icon icon="lucide:x"></iconify-icon></button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
