export const actions = [
  { label: 'New lesson', value: 'new-lesson', icon: 'lucide:calendar-plus', shortcut: 'N', group: 'Lessons' },
  { label: 'Reschedule lesson', value: 'reschedule', icon: 'lucide:calendar-clock', group: 'Lessons', keywords: ['move', 'change'] },
  { label: 'Cancel lesson', value: 'cancel', icon: 'lucide:calendar-x', group: 'Lessons' },
  { label: 'Add student', value: 'add-student', icon: 'lucide:user-plus', group: 'Students' },
  { label: 'Import students', value: 'import', icon: 'lucide:upload', group: 'Students', disabled: true, description: 'Coming soon' },
  { label: 'Send invoice', value: 'invoice', icon: 'lucide:receipt', group: 'Billing', keywords: ['payment', 'bill'] },
]
