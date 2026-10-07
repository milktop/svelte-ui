<!-- perigovet's consultation page: the app's components (app/) on svelte-ui,
     filled with one consultation. -->
<script>
  import { Menu, MenuItem, MenuSeparator, Button, Select, Tooltip, Tab, Banner, Avatar, Sheet, Segmented, toaster } from '@milktop/svelte-ui'
  import AppLayout from './app/AppLayout.svelte'
  import AppPageHeader from './app/AppPageHeader.svelte'
  import AppPageLayout from './app/AppPageLayout.svelte'
  import AppBlock from './app/AppBlock.svelte'
  import AppTabs from './app/AppTabs.svelte'
  import AppTable from './app/AppTable.svelte'
  import AppIconButton from './app/AppIconButton.svelte'
  import AppMenuButton from './app/AppMenuButton.svelte'
  import { clinic, nav, shortcuts, consultation, statuses, animals, actes, client, money } from './consultation-data.js'

  // The page and its components' sources, for the Code view.
  const sources = import.meta.glob(['./Consultation.svelte', './app/*.svelte'], { query: '?raw', import: 'default', eager: true })
  const files = Object.keys(sources).map((path) => ({ value: path, label: path.replace('./', '') }))

  let status = $state(consultation.status)
  let tab = $state(animals[0].id)
  let alertOpen = $state(true)
  let rows = $state(actes.map((a) => ({ ...a })))
  let codeOpen = $state(false)
  let codeFile = $state('./Consultation.svelte')

  const done = (title) => toaster.info({ title })
  const animalItems = [{ value: null, label: 'Aucun' }, ...animals.map((a) => ({ value: a.id, label: a.name }))]
  const notes = [['Motif', 'motif', 'Aucun motif défini'], ['Examens', 'examens', 'Aucun examen défini'],
    ['Diagnostic', 'diagnostic', 'Aucun diagnostic défini'], ['Traitement', 'traitement', 'Aucun traitement défini']]
  const quickLinks = [['lucide:search', "Rechercher l'animal"], ['lucide:stethoscope', 'Consultations'], ['lucide:pill', 'Ordonnances'],
    ['lucide:notebook', 'Notes'], ['lucide:bug', 'Affections'], ['lucide:scale', 'Poids'], ['lucide:bell', 'Rappels'],
    ['lucide:paperclip', 'Fichiers'], ['lucide:external-link', "Vers la fiche de l'animal"]]
  const clientLinks = [['lucide:info', 'Information'], ['lucide:stethoscope', 'Consultations'], ['lucide:file-text', 'Factures'],
    ['lucide:file-pen', 'Devis'], ['lucide:notebook', 'Notes'], ['lucide:hand-coins', 'Encaisser'], ['lucide:external-link', 'Fiche client']]
</script>

