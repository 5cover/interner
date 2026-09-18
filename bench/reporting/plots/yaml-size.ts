import type { TopLevelSpec } from 'vega-lite'
import type { BenchmarkSummary } from '../../types.js'
import { applications, base } from './common.js'

export function yamlSizeSpec(summary: BenchmarkSummary): TopLevelSpec {
  const values = applications(summary).flatMap(fixture =>
    fixture.yaml.before === null
      ? []
      : [
          { fixture: fixture.id, state: 'Before', bytes: fixture.yaml.before },
          { fixture: fixture.id, state: 'Interned', bytes: fixture.yaml.after },
        ]
  )
  return {
    ...base(summary, 'YAML output size for application fixtures'),
    data: { values },
    mark: { type: 'bar', tooltip: true },
    encoding: {
      x: { field: 'fixture', type: 'nominal', sort: null, axis: { labelAngle: -25 } },
      xOffset: { field: 'state' },
      y: { field: 'bytes', type: 'quantitative', title: 'UTF-8 bytes' },
      color: { field: 'state', type: 'nominal', scale: { range: ['#778da9', '#e76f51'] } },
    },
  }
}
