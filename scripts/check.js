// Compiles every component and example, then runs svelte-check and fails on
// undefined names ("Cannot find name 'dot'"): the bugs a build lets through
// until the page loads (a compile error 500s the module; an undefined name
// blanks the page). The JS isn't typed, so the rest of what the type checker
// says is noise for now.
import { execSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { compile } from 'svelte/compiler'

const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
  entry.isDirectory() ? files(join(dir, entry.name)) : entry.name.endsWith('.svelte') ? [join(dir, entry.name)] : [])

const compileErrors = []
for (const file of [...files('src'), ...files('playground')]) {
  try {
    compile(readFileSync(file, 'utf8'), { filename: file, generate: 'client' })
  } catch (error) {
    compileErrors.push(`${file}:${error.start?.line ?? '?'}: ${error.message.split('\n')[0]}`)
  }
}
for (const line of compileErrors) console.log(line)

let output = ''
try {
  output = execSync('npx svelte-check --workspace . --output machine', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
} catch (error) {
  output = error.stdout ?? ''
}

const problems = output.split('\n').filter((line) => line.includes(' ERROR ') && line.includes('Cannot find name'))
for (const line of problems) console.log(line.replace(/^\d+ ERROR /, ''))
console.log(compileErrors.length ? `${compileErrors.length} compile error(s)` : 'Everything compiles')
console.log(problems.length ? `${problems.length} undefined name(s)` : 'No undefined names')
process.exit(problems.length || compileErrors.length ? 1 : 0)
