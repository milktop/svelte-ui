// Photos from picsum.photos (fixed by seed): a small thumbnail for the tile
// and a larger one for the preview.
export const photo = (seed) => ({ thumb: `https://picsum.photos/seed/${seed}/400/300`, url: `https://picsum.photos/seed/${seed}/1200/900` })

export const files = [
  { name: 'Field trip.jpg', size: 1153024, type: 'image/jpeg', ...photo('tutor-trip') },
  { name: 'Study notes.jpg', size: 624000, type: 'image/jpeg', ...photo('tutor-notes') },
  { name: 'Library.jpg', size: 810000, type: 'image/jpeg', ...photo('tutor-library') },
  { name: 'Lesson slides.pdf', size: 2516582, type: 'application/pdf' },
  { name: 'Mock results.xlsx', size: 48000 },
  { name: 'Revision notes.docx', size: 132000 },
]
