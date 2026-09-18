import type { TopLevelSpec } from 'vega-lite'
import type { BenchmarkSummary } from '../../types.js'
import { base } from './common.js'

export function scalingSpec(summary: BenchmarkSummary): TopLevelSpec {
  const values = summary.fixtures.flatMap(fixture =>
    fixture.parameters?.scalingFamily
      ? [
          {
            nodes: fixture.referenceNodes.before,
            milliseconds: fixture.internMedianMilliseconds,
            family: String(fixture.parameters.scalingFamily),
          },
        ]
      : []
  )
  return {
    ...base(summary, 'Intern time versus source graph size'),
    data: { values },
    mark: { type: 'line', point: true, tooltip: true },
    encoding: {
      x: { field: 'nodes', type: 'quantitative', title: 'Source reference nodes' },
      y: { field: 'milliseconds', type: 'quantitative', title: 'Median milliseconds' },
      color: { field: 'family', type: 'nominal' },
    },
  }
}
