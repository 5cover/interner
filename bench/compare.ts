import { readFile } from 'node:fs/promises'
import { deltaPercent } from './statistics.js'
import type { BenchmarkRun } from './types.js'

const [baselinePath, candidatePath] = process.argv.slice(2)
if (!baselinePath || !candidatePath)
  throw new Error('Usage: bench:compare <baseline-results.json> <candidate-results.json>')
const baseline = JSON.parse(await readFile(baselinePath, 'utf8')) as BenchmarkRun
const candidate = JSON.parse(await readFile(candidatePath, 'utf8')) as BenchmarkRun
const baselineById = new Map(baseline.results.map(result => [result.fixture.id, result]))
const comparisons = candidate.results.flatMap(result => {
  const previous = baselineById.get(result.fixture.id)
  if (!previous) return []
  return [
    {
      fixture: result.fixture.id,
      internTimePercent: deltaPercent(
        previous.timing.intern.medianMilliseconds,
        result.timing.intern.medianMilliseconds
      ),
      retainedAfterPercent: nullableDelta(previous.retainedHeap.afterBytes, result.retainedHeap.afterBytes),
      referenceNodesAfterPercent: deltaPercent(
        previous.structure.after.totalReferenceNodes,
        result.structure.after.totalReferenceNodes
      ),
      yamlBytesAfterPercent: nullableDelta(
        previous.serialization.yaml?.afterBytes ?? null,
        result.serialization.yaml?.afterBytes ?? null
      ),
      yamlTimeAfterPercent: nullableDelta(
        previous.timing.yamlAfter?.medianMilliseconds ?? null,
        result.timing.yamlAfter?.medianMilliseconds ?? null
      ),
    },
  ]
})
process.stdout.write(
  `${JSON.stringify({ baseline: baseline.run.id, candidate: candidate.run.id, comparisons }, null, 2)}\n`
)

function nullableDelta(before: number | null, after: number | null): number | null {
  return before === null || after === null ? null : deltaPercent(before, after)
}
