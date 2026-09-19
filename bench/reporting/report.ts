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
  symbols: 'Symbols',
  functions: 'Functions',
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
  lines.push(
    '### Serialization and timing',
    '',
    'Percentage deltas use `(after - before) / before * 100`. End-to-end YAML time compares source YAML serialization with `intern()` plus YAML serialization.',
    '',
    '| Measurement | Before | After | Absolute delta | Percentage delta |',
    '| --- | ---: | ---: | ---: | ---: |'
  )
  if (result.serialization.yaml)
    lines.push(
      comparisonRow(
        'YAML UTF-8 bytes',
        result.serialization.yaml.beforeBytes,
        result.serialization.yaml.afterBytes,
        bytes
      )
    )
  if (result.serialization.json)
    lines.push(
      comparisonRow(
        'JSON UTF-8 bytes',
        result.serialization.json.beforeBytes,
        result.serialization.json.afterBytes,
        bytes
      )
    )
  lines.push(
    `| Intern transformation time | n/a | ${milliseconds(result.timing.intern.medianMilliseconds)} | n/a | n/a |`
  )
  if (result.timing.yamlBefore && result.timing.yamlAfter)
    lines.push(
      comparisonRow(
        'YAML serialization time',
        result.timing.yamlBefore.medianMilliseconds,
        result.timing.yamlAfter.medianMilliseconds,
        milliseconds
      )
    )
  if (result.timing.internAndYaml)
    lines.push(
      result.timing.yamlBefore
        ? comparisonRow(
            'End-to-end YAML time',
            result.timing.yamlBefore.medianMilliseconds,
            result.timing.internAndYaml.medianMilliseconds,
            milliseconds
          )
        : `| End-to-end YAML time | n/a | ${milliseconds(result.timing.internAndYaml.medianMilliseconds)} | n/a | n/a |`
    )
  lines.push('')
  return lines
}

function comparisonRow(label: string, before: number, after: number, format: (value: number) => string): string {
  return `| ${label} | ${format(before)} | ${format(after)} | ${format(after - before)} | ${percent(deltaPercent(before, after))} |`
}
