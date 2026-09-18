import fc from 'fast-check'
import type { Graph, Link, Observation } from '../reference/model.js'

export const atom = fc.oneof(
  fc.constantFrom(undefined, null, true, false, NaN, 0, -0, Infinity, -Infinity),
  fc.integer(),
  fc.string({ maxLength: 8 }),
  fc.bigInt()
)

export function graphs(cyclic: boolean, extensions = false): fc.Arbitrary<Graph> {
  return fc
    .array(
      fc.record({
        kind: fc.constantFrom('object', 'array', 'date', 'regexp', ...(extensions ? ['vertex'] : [])),
        atoms: fc.array(atom, { minLength: 1, maxLength: 3 }),
        edges: fc.array(
          fc.oneof(
            atom.map(value => ({ value })),
            fc.nat(100).map(ref => ({ ref }))
          ),
          { maxLength: 4 }
        ),
        reverse: fc.boolean(),
        holes: fc.boolean(),
        duplicate: fc.boolean(),
      }),
      { minLength: 1, maxLength: 12 }
    )
    .map(raw => {
      const nodes: Observation[] = raw.map((n, i) => {
        const links: Link[] = n.edges.map(e => {
          if ('value' in e) return e
          if (!cyclic && i + 1 === raw.length) return { value: undefined }
          return { ref: cyclic ? e.ref % raw.length : i + 1 + (e.ref % (raw.length - i - 1)) }
        })
        if (n.kind === 'date')
          return { kind: n.kind, state: [Number.isFinite(n.atoms[0]) ? Number(n.atoms[0]) : NaN], links: [] }
        if (n.kind === 'regexp')
          return { kind: n.kind, state: [n.reverse ? '(?:)' : 'a+', n.holes ? 'gi' : ''], links: [] }
        if (n.kind === 'vertex') return { kind: n.kind, state: n.atoms, links }
        const keys = links.map((_, j) => (n.kind === 'array' ? String(j * 2) : `key${j}`))
        if (n.reverse && n.kind === 'object') keys.reverse()
        if (n.kind === 'array' && keys.length > 0) keys[keys.length - 1] = 'extra'
        return { kind: n.kind, state: n.kind === 'array' ? [links.length * 2 + Number(n.holes), ...keys] : keys, links }
      })
      raw.forEach((n, i) => {
        if (n.duplicate && i + 1 < nodes.length) nodes[i] = nodes[i + 1]!
      })
      return { nodes }
    })
}
