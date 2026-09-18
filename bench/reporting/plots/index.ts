import type { TopLevelSpec } from 'vega-lite'
import type { BenchmarkSummary } from '../../types.js'
import { estimateVsRetainedSpec } from './estimate-vs-retained.js'
import { internTimeSpec } from './intern-time.js'
import { retainedSizeSpec } from './retained-size.js'
import { scalingSpec } from './scaling.js'
import { structuralVsRetainedSpec } from './structural-vs-retained.js'
import { yamlSizeSpec } from './yaml-size.js'

export function plotSpecifications(summary: BenchmarkSummary): Readonly<Record<string, TopLevelSpec>> {
  return {
    'retained-size.svg': retainedSizeSpec(summary),
    'yaml-size.svg': yamlSizeSpec(summary),
    'intern-time.svg': internTimeSpec(summary),
    'scaling.svg': scalingSpec(summary),
    'structural-vs-retained.svg': structuralVsRetainedSpec(summary),
    'estimate-vs-retained.svg': estimateVsRetainedSpec(summary),
  }
}
