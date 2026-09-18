import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { BenchmarkRun, BenchmarkSummary } from '../types.js'
import { renderReport } from './report.js'
import { plotSpecifications } from './plots/index.js'
import { renderSvg } from './render-svg.js'
import { summarize } from './summary.js'
import { milliseconds, percent } from './format.js'

export async function generateArtifacts(run: BenchmarkRun, directory: string): Promise<BenchmarkSummary> {
  const summary = summarize(run)
  const plotsDirectory = path.join(directory, 'plots')
  const tablesDirectory = path.join(directory, 'tables')
  await mkdir(plotsDirectory, { recursive: true })
  await mkdir(tablesDirectory, { recursive: true })
  await writeFile(path.join(directory, 'results.json'), json(run))
  await writeFile(path.join(directory, 'summary.json'), json(summary))
  await writeFile(path.join(directory, 'report.md'), renderReport(run))
  await writeFile(path.join(tablesDirectory, 'application.md'), applicationTable(summary))
  for (const [filename, specification] of Object.entries(plotSpecifications(summary)))
    await renderSvg(specification, path.join(plotsDirectory, filename))
  return summary
}

function applicationTable(summary: BenchmarkSummary): string {
  const rows = summary.fixtures
    .filter(fixture => fixture.family === 'application')
    .map(fixture => [
      fixture.id,
      percent(fixture.referenceNodes.deltaPercent),
      percent(fixture.retainedHeap.deltaPercent),
      percent(fixture.yaml.deltaPercent),
      milliseconds(fixture.internMedianMilliseconds),
    ])
  return `${markdownTable(['Fixture', 'Reference nodes', 'V8 retained heap', 'YAML bytes', 'Intern time'], rows)}\n`
}

export async function updateReadme(summary: BenchmarkSummary, readmePath: string): Promise<void> {
  const start = '<!-- benchmark:start -->'
  const end = '<!-- benchmark:end -->'
  const current = await readFile(readmePath, 'utf8')
  const application = summary.fixtures.filter(fixture => fixture.family === 'application')
  const rows = application.map(fixture => [
    fixture.id,
    percent(fixture.referenceNodes.deltaPercent),
    percent(fixture.retainedHeap.deltaPercent),
    percent(fixture.yaml.deltaPercent),
    milliseconds(fixture.internMedianMilliseconds),
  ])
  const fragment = [
    start,
    '',
    `Published profile: \`${summary.run.profile}\`, Node ${summary.environment.nodeMajor}. Exact results depend on the input and runtime.`,
    '',
    markdownTable(['Fixture', 'Reference nodes', 'V8 retained heap', 'YAML bytes', 'Intern time'], rows),
    '',
    '![V8 retained heap](benchmark-results/latest/plots/retained-size.svg)',
    '',
    '![YAML output size](benchmark-results/latest/plots/yaml-size.svg)',
    '',
    '![Intern scaling](benchmark-results/latest/plots/scaling.svg)',
    '',
    '[Methodology](BENCHMARKS.md) | [Full report](benchmark-results/latest/report.md) | [Machine-readable results](benchmark-results/latest/results.json) | [Fixture sources](bench/fixtures)',
    end,
  ].join('\n')
  const startIndex = current.indexOf(start)
  const endIndex = current.indexOf(end)
  if (startIndex < 0 || endIndex < startIndex) throw new Error('README benchmark markers are missing')
  await writeFile(readmePath, `${current.slice(0, startIndex)}${fragment}${current.slice(endIndex + end.length)}`)
}

export function json(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`
}

function markdownTable(headers: readonly string[], rows: readonly (readonly string[])[]): string {
  const widths = headers.map((header, column) =>
    Math.max(header.length, 3, ...rows.map(row => row[column]?.length ?? 0))
  )
  const line = (cells: readonly string[], header = false) =>
    `| ${cells.map((cell, column) => (header || column === 0 ? cell.padEnd(widths[column]!) : cell.padStart(widths[column]!))).join(' | ')} |`
  const separator = widths.map((width, column) => (column === 0 ? '-'.repeat(width) : `${'-'.repeat(width - 1)}:`))
  return [line(headers, true), line(separator, true), ...rows.map(row => line(row))].join('\n')
}
