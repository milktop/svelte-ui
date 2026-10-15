import { day } from './lessons.js'

export const vets = [
  { id: 'jones', title: 'Dr Jones', role: 'Small animals', color: 'teal' },
  { id: 'patel', title: 'Dr Patel', role: 'Surgery', color: 'purple' },
  { id: 'okafor', title: 'Dr Okafor', role: 'Exotics', color: 'amber' },
  { id: 'nurse', title: 'Nurse Kim', role: 'Vaccinations', color: 'blue' },
]

export const kindColor = { Consult: 'accent', Surgery: 'danger', Vaccination: 'success', 'Check-up': 'neutral' }

const today = day((new Date().getDay() + 6) % 7)
const at = (vet, from, to, pet, species, owner, kind) =>
  ({ id: `${vet}-${from}`, resourceId: vet, start: `${today}T${from}`, end: `${today}T${to}`, title: pet, pet, species, owner, kind, color: kindColor[kind] })

export const appointments = [
  at('jones', '09:00', '09:15', 'Biscuit', 'dog', 'A. Lovelace', 'Consult'),
  at('jones', '09:30', '10:00', 'Mittens', 'cat', 'A. Turing', 'Check-up'),
  at('jones', '11:00', '11:15', 'Rex', 'dog', 'G. Hopper', 'Consult'),
  at('patel', '09:00', '11:30', 'Luna', 'dog', 'K. Johnson', 'Surgery'),
  at('patel', '13:00', '14:00', 'Oscar', 'cat', 'M. Hamilton', 'Surgery'),
  at('okafor', '10:00', '10:30', 'Thumper', 'rabbit', 'T. Berners-Lee', 'Consult'),
  at('okafor', '10:15', '10:45', 'Kiwi', 'bird', 'B. Liskov', 'Check-up'),
  at('nurse', '09:15', '09:30', 'Poppy', 'dog', 'D. Knuth', 'Vaccination'),
  at('nurse', '09:30', '09:45', 'Smudge', 'cat', 'R. Perlman', 'Vaccination'),
  at('nurse', '14:00', '14:15', 'Bella', 'dog', 'F. Allen', 'Vaccination'),
]
