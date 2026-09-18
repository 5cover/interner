import type { Graph, Node, Ref } from './model.js'

export function reconstruct(graph: Graph, classes: readonly number[]): unknown {
  const representatives = new Map<number, Node>()
  graph.nodes.forEach((node, id) => {
    const cls = classes[id]!
    if (!representatives.has(cls)) representatives.set(cls, node)
  })
  const outputs = new Map<number, object>()
  const allocated = new WeakSet<object>()
  for (const [cls, node] of representatives) {
    const value = node.adapter.allocate()
    if (typeof value !== 'object' || value === null)
      throw new TypeError(`Allocation must return an object for class ${cls}`)
    if (graph.sources.has(value) || allocated.has(value))
      throw new TypeError(`Allocation must be fresh for class ${cls}`)
    allocated.add(value)
    outputs.set(cls, value)
  }
  const resolve = (ref: Ref): unknown => ('atom' in ref ? ref.atom : outputs.get(classes[ref.node]!)!)
  for (const [cls, node] of representatives) node.adapter.hydrate(outputs.get(cls)!, node.edges.map(resolve))
  return resolve(graph.root)
}
