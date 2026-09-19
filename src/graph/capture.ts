import type { Atom } from '../types.js'
import { isAtom, type Adapter, type AtomObservation, type Graph, type Node, type Ref } from './model.js'

export function capture(value: unknown, classify: (value: unknown, location: string) => Adapter | undefined): Graph {
  const sources = new WeakMap<object, number>()
  const sourceSymbols = new Set<symbol>()
  const symbolNodes = new Map<symbol, number>()
  const functions = new WeakMap<object, number>()
  const symbols = new Map<symbol, number>()
  let functionCount = 0
  const queue: { readonly adapter: Adapter }[] = []
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

  function functionIdentity(value: object): number {
    let identity = functions.get(value)
    if (identity === undefined) {
      identity = functionCount++
      functions.set(value, identity)
    }
    return identity
  }

  function observeAtom(value: Atom): AtomObservation {
    if (typeof value === 'symbol') return { symbol: value, identity: symbolIdentity(value) }
    if (typeof value === 'function') return { callable: value, identity: functionIdentity(value) }
    return { atom: value }
  }

  function ref(value: unknown, location: string): Ref {
    if (isAtom(value) && typeof value !== 'symbol' && typeof value !== 'function') return { atom: value }

    const existing =
      typeof value === 'symbol'
        ? symbolNodes.get(value)
        : (typeof value === 'object' && value !== null) || typeof value === 'function'
          ? sources.get(value)
          : undefined
    if (existing !== undefined) return { node: existing }

    const adapter = classify(value, location)
    if (adapter) {
      const id = queue.length
      queue.push({ adapter })
      if (typeof value === 'symbol') {
        symbolNodes.set(value, id)
        sourceSymbols.add(value)
      } else if ((typeof value === 'object' && value !== null) || typeof value === 'function') {
        sources.set(value, id)
      }
      return { node: id }
    }

    if (typeof value === 'symbol') return { symbol: value, identity: symbolIdentity(value) }
    if (typeof value === 'function') return { callable: value, identity: functionIdentity(value) }
    throw new TypeError(`Unsupported ${typeof value} at ${location}`)
  }

  const root = ref(value, 'root')
  for (let id = 0; id < queue.length; id++) {
    const { adapter } = queue[id]!
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
  return { root, nodes, sources, sourceSymbols }
}
