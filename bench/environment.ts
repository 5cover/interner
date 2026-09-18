import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import type { BenchmarkEnvironment } from './types.js'
import { BENCHMARK_SCHEMA_VERSION } from './types.js'

const require = createRequire(import.meta.url)
const projectPackage = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  version: string
}

export function benchmarkEnvironment(): BenchmarkEnvironment {
  let commit: string | undefined
  try {
    commit = execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    commit = undefined
  }
  return {
    node: process.version,
    nodeMajor: Number(process.versions.node.split('.')[0]),
    v8: process.versions.v8,
    platform: process.platform,
    architecture: os.arch(),
    packageVersion: projectPackage.version,
    ...(commit ? { commit } : {}),
    benchmarkSchemaVersion: BENCHMARK_SCHEMA_VERSION,
    structuralSizeModelVersion: null,
    memlabVersion: dependencyVersion('@memlab/core'),
    yamlVersion: dependencyVersion('yaml'),
    zodVersion: dependencyVersion('zod'),
  }
}

function dependencyVersion(name: string): string {
  const value = require(`${name}/package.json`) as { version: string }
  return value.version
}
