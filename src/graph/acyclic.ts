import type { Node } from './model.js'
import { signature, SignatureTable } from './signature.js'

/** Kahn traversal from leaves, counting repeated edges independently. */
export function bottomUp(nodes: readonly Node[]): number[] | undefined {
  const parents: number[][] = nodes.map(() => [])
  const pending = nodes.map(node => node.edges.filter(edge => 'node' in edge).length)
  nodes.forEach((node, id) =>
    node.edges.forEach(edge => {
      if ('node' in edge) parents[edge.node]!.push(id)
    })
  )
  const order: number[] = []
  pending.forEach((count, id) => {
    if (count === 0) order.push(id)
  })
  for (let i = 0; i < order.length; i++)
    for (const parent of parents[order[i]!]!) {
      pending[parent] = pending[parent]! - 1
      if (pending[parent] === 0) order.push(parent)
    }
  return order.length === nodes.length ? order : undefined
}

export function acyclic(nodes: readonly Node[], order: readonly number[]): number[] {
  const classes: number[] = new Array(nodes.length)
  const table = new SignatureTable()
  for (const id of order) classes[id] = table.intern(signature(nodes[id]!, classes))
  return classes
}
