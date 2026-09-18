import type { Atom } from '../types.js'

export type Ref = { readonly atom: Atom } | { readonly node: number }
export interface Adapter {
  readonly kind: object
  readonly atoms: readonly Atom[]
  readonly edges: readonly unknown[]
  readonly allocate: () => object
  readonly hydrate: (target: object, edges: readonly unknown[]) => void
}
export interface Node {
  readonly kind: number
  readonly atoms: readonly Atom[]
  readonly edges: readonly Ref[]
  readonly adapter: Adapter
}
export interface Graph {
  readonly root: Ref
  readonly nodes: readonly Node[]
  readonly sources: WeakMap<object, number>
}

export function isAtom(value: unknown): value is Atom {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'boolean' ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'bigint'
  )
}
