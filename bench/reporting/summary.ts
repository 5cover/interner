import { deltaPercent } from '../statistics.js'
import type { BenchmarkRun, BenchmarkSummary, SummaryFixture } from '../types.js'

export function summarize(run: BenchmarkRun): BenchmarkSummary {
  return {
    schemaVersion: run.schemaVersion,
    run: run.run,
    environment: run.environment,
    fixtures: run.results.map(result => {
      const yaml = result.serialization.yaml
      const beforeHeap = result.retainedHeap.beforeBytes
      const afterHeap = result.retainedHeap.afterBytes
      return {
        id: result.fixture.id,
        family: result.fixture.family,
        description: result.fixture.description,
        ...(result.fixture.parameters ? { parameters: result.fixture.parameters } : {}),
        referenceNodes: pair(result.structure.before.totalReferenceNodes, result.structure.after.totalReferenceNodes),
        edges: pair(result.structure.before.edges, result.structure.after.edges),
        retainedHeap: {
          before: beforeHeap,
          after: afterHeap,
          deltaPercent: beforeHeap === null || afterHeap === null ? null : deltaPercent(beforeHeap, afterHeap),
        },
        yaml: {
          before: yaml?.beforeBytes ?? null,
          after: yaml?.afterBytes ?? null,
          deltaPercent: yaml ? deltaPercent(yaml.beforeBytes, yaml.afterBytes) : null,
        },
        internMedianMilliseconds: result.timing.intern.medianMilliseconds,
        yamlBeforeMedianMilliseconds: result.timing.yamlBefore?.medianMilliseconds ?? null,
        yamlAfterMedianMilliseconds: result.timing.yamlAfter?.medianMilliseconds ?? null,
        internAndYamlMedianMilliseconds: result.timing.internAndYaml?.medianMilliseconds ?? null,
      } satisfies SummaryFixture
    }),
  }
}

function pair(before: number, after: number) {
  return { before, after, deltaPercent: deltaPercent(before, after) }
}
