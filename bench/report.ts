import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { generateArtifacts, updateReadme } from './reporting/generate.js'
import type { BenchmarkRun } from './types.js'

const input = path.resolve(
  process.argv[2]?.startsWith('--')
    ? 'benchmark-results/latest/results.json'
    : (process.argv[2] ?? 'benchmark-results/latest/results.json')
)
const run = JSON.parse(await readFile(input, 'utf8')) as BenchmarkRun
const output = path.dirname(input)
const summary = await generateArtifacts(run, output)
if (process.argv.includes('--readme')) await updateReadme(summary, path.resolve('README.md'))
process.stdout.write(`${path.join(output, 'report.md')}\n`)
