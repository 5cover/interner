import type { BenchmarkSummary } from '../../types.js'

export function base(summary: BenchmarkSummary, title: string) {
  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    title: { text: title, subtitle: `Node ${summary.environment.nodeMajor}, ${summary.run.profile} profile` },
    width: 700,
    height: 360,
    config: {
      background: 'white',
      axis: { labelFont: 'sans-serif', titleFont: 'sans-serif' },
      title: { font: 'sans-serif' },
      legend: { labelFont: 'sans-serif', titleFont: 'sans-serif' },
    },
  }
}

export function applications(summary: BenchmarkSummary) {
  return summary.fixtures.filter(fixture => fixture.family === 'application')
}
