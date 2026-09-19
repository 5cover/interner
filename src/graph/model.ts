import type { Atom } from '../types.js'

export type DirectAtom = Exclude<Atom, symbol>
export type AtomObservation = { readonly atom: DirectAtom } | { readonly symbol: symbol; readonly identity: number }
export type Ref =
  | { readonly atom: DirectAtom }
  | { readonly symbol: symbol; readonly identity: number }
  | { readonly callable: unknown; readonly identity: number }
  | { readonly node: number }
export interface Adapter {
  readonly kind: object
  readonly atoms: readonly Atom[]
  readonly edges: readonly unknown[]
  readonly allocate: () => object
  readonly hydrate: (target: object, edges: readonly unknown[]) => void
}
export interface Node {
  readonly kind: number
  readonly atoms: readonly AtomObservation[]
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
    typeof value === 'bigint' ||
    typeof value === 'symbol'
  )
}
