import type { Extension } from './extension/define.js'

export type Atom = undefined | null | boolean | number | bigint | string | symbol

export interface InternOptions {
  /** Ordered, per-call semantics for otherwise unsupported object kinds. */
  readonly extensions?: readonly Extension[]
}

export interface ExtensionDefinition<T extends object, A extends readonly Atom[], E extends readonly unknown[]> {
  readonly name: string
  /** Called during capture, and to validate allocated objects. Must be pure. */
  readonly match: (value: object) => value is T
  /** Called once per accepted source object. Describe all observations without mutation. */
  readonly describe: (value: T) => { readonly atoms: A; readonly edges: E }
  /** Called once per output class. Return a fresh matching object with no input references. */
  readonly allocate: (atoms: A) => T
  /**
   * Called once per output class after ALL representatives have been allocated.
   * Edges are canonical output values. Mutate only target; do not rely on hydration order.
   */
  readonly hydrate: (target: T, edges: E) => void
}
