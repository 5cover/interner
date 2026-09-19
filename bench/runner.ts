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
  const source = step(fixture.id, 'create source', fixture.create)
  const quotient = step(fixture.id, 'create quotient', () => intern(source))
  const structure = step(fixture.id, 'measure structure', () => ({
    before: measureStructure(source),
    after: measureStructure(quotient),
  }))
  const json = fixture.capabilities.json
    ? {
        beforeBytes: utf8(step(fixture.id, 'serialize JSON before', () => JSON.stringify(source))),
        afterBytes: utf8(step(fixture.id, 'serialize JSON after', () => JSON.stringify(quotient))),
      }
    : undefined
  const yaml = fixture.capabilities.yaml
    ? {
        beforeBytes: utf8(step(fixture.id, 'serialize YAML before', () => dump(source))),
        afterBytes: utf8(step(fixture.id, 'serialize YAML after', () => dump(quotient))),
      }
    : undefined
  const serialization: BenchmarkResult['serialization'] = { ...(json ? { json } : {}), ...(yaml ? { yaml } : {}) }

  const internTiming = time(fixture.id, 'intern', warmupSamples, timingSamples, fixture.create, intern)
  let yamlBefore: TimingMetrics | undefined
  let yamlAfter: TimingMetrics | undefined
  let internAndYaml: TimingMetrics | undefined
  if (fixture.capabilities.yaml && options.only === 'all') {
    yamlBefore = time(fixture.id, 'YAML before', warmupSamples, timingSamples, fixture.create, dump)
    yamlAfter = time(fixture.id, 'YAML after', warmupSamples, timingSamples, () => intern(fixture.create()), dump)
    internAndYaml = time(fixture.id, 'intern plus YAML', warmupSamples, timingSamples, fixture.create, value =>
      dump(intern(value))
    )
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

function time<T>(
  fixtureId: string,
  label: string,
  warmups: number,
  samples: number,
  prepare: () => T,
  operation: (value: T) => unknown
): TimingMetrics {
  for (let index = 0; index < warmups; index++)
    run(fixtureId, `${label} warmup ${index + 1}/${warmups}`, prepare, operation)
  const durations: number[] = []
  for (let index = 0; index < samples; index++) {
    durations.push(run(fixtureId, `${label} sample ${index + 1}/${samples}`, prepare, operation, true))
  }
  return timingMetrics(durations)
}

function run<T>(
  fixtureId: string,
  label: string,
  prepare: () => T,
  operation: (value: T) => unknown,
  collect = false
): number {
  process.stderr.write(`  [${fixtureId}] ${label}: prepare`)
  try {
    const value = prepare()
    process.stderr.write(', run')
    if (collect) global.gc?.()
    const start = performance.now()
    operation(value)
    const duration = performance.now() - start
    process.stderr.write(`, ${duration.toFixed(2)} ms\n`)
    return duration
  } catch (error) {
    process.stderr.write(', failed\n')
    throw error
  }
}

function step<T>(fixtureId: string, label: string, operation: () => T): T {
  process.stderr.write(`  [${fixtureId}] ${label}: run`)
  try {
    const start = performance.now()
    const result = operation()
    process.stderr.write(`, ${(performance.now() - start).toFixed(2)} ms\n`)
    return result
  } catch (error) {
    process.stderr.write(', failed\n')
    throw error
  }
}
