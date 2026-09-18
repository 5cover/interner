import type { TopLevelSpec } from 'vega-lite'
import type { BenchmarkSummary } from '../../types.js'
import { applications, base } from './common.js'

export function retainedSizeSpec(summary: BenchmarkSummary): TopLevelSpec {
  const values = applications(summary).flatMap(fixture =>
    fixture.retainedHeap.before === null
      ? []
      : [
          { fixture: fixture.id, state: 'Before', bytes: fixture.retainedHeap.before },
          { fixture: fixture.id, state: 'Interned', bytes: fixture.retainedHeap.after },
        ]
  )
  return {
    ...base(summary, 'V8 retained heap for application fixtures'),
    data: { values },
    mark: { type: 'bar', tooltip: true },
    encoding: {
      x: { field: 'fixture', type: 'nominal', sort: null, axis: { labelAngle: -25 } },
      xOffset: { field: 'state' },
      y: { field: 'bytes', type: 'quantitative', title: 'Retained bytes' },
      color: { field: 'state', type: 'nominal', scale: { range: ['#778da9', '#2a9d8f'] } },
    },
  }
}
