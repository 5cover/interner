import type { TopLevelSpec } from 'vega-lite'
import type { BenchmarkSummary } from '../../types.js'
import { base } from './common.js'

export function internTimeSpec(summary: BenchmarkSummary): TopLevelSpec {
  const values = summary.fixtures.map(fixture => ({
    fixture: fixture.id,
    milliseconds: fixture.internMedianMilliseconds,
  }))
  return {
    ...base(summary, 'Median intern time'),
    data: { values },
    mark: { type: 'bar', color: '#264653', tooltip: true },
    encoding: {
      x: { field: 'fixture', type: 'nominal', sort: null, axis: { labelAngle: -35 } },
      y: { field: 'milliseconds', type: 'quantitative', title: 'Milliseconds' },
    },
  }
}
