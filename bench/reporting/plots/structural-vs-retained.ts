import type { TopLevelSpec } from 'vega-lite'
import type { BenchmarkSummary } from '../../types.js'
import { base } from './common.js'

export function structuralVsRetainedSpec(summary: BenchmarkSummary): TopLevelSpec {
  const values = summary.fixtures.flatMap(fixture =>
    fixture.referenceNodes.deltaPercent === null || fixture.retainedHeap.deltaPercent === null
      ? []
      : [
          {
            fixture: fixture.id,
            structure: -fixture.referenceNodes.deltaPercent,
            retained: -fixture.retainedHeap.deltaPercent,
            family: fixture.family,
          },
        ]
  )
  return {
    ...base(summary, 'Structural reduction versus retained heap reduction'),
    data: { values },
    mark: { type: 'point', filled: true, size: 90, tooltip: true },
    encoding: {
      x: { field: 'structure', type: 'quantitative', title: 'Reference-node reduction (%)' },
      y: { field: 'retained', type: 'quantitative', title: 'Retained-heap reduction (%)' },
      color: { field: 'family', type: 'nominal' },
    },
  }
}
