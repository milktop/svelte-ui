export const clinic = [
  { value: 'north', label: 'North clinic', icon: 'lucide:building-2', children: [
    { value: 'north-consult-1', label: 'Consult room 1', icon: 'lucide:door-open' },
    { value: 'north-consult-2', label: 'Consult room 2', icon: 'lucide:door-open' },
    { value: 'north-theatre', label: 'Theatre', icon: 'lucide:scissors' },
  ] },
  { value: 'south', label: 'South clinic', icon: 'lucide:building-2', children: [
    { value: 'south-consult', label: 'Consult room', icon: 'lucide:door-open' },
    { value: 'south-kennels', label: 'Kennels', children: [
      { value: 'south-kennels-dogs', label: 'Dogs' }, { value: 'south-kennels-cats', label: 'Cats' },
    ] },
  ] },
  { value: 'mobile', label: 'Mobile van', icon: 'lucide:truck', disabled: true },
]
