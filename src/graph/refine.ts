import type { Node } from './model.js'
import { signature, SignatureTable } from './signature.js'

export function refine(nodes: readonly Node[]): number[] {
  const initial = new SignatureTable()
  let classes = nodes.map(node => initial.intern(signature(node)))
  let count = initial.size
  for (;;) {
    const table = new SignatureTable()
    const next = nodes.map(node => table.intern(signature(node, classes)))
    // Each round refines the previous equivalence; equal class counts imply
    // stability even if representative numbering changed.
    if (table.size === count) return next
    classes = next
    count = table.size
  }
}