{#snippet iconButton(icon, hint, onclick = () => done(hint))}
  <Tooltip content={hint}>
    {#snippet trigger(props)}<AppIconButton {...props} {icon} aria-label={hint} onclick={(e) => { props.onclick?.(e); onclick() }} />{/snippet}
  </Tooltip>
{/snippet}

<AppLayout {clinic} {nav} {shortcuts}>
  {#snippet topbarEnd()}
    <Menu placement="bottom-end" onselect={done}>
      {#snippet trigger(props)}
        <Button {...props} variant="ghost" size="sm">
          <span class="flex items-center gap-2 text-[13px] font-normal text-gray-700">Andre Goldstein
            <Avatar name="Andre Goldstein" size="sm" class="bg-gray-700 text-white" /></span>
        </Button>
      {/snippet}
      <MenuItem icon="lucide:user">Mon profil</MenuItem>
      <MenuSeparator />
      <MenuItem icon="lucide:log-out">Déconnexion</MenuItem>
    </Menu>
    {@render iconButton('lucide:list-todo', 'Tâches')}
    {@render iconButton('lucide:mail', 'Envois')}
  {/snippet}

  <!-- The client warning: fixed at the top, over the top bar, as in the app. -->
  <Banner variant="danger" icon="lucide:circle-alert" dismissible bind:open={alertOpen}
    class="fixed top-3 left-1/2 z-60 min-h-0 w-auto max-w-[calc(100vw-2rem)] -translate-x-1/2 gap-3 rounded-md bg-red-100 px-4 py-2.5 text-[13px] font-semibold text-red-900">
    {consultation.alert}
  </Banner>

  <AppPageHeader title={client.name} links={[{ text: 'Consultations', href: '#/demo/consultation' }]}
    subtitle="{clinic} - {consultation.vet} - {consultation.date} à {consultation.time}">
    {#snippet icons()}{@render iconButton('lucide:calendar', 'Consultation au cabinet')}{/snippet}
    <!-- The status: a small outlined button in the status's colour. -->
    <Select size="sm" items={statuses} bind:value={status} class="min-w-28"
      classes={{ trigger: 'min-h-0 h-auto py-1.5 pl-3 pr-2 border-teal-500 text-teal-500 text-[12px] rounded-sm' }} />
    <Menu placement="bottom-end" label="Consultation" onselect={done}>
      {#snippet trigger(props)}<AppMenuButton {...props} icon="lucide:settings" aria-label="Options" />{/snippet}
      <MenuItem icon="lucide:pencil">Modifier</MenuItem>
      <MenuItem icon="lucide:copy">Dupliquer</MenuItem>
      <MenuSeparator />
      <MenuItem icon="lucide:trash-2" danger>Supprimer</MenuItem>
    </Menu>
    <Menu placement="bottom-end" label="Imprimer" onselect={done}>
      {#snippet trigger(props)}<AppMenuButton {...props} icon="lucide:printer" aria-label="Imprimer" count={1} countColor="accent" countLabel="à imprimer" />{/snippet}
      <MenuItem icon="lucide:file-text">Ordonnance</MenuItem>
      <MenuItem icon="lucide:receipt">Facture</MenuItem>
    </Menu>
    <Menu placement="bottom-end" label="Notes" onselect={done}>
      {#snippet trigger(props)}<AppMenuButton {...props} icon="lucide:notebook" aria-label="Notes" count={1} countColor="accent" countLabel="note" />{/snippet}
      <MenuItem icon="lucide:plus">Nouvelle note</MenuItem>
    </Menu>
    <Menu placement="bottom-end" onselect={done}>
      {#snippet trigger(props)}<AppMenuButton {...props} icon="lucide:paperclip" aria-label="Fichiers" />{/snippet}
      <MenuItem icon="lucide:upload">Ajouter un fichier</MenuItem>
    </Menu>
    <Menu placement="bottom-end" onselect={done}>
      {#snippet trigger(props)}<AppMenuButton {...props} icon="lucide:panels-top-left" aria-label="Blocs" />{/snippet}
      <MenuItem icon="lucide:eye">Afficher tous les blocs</MenuItem>
    </Menu>
  </AppPageHeader>

  <AppPageLayout>
    {#snippet main()}
      <!-- The animals' notes, a tab per animal. -->
      <AppBlock flush>
        <AppTabs bind:value={tab}>
          {#each animals as animal (animal.id)}
            <Tab value={animal.id} label={animal.name} icon="lucide:info">
              <div class="grid grid-cols-2 gap-x-12 gap-y-10 p-6">
                {#each notes as [label, key, blank]}
                  <section>
                    <h6 class="m-0 mb-2 text-[13px] font-normal text-gray-900 italic underline">{label}</h6>
                    <button type="button" onclick={() => done(`Modifier : ${label}`)}
                      class="cursor-pointer border-0 bg-transparent p-0 text-left text-sm text-gray-500/80 hover:underline">{animal[key] ?? `(${blank})`}</button>
                  </section>
                {/each}
              </div>
            </Tab>
          {/each}
        </AppTabs>
      </AppBlock>

      <AppBlock title="Actes" flush>
        {#snippet icons()}{@render iconButton('lucide:lock', 'Verrouillé')}{/snippet}
        <div class="py-6">
          <AppTable>
            <table>
              <thead>
                <tr><th class="w-[38%] pl-8!">Acte</th><th class="w-[20%]">Animal</th><th class="w-[15%]" data-align="center">PU HT</th>
                  <th class="w-[12%]" data-align="center">Qté</th><th class="w-[15%]" data-align="center">Prix TTC</th></tr>
              </thead>
              <tbody>
                {#each rows as row (row.id)}
                  <tr>
                    <td class="relative pl-8!">
                      {#if row.reminder}
                        <!-- A reminder: a small yellow tab on the row's left edge. -->
                        <Tooltip content={row.reminder}>
                          {#snippet trigger(props)}
                            <span {...props} tabindex="0" aria-label={row.reminder}
                              class="absolute top-1/2 left-0 grid -translate-y-1/2 cursor-help place-items-center rounded-r-md border border-l-0 border-yellow-200/60 bg-yellow-100/60 py-1 pr-1 pl-1.5 text-[12px] text-yellow-800">
                              <iconify-icon icon="lucide:bell"></iconify-icon>
                            </span>
                          {/snippet}
                        </Tooltip>
                      {/if}
                      <span class="block max-w-72 truncate hover:underline" title={row.acte}>{row.acte}</span>
                    </td>
                    <td>
                      <!-- The animal, as plain text with a chevron. -->
                      <Select size="sm" items={animalItems} bind:value={row.animal} class="min-w-0"
                        classes={{ trigger: 'min-h-0 h-auto p-0 border-0 bg-transparent text-[13px] text-inherit gap-1' }} />
                    </td>
                    <td data-align="center">{money(row.pu)}</td>
                    <td data-align="center">{row.qty.toFixed(1)}</td>
                    <td data-align="center">{money(row.ttc)}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </AppTable>
        </div>
      </AppBlock>

      <AppBlock title="Produits">
        {#snippet icons()}{@render iconButton('lucide:lock', 'Verrouillé')}{/snippet}
        <button type="button" onclick={() => done('Ajouter des produits')}
          class="cursor-pointer border-0 bg-transparent p-0 text-[13px] text-gray-500 underline hover:text-gray-700">Ajouter des produits</button>
      </AppBlock>

      <AppBlock title="Rappels envoyés" />
      <p class="m-0 text-[12px] text-gray-500 italic">Créée par {consultation.creator} le {consultation.created}</p>
    {/snippet}

    {#snippet aside()}
      <AppBlock title="Animaux">
        {#snippet icons()}
          {@render iconButton('lucide:settings', 'Associer les animaux')}
          {@render iconButton('lucide:circle-plus', 'Créer un nouvel animal')}
        {/snippet}
        {#each animals as animal (animal.id)}
          <div class="flex items-center justify-between gap-2">
            <span class="min-w-0 text-xs whitespace-nowrap text-gray-500">{animal.title}</span>
            <div class="flex items-center gap-2">
              {#each quickLinks as [icon, hint]}{@render iconButton(icon, hint)}{/each}
            </div>
          </div>
        {/each}
      </AppBlock>

      <AppBlock title="Client">
        {#snippet icons()}{#each clientLinks as [icon, hint]}{@render iconButton(icon, hint)}{/each}{/snippet}
        {#each [['Nom', client.name, '#/demo/consultation'], ['Email', client.email ?? '-', null], ['Phone', client.phone, `tel:${client.phone.replaceAll(' ', '')}`]] as [label, value, href]}
          <div class="flex items-center justify-between text-[13px] not-last:mb-[0.6rem] not-last:border-b not-last:border-gray-100 not-last:pb-[0.65rem]">
            <span class="w-[30%] text-gray-500/90">{label}</span>
            {#if href}<a {href} class="text-right text-gray-500 no-underline hover:underline">{value}</a>{:else}<span class="text-right text-gray-500">{value}</span>{/if}
          </div>
        {/each}
      </AppBlock>

      <AppBlock title="Bon" />
      <AppBlock title="Lieu de la consultation" />
      <AppBlock title="Résumé financier" />
    {/snippet}
  </AppPageLayout>
</AppLayout>

<!-- The playground's own switch, floating in the corner (not part of the page). -->
<div class="fixed right-4 bottom-4 z-40 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
  <Button size="sm" variant="ghost" icon="lucide:arrow-left" onclick={() => (location.hash = '#/blocks/dashboard')}>Playground</Button>
  <Button size="sm" icon="lucide:code" onclick={() => (codeOpen = true)}>Code</Button>
</div>
<Sheet heading="The page and its components" description="Consultation.svelte is the page; app/ holds the app components it is made of." size="lg" bind:open={codeOpen}>
  <Segmented size="sm" items={files} bind:value={codeFile} class="mb-4" />
  <pre class="m-0 overflow-x-auto text-xs leading-relaxed [tab-size:2]"><code>{sources[codeFile]}</code></pre>
</Sheet>
