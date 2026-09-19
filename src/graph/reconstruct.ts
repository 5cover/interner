import type { Graph, Node, Ref } from './model.js'

export function reconstruct(graph: Graph, classes: readonly number[]): unknown {
  const representatives = new Map<number, Node>()
  graph.nodes.forEach((node, id) => {
    const cls = classes[id]!
    if (!representatives.has(cls)) representatives.set(cls, node)
  })
  const outputs = new Map<number, unknown>()
  const allocatedObjects = new WeakSet<object>()
  const allocatedSymbols = new Set<symbol>()
  for (const [cls, node] of representatives) {
    const value = node.adapter.allocate()
    if ((typeof value === 'object' && value !== null) || typeof value === 'function') {
      if (graph.sources.has(value) || allocatedObjects.has(value))
        throw new TypeError(`Allocation must be fresh for class ${cls}`)
      allocatedObjects.add(value)
    } else if (typeof value === 'symbol') {
      if (graph.sourceSymbols.has(value) || allocatedSymbols.has(value))
        throw new TypeError(`Allocation must be fresh for class ${cls}`)
      allocatedSymbols.add(value)
    }
    outputs.set(cls, value)
  }
  const resolve = (ref: Ref): unknown => {
    if ('atom' in ref) return ref.atom
    if ('symbol' in ref) return ref.symbol
    if ('callable' in ref) return ref.callable
    return outputs.get(classes[ref.node]!)
  }
  for (const [cls, node] of representatives) node.adapter.hydrate(outputs.get(cls), node.edges.map(resolve))
  return resolve(graph.root)
}
