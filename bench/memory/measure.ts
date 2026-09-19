import { spawn } from 'node:child_process'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { fileURLToPath } from 'node:url'
import { median } from '../statistics.js'
import type { RetainedHeapMetrics } from '../types.js'

const worker = fileURLToPath(new URL('./worker.ts', import.meta.url))

export async function measureRetainedHeap(
  fixtureId: string,
  profile: 'quick' | 'full',
  samples: number
): Promise<RetainedHeapMetrics> {
  const beforeSamplesBytes: number[] = []
  const afterSamplesBytes: number[] = []
  for (let sample = 0; sample < samples; sample++) {
    beforeSamplesBytes.push(await memorySample(fixtureId, profile, 'before', sample, samples))
    afterSamplesBytes.push(await memorySample(fixtureId, profile, 'after', sample, samples))
  }
  return {
    beforeBytes: median(beforeSamplesBytes),
    afterBytes: median(afterSamplesBytes),
    beforeSamplesBytes,
    afterSamplesBytes,
    beforeMinimumBytes: Math.min(...beforeSamplesBytes),
    beforeMaximumBytes: Math.max(...beforeSamplesBytes),
    afterMinimumBytes: Math.min(...afterSamplesBytes),
    afterMaximumBytes: Math.max(...afterSamplesBytes),
  }
}

async function memorySample(
  fixtureId: string,
  profile: 'quick' | 'full',
  state: 'before' | 'after',
  sample: number,
  samples: number
): Promise<number> {
  process.stderr.write(`  [${fixtureId}] retained heap ${state} sample ${sample + 1}/${samples}: run`)
  const start = performance.now()
  try {
    const bytes = await runWorker(fixtureId, profile, state)
    process.stderr.write(`, ${(performance.now() - start).toFixed(2)} ms, ${bytes} B\n`)
    return bytes
  } catch (error) {
    process.stderr.write(', failed\n')
    throw error
  }
}

function runWorker(fixtureId: string, profile: 'quick' | 'full', state: 'before' | 'after'): Promise<number> {
  return readWorkerResult(fixtureId, profile, state)
}

async function readWorkerResult(
  fixtureId: string,
  profile: 'quick' | 'full',
  state: 'before' | 'after'
): Promise<number> {
  const directory = await mkdtemp(join(tmpdir(), 'interner-benchmark-'))
  const resultFile = join(directory, 'retained-heap.json')
  try {
    await new Promise<void>((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [
          '--expose-gc',
          '--import',
          'tsx',
          worker,
          '--fixture',
          fixtureId,
          '--profile',
          profile,
          '--state',
          state,
          '--result',
          resultFile,
        ],
        {
          cwd: process.cwd(),
          stdio: ['ignore', 'ignore', 'pipe'],
          env: { ...process.env, FORCE_COLOR: '0' },
        }
      )
      let stderr = ''
      child.stderr.setEncoding('utf8').on('data', chunk => {
        stderr += chunk
      })
      child.on('error', reject)
      child.on('close', code => {
        if (code === 0) resolve()
        else reject(new Error(`Memory worker failed for ${fixtureId}/${state}: ${stderr}`))
      })
    })
    const parsed = JSON.parse(await readFile(resultFile, 'utf8')) as { retainedBytes?: unknown }
    if (typeof parsed.retainedBytes !== 'number')
      throw new Error(`Memory worker did not report retained bytes for ${fixtureId}/${state}`)
    return parsed.retainedBytes
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

export function unavailableRetainedHeap(): RetainedHeapMetrics {
  return {
    beforeBytes: null,
    afterBytes: null,
    beforeSamplesBytes: [],
    afterSamplesBytes: [],
    beforeMinimumBytes: null,
    beforeMaximumBytes: null,
    afterMinimumBytes: null,
    afterMaximumBytes: null,
  }
}
