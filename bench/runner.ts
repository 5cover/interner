import { performance } from 'node:perf_hooks'
import { dump } from 'js-yaml'
import { intern } from '../src/index.js'
import { measureRetainedHeap, unavailableRetainedHeap } from './memory/measure.js'
import { timingMetrics } from './statistics.js'
import { measureStructure } from './structural/measure.js'
import type { BenchmarkEnvironment, BenchmarkFixture, BenchmarkResult, TimingMetrics } from './types.js'

interface RunnerOptions {
  readonly profile: 'quick' | 'full'
  readonly only: 'all' | 'memory'
  readonly environment: BenchmarkEnvironment
  readonly skipMemory: boolean
}

export async function runFixture(fixture: BenchmarkFixture, options: RunnerOptions): Promise<BenchmarkResult> {
  const timingSamples = options.profile === 'quick' ? 7 : 21
  const warmupSamples = options.profile === 'quick' ? 2 : 5
  const source = fixture.create()
  const quotient = intern(source)
  const structure = { before: measureStructure(source), after: measureStructure(quotient) }
  const json = fixture.capabilities.json
    ? { beforeBytes: utf8(JSON.stringify(source)), afterBytes: utf8(JSON.stringify(quotient)) }
    : undefined
  const yaml = fixture.capabilities.yaml
    ? { beforeBytes: utf8(dump(source)), afterBytes: utf8(dump(quotient)) }
    : undefined
  const serialization: BenchmarkResult['serialization'] = { ...(json ? { json } : {}), ...(yaml ? { yaml } : {}) }

  const internTiming = time(warmupSamples, timingSamples, () => {
    intern(fixture.create())
  })
  let yamlBefore: TimingMetrics | undefined
  let yamlAfter: TimingMetrics | undefined
  let internAndYaml: TimingMetrics | undefined
  if (fixture.capabilities.yaml && options.only === 'all') {
    yamlBefore = time(warmupSamples, timingSamples, () => {
      const value = fixture.create()
      dump(value)
    })
    yamlAfter = time(warmupSamples, timingSamples, () => {
      const value = intern(fixture.create())
      dump(value)
    })
    internAndYaml = time(warmupSamples, timingSamples, () => {
      dump(intern(fixture.create()))
    })
  }
  const timing: BenchmarkResult['timing'] = {
    intern: internTiming,
    ...(yamlBefore ? { yamlBefore } : {}),
    ...(yamlAfter ? { yamlAfter } : {}),
    ...(internAndYaml ? { internAndYaml } : {}),
  }
  const retainedHeap = options.skipMemory
    ? unavailableRetainedHeap()
    : await measureRetainedHeap(fixture.id, options.profile, options.profile === 'quick' ? 1 : 3)
  return {
    fixture: {
      id: fixture.id,
      family: fixture.family,
      description: fixture.description,
      ...(fixture.parameters ? { parameters: fixture.parameters } : {}),
    },
    environment: options.environment,
    structure,
    retainedHeap,
    serialization,
    timing,
  }
}

function utf8(text: string): number {
  return Buffer.byteLength(text, 'utf8')
}

function time(warmups: number, samples: number, operation: () => void): TimingMetrics {
  for (let index = 0; index < warmups; index++) operation()
  const durations: number[] = []
  for (let index = 0; index < samples; index++) {
    global.gc?.()
    const start = performance.now()
    operation()
    durations.push(performance.now() - start)
  }
  return timingMetrics(durations)
}
