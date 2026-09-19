import type { Extension } from './extension/define.js'

// Function identity is valid intrinsic extension state. Function behavior and
// properties remain opaque to the core.
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type Atom = undefined | null | boolean | number | bigint | string | symbol | Function

export interface InternOptions {
  /** Ordered, per-call semantics for custom nodes, functions, and symbols. */
  readonly extensions?: readonly Extension[]
}

export interface ExtensionDefinition<T, A extends readonly Atom[], E extends readonly unknown[]> {
  readonly name: string
  /** Called during capture, and to validate allocated values. Must be pure. */
  readonly match: (value: unknown) => value is T
  /** Called once per accepted source value. Describe all observations without mutation. */
  readonly describe: (value: T) => { readonly atoms: A; readonly edges: E }
  /** Called once per output class. Return a fresh matching value with no input references. */
  readonly allocate: (atoms: A) => T
  /**
   * Called once per output class after ALL representatives have been allocated.
   * Edges are canonical output values. Mutate only target; do not rely on hydration order.
   */
  readonly hydrate: (target: T, edges: E) => void
}
