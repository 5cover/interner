import { builtin } from './builtins/index.js'
import { definition } from './extension/define.js'
import { extensionAdapter } from './extension/runtime.js'
import { acyclic, bottomUp } from './graph/acyclic.js'
import { capture } from './graph/capture.js'
import { reconstruct } from './graph/reconstruct.js'
import { refine } from './graph/refine.js'
import type { InternOptions } from './types.js'

export { defineExtension } from './extension/define.js'
export type { Extension } from './extension/define.js'
export type { Atom, ExtensionDefinition, InternOptions } from './types.js'

/**
 * Returns a quotienting clone with maximal sharing of equivalent subvalues.
 * Reconstructed graph nodes are fresh; unmatched opaque symbol and function leaves
 * are returned unchanged.
 * Supports primitives, plain objects/arrays with all own property descriptors, Date and RegExp. Unmatched
 * symbols and functions are forwarded by identity as opaque leaves. Extensions may
 * instead give matching symbols and functions domain-specific graph semantics.
 * Other unsupported values throw TypeError. Explicit extensions supply custom
 * semantics for objects, functions, and symbols; callback errors propagate unchanged.
 * Input is not intentionally mutated. Identity-derived observations are not preserved:
 * mutating the mutable output may expose new sharing. No reconstructed identities are
 * pooled across calls; unmatched input symbols and functions are forwarded. Cycles
 * are minimized by bisimulation, not by preserving alias topology.
 * Expected DAG cost is O(V + E + S); cyclic refinement can cost O(V * (V + E + S)),
 * with O(V + E + S) space, where S is primitive/key observation size.
 */
export function intern<const T>(value: T, options?: InternOptions): T {
  const extensions = [...(options?.extensions ?? [])].map(handle => ({ handle, runtime: definition(handle) }))
  const graph = capture(value, (candidate, location) => {
    if (typeof candidate === 'object' && candidate !== null) {
      const adapter = builtin(candidate, location)
      if (adapter) return adapter
    }
    for (const { handle, runtime } of extensions)
      if (runtime.match(candidate)) return extensionAdapter(candidate, handle, runtime, location)
    if (typeof candidate === 'symbol' || typeof candidate === 'function') return undefined
    throw new TypeError(`Unsupported object prototype or kind at ${location}`)
  })
  const order = bottomUp(graph.nodes)
  const classes = order ? acyclic(graph.nodes, order) : refine(graph.nodes)
  return reconstruct(graph, classes) as T
}
