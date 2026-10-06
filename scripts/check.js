// Runs svelte-check and fails only on undefined names ("Cannot find name
// 'dot'"): the bugs a build lets through. The JS isn't typed, so the rest of
// what the type checker says is noise for now.
import { execSync } from 'node:child_process'

let output = ''
try {
  output = execSync('npx svelte-check --workspace . --output machine', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
} catch (error) {
  output = error.stdout ?? ''
}

const problems = output.split('\n').filter((line) => line.includes(' ERROR ') && line.includes('Cannot find name'))
for (const line of problems) console.log(line.replace(/^\d+ ERROR /, ''))
console.log(problems.length ? `\n${problems.length} undefined name(s)` : 'No undefined names')
process.exit(problems.length ? 1 : 0)
