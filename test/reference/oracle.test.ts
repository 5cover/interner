import assert from 'node:assert/strict'
import { test } from 'node:test'
import { check } from '../properties/check.js'
import { graphs } from '../generators/graph.js'
import { materialize, observe, relation } from './model.js'

test('pair elimination identifies homogeneous cycles and propagates distinctions', () => {
  const nodes = [0, 2, 1].map(ref => ({ kind: 'x', state: [], links: [{ ref }] }))
  assert.ok(relation(nodes).every(row => row.every(Boolean)))
  const different = [...nodes, { kind: 'y', state: [], links: [{ ref: 0 }] }]
  assert.equal(relation(different)[0]![3], false)
  assert.equal(
    relation([
      { kind: 'x', state: [], links: [{ ref: 1 }] },
      { kind: 'x', state: [], links: [{ ref: 2 }] },
      { kind: 'y', state: [], links: [] },
    ])[0]![1],
    false
  )
})

test('reference relation is an equivalence and materialization preserves it', () => {
  check('oracle', graphs(true, true), graph => {
    const eq = relation(graph.nodes)
    const captured = observe(materialize(graph))
    const actual = relation(captured.nodes)
    for (let i = 0; i < eq.length; i++)
      for (let j = 0; j < eq.length; j++) {
        assert.equal(eq[i]![i], true)
        assert.equal(eq[i]![j], eq[j]![i])
        assert.equal(eq[i]![j], actual[i]![j])
        for (let k = 0; k < eq.length; k++) if (eq[i]![j] && eq[j]![k]) assert.ok(eq[i]![k])
      }
  })
})
