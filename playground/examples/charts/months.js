export const months = [
  { month: 'Apr', revenue: 1240, maths: 22, english: 14, physics: 6 },
  { month: 'May', revenue: 1480, maths: 26, english: 15, physics: 8 },
  { month: 'Jun', revenue: 1310, maths: 24, english: 12, physics: 9 },
  { month: 'Jul', revenue: 860, maths: 14, english: 8, physics: 4 },
  { month: 'Aug', revenue: 720, maths: 11, english: 7, physics: 4 },
  { month: 'Sep', revenue: 1650, maths: 30, english: 16, physics: 10 },
  { month: 'Oct', revenue: 1820, maths: 33, english: 18, physics: 12 },
]

export const subjects = [
  { key: 'maths', label: 'Maths' },
  { key: 'english', label: 'English' },
  { key: 'physics', label: 'Physics' },
]

export const pounds = (v) => `£${v.toLocaleString()}`
