import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { benchmarkEnvironment } from './environment.js'
import { fixturesForProfile } from './fixtures/index.js'
import { generateArtifacts, json } from './reporting/generate.js'
import { runFixture } from './runner.js'
import { BENCHMARK_SCHEMA_VERSION, type BenchmarkRun } from './types.js'

const options = parseArguments(process.argv.slice(2))
const environment = benchmarkEnvironment()
const createdAt = new Date().toISOString()
const runId = `${createdAt.replaceAll(':', '-').replace('.000', '')}-${environment.commit?.slice(0, 8) ?? 'working-tree'}`
const rawDirectory = path.resolve('benchmark-results', 'raw', runId)
const latestDirectory = path.resolve('benchmark-results', 'latest')
await mkdir(rawDirectory, { recursive: true })
const results = []
const fixtures = fixturesForProfile(options.profile)
for (const [index, fixture] of fixtures.entries()) {
  const label = `[${index + 1}/${fixtures.length}] ${fixture.id}`
  process.stderr.write(`${label}: start\n`)
  const start = performance.now()
  results.push(await runFixture(fixture, { ...options, environment }))
  process.stderr.write(`${label}: complete in ${((performance.now() - start) / 1_000).toFixed(2)} s\n`)
}
const run: BenchmarkRun = {
  schemaVersion: BENCHMARK_SCHEMA_VERSION,
  run: { id: runId, createdAt, profile: options.profile, only: options.only },
  environment,
  results,
}
await writeFile(path.join(rawDirectory, 'environment.json'), json(environment))
await writeFile(path.join(rawDirectory, 'results.json'), json(run))
await generateArtifacts(run, latestDirectory)
process.stdout.write(`${path.join(latestDirectory, 'report.md')}\n`)

function parseArguments(arguments_: readonly string[]): {
  profile: 'quick' | 'full'
  only: 'all' | 'memory'
  skipMemory: boolean
} {
  let profile: 'quick' | 'full' = 'quick'
  let only: 'all' | 'memory' = 'all'
  let skipMemory = false
  for (let index = 0; index < arguments_.length; index++) {
    const argument = arguments_[index]
    if (argument === '--profile') {
      const value = arguments_[++index]
      if (value !== 'quick' && value !== 'full') throw new Error('--profile must be quick or full')
      profile = value
    } else if (argument === '--only') {
      const value = arguments_[++index]
      if (value !== 'memory') throw new Error('--only currently accepts memory')
      only = value
    } else if (argument === '--skip-memory') skipMemory = true
    else throw new Error(`Unknown benchmark argument: ${argument}`)
  }
  return { profile, only, skipMemory }
}
