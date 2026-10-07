// Made-up data for the consultation demo: one veterinary consultation, as in
// perigovet's consultation page.

export const clinic = 'Villeréal'

export const nav = [
  { heading: 'Général', items: [
    { label: 'Tableau de bord', icon: 'lucide:house' },
    { label: 'Tâches', icon: 'lucide:list' },
  ] },
  { heading: 'Services', items: [
    { label: 'Consultations', icon: 'lucide:stethoscope', active: true },
    { label: 'Ventes', icon: 'lucide:shopping-cart' },
  ] },
  { heading: 'Calendriers', items: [
    { label: 'Consultations', icon: 'lucide:calendar' },
    { label: 'Présences', icon: 'lucide:users' },
    { label: 'Gardes', icon: 'lucide:ambulance' },
  ] },
  { heading: 'Patients', items: [
    { label: 'Clients', icon: 'lucide:users' },
    { label: 'Animaux', icon: 'lucide:dog' },
  ] },
  { heading: 'Ressources', items: [
    { label: 'Produits', icon: 'lucide:pill' },
    { label: 'Actes', icon: 'lucide:clipboard-plus' },
    { label: 'Ordonnances', icon: 'lucide:pill-bottle' },
    { label: 'Fichiers', icon: 'lucide:files' },
  ] },
  { heading: 'Comptabilité', items: [
    { label: 'Tableau de bord', icon: 'lucide:chart-no-axes-combined' },
    { label: 'Factures', icon: 'lucide:receipt-text' },
    { label: 'Bons', icon: 'lucide:receipt' },
    { label: 'Paiements', icon: 'lucide:banknote' },
    { label: 'Devis', icon: 'lucide:file-question' },
    { label: 'Avoirs', icon: 'lucide:file-minus' },
  ] },
]

// The top bar's shortcuts.
export const shortcuts = [
  { label: 'Recherche globale (⌘K)', icon: 'lucide:search' },
  { label: 'Factures', icon: 'lucide:receipt-text' },
  { label: 'Paiements', icon: 'lucide:circle-dollar-sign' },
  { label: 'Rechercher des actes', icon: 'lucide:stethoscope' },
  { label: 'Ordonnances', icon: 'lucide:pill' },
  { label: 'Consultations du jour', icon: 'lucide:calendar' },
  { label: 'Historique', icon: 'lucide:history' },
  { label: "Salle d'attente", icon: 'lucide:armchair' },
]

export const consultation = {
  client: 'Patrick Saudrais',
  vet: 'Marie-Pierre Collignon',
  creator: 'Marie-Pierre Collignon',
  created: '02/07/2026 à 11:02',
  date: '02/07/2026',
  time: '11:15 - 11:45',
  status: 'completed',
  alert: 'Some important message about this client',
}

export const statuses = [
  { value: 'pending', label: 'Prévu' },
  { value: 'waiting', label: 'En salle' },
  { value: 'active', label: 'En cours' },
  { value: 'completed', label: 'Terminé' },
  { value: 'cancelled', label: 'Annulé' },
  { value: 'no_show', label: 'Non présenté' },
]

export const animals = [
  { id: 1, name: 'Bovin', title: 'Bovin (Bovin)', species: 'Bovin', motif: null, examens: null, diagnostic: null, traitement: null },
]

export const actes = [
  { id: 1, acte: 'Vaccin TCL + R Primo', animal: 1, pu: 76.69, qty: 1, ttc: 92.05, reminder: 'Rappel dû : 02/07/2027' },
  { id: 2, acte: 'Vaccin CHPPIL4 + R + TCH intra. Eleveur/Association', animal: 1, pu: 53.54, qty: 1, ttc: 64.25, reminder: 'Rappel dû : 23/07/2026' },
  { id: 3, acte: 'KITVIA Test Leptospirose', animal: 1, pu: 29.66, qty: 1, ttc: 35.60 },
]

export const client = { name: 'Patrick Saudrais', email: null, phone: '05 53 36 40 38' }

export const money = (v) => v.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
