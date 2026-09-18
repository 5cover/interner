// This oracle deliberately shares no production graph or signature machinery.
export type Primitive = undefined | null | boolean | string | number | bigint
export type Link = { ref: number } | { value: Primitive }
export interface Observation {
  kind: string
  state: Primitive[]
  links: Link[]
}
export interface Graph {
  nodes: Observation[]
}

export function relation(nodes: readonly Observation[]): boolean[][] {
  const pairs = nodes.map(a =>
    nodes.map(
      b =>
        a.kind === b.kind &&
        a.state.length === b.state.length &&
        a.state.every((v, i) => Object.is(v, b.state[i])) &&
        a.links.length === b.links.length &&
        a.links.every((x, i) => {
          const y = b.links[i]!
          return 'ref' in x ? 'ref' in y : 'value' in y && Object.is(x.value, y.value)
        })
    )
  )
  let changed = true
  while (changed) {
    changed = false
    nodes.forEach((a, i) =>
      nodes.forEach((b, j) => {
        if (!pairs[i]![j]) return
        if (
          a.links.some((x, k) => {
            const y = b.links[k]!
            return 'ref' in x && 'ref' in y && !pairs[x.ref]![y.ref]
          })
        ) {
          pairs[i]![j] = false
          changed = true
        }
      })
    )
  }
  return pairs
}

export class Vertex {
  constructor(
    public state: Primitive[],
    public links: unknown[] = []
  ) {}
}

export function materialize(graph: Graph, reverse = false): object[] {
  const values: object[] = new Array(graph.nodes.length)
  const indices = graph.nodes.map((_, i) => i)
  if (reverse) indices.reverse()
  for (const i of indices) {
    const n = graph.nodes[i]!
    switch (n.kind) {
      case 'object':
        values[i] = {}
        break
      case 'array':
        values[i] = new Array(Number(n.state[0]))
        break
      case 'date':
        values[i] = new Date(Number(n.state[0]))
        break
      case 'regexp':
        values[i] = new RegExp(String(n.state[0]), String(n.state[1]))
        break
      case 'vertex':
        values[i] = new Vertex([...n.state])
        break
      default:
        throw new Error('Unknown test kind')
    }
  }
  for (const i of indices) {
    const n = graph.nodes[i]!
    const edges = n.links.map(x => ('ref' in x ? values[x.ref] : x.value))
    if (n.kind === 'vertex') (values[i] as Vertex).links = edges
    else if (n.kind === 'object' || n.kind === 'array') {
      const keys = n.kind === 'array' ? n.state.slice(1) : n.state
      keys.forEach((key, j) =>
        Object.defineProperty(values[i], String(key), {
          value: edges[j],
          enumerable: true,
          writable: true,
          configurable: true,
        })
      )
    }
  }
  return values
}

export function observe(roots: readonly unknown[]): { nodes: Observation[]; objects: object[]; roots: Link[] } {
  const objects: object[] = []
  const ids = new Map<object, number>()
  function link(value: unknown): Link {
    if (value === null || typeof value !== 'object') return { value: value as Primitive }
    if (!ids.has(value)) {
      ids.set(value, objects.length)
      objects.push(value)
    }
    return { ref: ids.get(value)! }
  }
  const rootLinks = roots.map(link)
  const nodes: Observation[] = []
  for (let i = 0; i < objects.length; i++) {
    const value = objects[i]!
    if (value instanceof Vertex) nodes.push({ kind: 'vertex', state: [...value.state], links: value.links.map(link) })
    else if (value instanceof Date) nodes.push({ kind: 'date', state: [value.getTime()], links: [] })
    else if (value instanceof RegExp) nodes.push({ kind: 'regexp', state: [value.source, value.flags], links: [] })
    else {
      const keys = Object.keys(value)
      nodes.push({
        kind: Array.isArray(value) ? 'array' : 'object',
        state: Array.isArray(value) ? [value.length, ...keys] : keys,
        links: keys.map(key => link((value as Record<string, unknown>)[key])),
      })
    }
  }
  return { nodes, objects, roots: rootLinks }
}

export function equivalent(a: unknown, b: unknown): boolean {
  const graph = observe([a, b])
  const [x, y] = graph.roots as [Link, Link]
  return 'ref' in x ? 'ref' in y && relation(graph.nodes)[x.ref]![y.ref]! : 'value' in y && Object.is(x.value, y.value)
}
