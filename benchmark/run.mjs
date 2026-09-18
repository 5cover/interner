import { performance } from 'node:perf_hooks'
import { stringify } from 'yaml'
import { intern } from '../dist/index.js'

const scale = Number(process.env.BENCH_SIZE ?? 2000)
const depth = Number(process.env.BENCH_DEPTH ?? 200)
function count(root) {
  const seen = new Set()
  const queue = [root]
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i]
    if (!node || typeof node !== 'object' || seen.has(node)) continue
    seen.add(node)
    queue.push(...Object.values(node))
  }
  return seen.size
}
function deep() {
  let value = { leaf: true }
  for (let i = 0; i < depth; i++) value = { next: value }
  return value
}
const cycle = Array.from({ length: Math.min(scale, 200) }, (_, i) => ({ label: i % 2, next: null }))
cycle.forEach((node, i) => {
  node.next = cycle[(i + 1) % cycle.length]
})
const shared = { type: 'string', minLength: 1 }
const fixtures = {
  uniqueTree: Array.from({ length: scale }, (_, i) => ({ i, nested: { value: i } })),
  duplicatedTree: Array.from({ length: scale }, () => ({ type: 'object', properties: { name: { type: 'string' } } })),
  deepTree: deep(),
  wideTree: Object.fromEntries(Array.from({ length: scale }, (_, i) => [`k${i}`, { value: i % 10 }])),
  jsonSchema: {
    type: 'object',
    properties: Object.fromEntries(
      Array.from({ length: scale }, (_, i) => [`field${i}`, { type: 'string', minLength: 1 }])
    ),
  },
  repeatedDag: Array.from({ length: scale }, () => ({ first: shared, second: shared })),
  cyclicGraph: cycle,
}
for (const [fixture, value] of Object.entries(fixtures)) {
  const sourceNodes = count(value)
  const quotientNodes = count(intern(value))
  for (const [operation, run] of Object.entries({
    structuredClone: () => structuredClone(value),
    intern: () => intern(value),
    yaml: () => stringify(value),
    internYaml: () => stringify(intern(value)),
  })) {
    global.gc?.()
    const before = process.memoryUsage().heapUsed
    const start = performance.now()
    try {
      const result = run()
      const milliseconds = performance.now() - start
      global.gc?.()
      console.log(
        JSON.stringify({
          fixture,
          operation,
          milliseconds,
          retainedHeapDelta: process.memoryUsage().heapUsed - before,
          sourceNodes,
          quotientNodes,
          compressionRatio: sourceNodes / quotientNodes,
          ...(typeof result === 'string' ? { bytes: Buffer.byteLength(result) } : {}),
        })
      )
    } catch (error) {
      // Consumer recursion limits are reported rather than conflated with interner.
      console.log(JSON.stringify({ fixture, operation, error: String(error) }))
    }
  }
}
