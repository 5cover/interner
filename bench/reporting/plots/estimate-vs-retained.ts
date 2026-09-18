import type { TopLevelSpec } from 'vega-lite'
import type { BenchmarkSummary } from '../../types.js'
import { base } from './common.js'

export function estimateVsRetainedSpec(summary: BenchmarkSummary): TopLevelSpec {
  return {
    ...base(summary, 'Structural byte estimate versus retained heap'),
    data: { values: [{ note: 'No calibrated structural-size model is published' }] },
    mark: { type: 'text', fontSize: 16, color: '#666' },
    encoding: { text: { field: 'note', type: 'nominal' } },
  }
}
