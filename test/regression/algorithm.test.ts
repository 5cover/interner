import assert from 'node:assert/strict'
import { test } from 'node:test'
import { builtin } from '../../src/builtins/index.js'
import { capture } from '../../src/graph/capture.js'
import { bottomUp } from '../../src/graph/acyclic.js'

test('DAG fast path counts only reference edges, including repeated references', () => {
  const leaf = { n: 1 }
  const graph = capture({ x: leaf, y: leaf, z: 'primitive' }, (value, location) =>
    typeof value === 'object' && value !== null ? builtin(value, location) : undefined
  )
  const order = bottomUp(graph.nodes)
  assert.ok(order)
  assert.equal(order.length, graph.nodes.length)
  const positions = new Map(order.map((id, i) => [id, i]))
  graph.nodes.forEach((node, id) =>
    node.edges.forEach(edge => {
      if ('node' in edge) assert.ok(positions.get(edge.node)! < positions.get(id)!)
    })
  )
})
