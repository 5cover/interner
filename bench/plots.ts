import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import type { BenchmarkSummary } from './types.js'
import { plotSpecifications } from './reporting/plots/index.js'
import { renderSvg } from './reporting/render-svg.js'

const input = path.resolve(process.argv[2] ?? 'benchmark-results/latest/summary.json')
const summary = JSON.parse(await readFile(input, 'utf8')) as BenchmarkSummary
const output = path.join(path.dirname(input), 'plots')
await mkdir(output, { recursive: true })
for (const [filename, specification] of Object.entries(plotSpecifications(summary)))
  await renderSvg(specification, path.join(output, filename))
process.stdout.write(`${output}\n`)
