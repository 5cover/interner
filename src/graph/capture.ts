import type { Atom } from '../types.js'
import { isAtom, type Adapter, type AtomObservation, type Graph, type Node, type Ref } from './model.js'

export function capture(value: unknown, describe: (value: object, location: string) => Adapter): Graph {
  const sources = new WeakMap<object, number>()
  const functions = new WeakMap<object, number>()
  const symbols = new Map<symbol, number>()
  let functionCount = 0
  const queue: object[] = []
  const nodes: Node[] = []
  const kinds = new Map<object, number>()
  function symbolIdentity(value: symbol): number {
    let identity = symbols.get(value)
    if (identity === undefined) {
      identity = symbols.size
      symbols.set(value, identity)
    }
    return identity
  }
  function observeAtom(value: Atom): AtomObservation {
    return typeof value === 'symbol' ? { symbol: value, identity: symbolIdentity(value) } : { atom: value }
  }
  function ref(value: unknown, location: string): Ref {
    if (typeof value === 'symbol') return { symbol: value, identity: symbolIdentity(value) }
    if (isAtom(value) && typeof value !== 'symbol') return { atom: value }
    if (typeof value === 'function') {
      let identity = functions.get(value)
      if (identity === undefined) {
        identity = functionCount++
        functions.set(value, identity)
      }
      return { callable: value, identity }
    }
    if (typeof value !== 'object' || value === null) throw new TypeError(`Unsupported ${typeof value} at ${location}`)
    let id = sources.get(value)
    if (id === undefined) {
      id = queue.length
      sources.set(value, id)
      queue.push(value)
    }
    return { node: id }
  }
  const root = ref(value, 'root')
  for (let id = 0; id < queue.length; id++) {
    const adapter = describe(queue[id]!, `node ${id}`)
    let kind = kinds.get(adapter.kind)
    if (kind === undefined) {
      kind = kinds.size
      kinds.set(adapter.kind, kind)
    }
    nodes.push({
      kind,
      atoms: adapter.atoms.map(observeAtom),
      adapter,
      edges: adapter.edges.map((edge, index) => ref(edge, `node ${id}, edge ${index}`)),
    })
  }
  return { root, nodes, sources }
}
