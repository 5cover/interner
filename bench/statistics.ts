import type { TimingMetrics } from './types.js'

export function median(samples: readonly number[]): number {
  if (samples.length === 0) throw new Error('Cannot calculate a median without samples')
  const values = [...samples].sort((a, b) => a - b)
  const middle = Math.floor(values.length / 2)
  return values.length % 2 === 0 ? (values[middle - 1]! + values[middle]!) / 2 : values[middle]!
}

export function timingMetrics(samplesMilliseconds: readonly number[]): TimingMetrics {
  return {
    medianMilliseconds: median(samplesMilliseconds),
    minimumMilliseconds: Math.min(...samplesMilliseconds),
    maximumMilliseconds: Math.max(...samplesMilliseconds),
    samplesMilliseconds,
  }
}

export function deltaPercent(before: number, after: number): number | null {
  return before === 0 ? null : ((after - before) / before) * 100
}
