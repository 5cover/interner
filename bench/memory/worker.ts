import { unlink, writeFile } from 'node:fs/promises'
import { dumpNodeHeapSnapshot, type IHeapNode } from '@memlab/core'
import { getFullHeapFromFile } from '@memlab/heap-analysis'
import { intern } from '../../src/index.js'
import { findFixture } from '../fixtures/index.js'

class InternerBenchmarkHeapHolder {
  readonly marker = 'interner-benchmark-holder-v1'
  constructor(readonly rootValue: unknown) {}
}

interface WorkerArguments {
  readonly fixtureId: string
  readonly profile: 'quick' | 'full'
  readonly state: 'before' | 'after'
  readonly resultPath: string
}

function argumentsFromProcess(): WorkerArguments {
  const values = new Map<string, string>()
  for (let index = 2; index < process.argv.length; index += 2)
    values.set(process.argv[index]!, process.argv[index + 1]!)
  const profile = values.get('--profile')
  const state = values.get('--state')
  const fixtureId = values.get('--fixture')
  const resultPath = values.get('--result')
  if (
    !fixtureId ||
    !resultPath ||
    (profile !== 'quick' && profile !== 'full') ||
    (state !== 'before' && state !== 'after')
  )
    throw new Error('Invalid memory worker arguments')
  return { fixtureId, profile, state, resultPath }
}

const options = argumentsFromProcess()
const fixture = findFixture(options.profile, options.fixtureId)
const holder = createHolder()
Object.defineProperty(globalThis, '__internerBenchmarkHeapHolder', { value: holder, configurable: true })
global.gc?.()
global.gc?.()
const snapshotFile = dumpNodeHeapSnapshot()
const heap = await getFullHeapFromFile(snapshotFile)
const holderNodes: IHeapNode[] = []
heap.nodes.forEach(node => {
  if (node.type === 'object' && node.name === 'InternerBenchmarkHeapHolder') holderNodes.push(node)
})
const holderNode = holderNodes[0]
if (!holderNode) throw new Error('Could not locate the benchmark heap holder')
const rootNode = holderNode.getReferenceNode('rootValue', 'property')
if (!rootNode) throw new Error('Could not follow the benchmark holder rootValue edge')
await writeFile(options.resultPath, JSON.stringify({ retainedBytes: rootNode.retainedSize }))
await unlink(snapshotFile)

function createHolder(): InternerBenchmarkHeapHolder {
  const source = fixture.create()
  return new InternerBenchmarkHeapHolder(options.state === 'after' ? intern(source) : source)
}
