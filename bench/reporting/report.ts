import type { BenchmarkResult, BenchmarkRun, StructuralMetrics } from '../types.js'
import { bytes, integer, milliseconds, percent } from './format.js'
import { deltaPercent } from '../statistics.js'

const metricLabels: Readonly<Record<keyof StructuralMetrics, string>> = {
  objectNodes: 'Object nodes',
  arrayNodes: 'Array nodes',
  dateNodes: 'Date nodes',
  regexpNodes: 'RegExp nodes',
  edges: 'Edges',
  objectProperties: 'Object properties',
  arrayElements: 'Array elements',
  arrayHoles: 'Array holes',
  strings: 'String occurrences',
  stringCodeUnits: 'String code units',
  numbers: 'Numbers',
  bigints: 'BigInts',
  booleans: 'Booleans',
  nulls: 'Nulls',
  undefineds: 'Undefined values',
  totalReferenceNodes: 'Reference nodes',
}

export function renderReport(run: BenchmarkRun): string {
  const lines = [
    '# Interner benchmark report',
    '',
    `Generated from benchmark schema ${run.schemaVersion} using profile \`${run.run.profile}\`.`,
    '',
    `Runtime: Node ${run.environment.node} (V8 ${run.environment.v8}), ${run.environment.platform}/${run.environment.architecture}.`,
    '',
    '[Machine-readable results](results.json) | [Summary](summary.json)',
    '',
    '## Plots',
    '',
    '![Retained heap reduction](plots/retained-size.svg)',
    '',
    '![YAML output reduction](plots/yaml-size.svg)',
    '',
    '![Intern time](plots/intern-time.svg)',
    '',
    '![Scaling](plots/scaling.svg)',
    '',
    '![Structural reduction versus retained heap](plots/structural-vs-retained.svg)',
    '',
    '![Structural estimate versus retained heap](plots/estimate-vs-retained.svg)',
    '',
  ]
  for (const result of run.results) lines.push(...fixtureSection(result))
  return `${lines.join('\n')}\n`
}

function fixtureSection(result: BenchmarkResult): string[] {
  const beforeHeap = result.retainedHeap.beforeBytes
  const afterHeap = result.retainedHeap.afterBytes
  const lines = [
    `## ${result.fixture.id}`,
    '',
    result.fixture.description,
    '',
    ...(result.fixture.parameters ? [`Parameters: \`${JSON.stringify(result.fixture.parameters)}\``, ''] : []),
    '### Structure',
    '',
    '| Metric | Before | After | Absolute delta | Percentage delta |',
    '| --- | ---: | ---: | ---: | ---: |',
  ]
  for (const key of Object.keys(metricLabels) as Array<keyof StructuralMetrics>) {
    const before = result.structure.before[key]
    const after = result.structure.after[key]
    lines.push(
      `| ${metricLabels[key]} | ${integer(before)} | ${integer(after)} | ${integer(after - before)} | ${percent(deltaPercent(before, after))} |`
    )
  }
  lines.push(
    '',
    '### Retained heap',
    '',
    '| State | Median | Minimum | Maximum | Samples |',
    '| --- | ---: | ---: | ---: | ---: |'
  )
  lines.push(
    `| Before | ${bytes(beforeHeap)} | ${bytes(result.retainedHeap.beforeMinimumBytes)} | ${bytes(result.retainedHeap.beforeMaximumBytes)} | ${result.retainedHeap.beforeSamplesBytes.length} |`
  )
  lines.push(
    `| After | ${bytes(afterHeap)} | ${bytes(result.retainedHeap.afterMinimumBytes)} | ${bytes(result.retainedHeap.afterMaximumBytes)} | ${result.retainedHeap.afterSamplesBytes.length} |`
  )
  lines.push(
    `| Change | ${beforeHeap === null || afterHeap === null ? 'n/a' : bytes(afterHeap - beforeHeap)} | | | ${beforeHeap === null || afterHeap === null ? 'n/a' : percent(deltaPercent(beforeHeap, afterHeap))} |`,
    ''
  )
  lines.push('### Serialization and timing', '', '| Measurement | Before | After |', '| --- | ---: | ---: |')
  if (result.serialization.yaml)
    lines.push(
      `| YAML UTF-8 bytes | ${bytes(result.serialization.yaml.beforeBytes)} | ${bytes(result.serialization.yaml.afterBytes)} |`
    )
  if (result.serialization.json)
    lines.push(
      `| JSON UTF-8 bytes | ${bytes(result.serialization.json.beforeBytes)} | ${bytes(result.serialization.json.afterBytes)} |`
    )
  lines.push(`| Intern time | | ${milliseconds(result.timing.intern.medianMilliseconds)} |`)
  if (result.timing.yamlBefore && result.timing.yamlAfter)
    lines.push(
      `| YAML time | ${milliseconds(result.timing.yamlBefore.medianMilliseconds)} | ${milliseconds(result.timing.yamlAfter.medianMilliseconds)} |`
    )
  if (result.timing.internAndYaml)
    lines.push(`| Intern plus YAML | | ${milliseconds(result.timing.internAndYaml.medianMilliseconds)} |`)
  lines.push('')
  return lines
}
