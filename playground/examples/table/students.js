const first = ['Ada', 'Alan', 'Grace', 'Katherine', 'Margaret', 'Tim', 'Edsger', 'Barbara', 'Donald', 'Radia', 'Frances', 'John']
const last = ['Lovelace', 'Turing', 'Hopper', 'Johnson', 'Hamilton', 'Berners-Lee', 'Dijkstra', 'Liskov', 'Knuth', 'Perlman', 'Allen', 'McCarthy']
const subjects = ['Maths', 'English', 'Physics', 'Chemistry']
const statuses = ['Active', 'Active', 'Active', 'Paused', 'New']

// 36 made-up students.
export const students = Array.from({ length: 36 }, (_, i) => {
  const name = `${first[i % 12]} ${last[(i * 5 + Math.floor(i / 12)) % 12]}`
  return {
    id: i + 1, name,
    email: `${name.split(' ')[0].toLowerCase()}${i + 1}@example.com`,
    year: 7 + ((i * 3) % 7),
    subject: subjects[i % 4],
    status: statuses[i % 5],
    lessons: (i * 13) % 40,
    fee: 30 + (i % 4) * 5,
  }
})
