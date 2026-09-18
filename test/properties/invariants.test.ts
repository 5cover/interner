import assert from 'node:assert/strict'
import { test } from 'node:test'
import { defineExtension, intern, type Atom } from '../../src/index.js'
import { graphs } from '../generators/graph.js'
import { equivalent, materialize, observe, relation, Vertex } from '../reference/model.js'
import { check } from './check.js'

export const vertexExtension = defineExtension<Vertex, readonly Atom[], readonly unknown[]>({
  name: 'Vertex',
  match: (value): value is Vertex => value instanceof Vertex,
  describe: value => ({ atoms: value.state, edges: value.links }),
  allocate: atoms => new Vertex([...atoms]),
  hydrate: (target, edges) => {
    target.links = [...edges]
  },
})

for (const cyclic of [false, true])
  for (const extensions of [false, true]) {
    const name = `${cyclic ? 'cyclic' : 'dag'}-${extensions ? 'extensions' : 'builtins'}`
    test(`${name}: preservation, exact quotient, freshness and metamorphic invariants`, () => {
      check(name, graphs(cyclic, extensions), graph => {
        const input = materialize(graph)
        const before = observe(input)
        const expected = relation(graph.nodes)
        const options = { extensions: [vertexExtension] }
        const result = intern(input, options)
        const after = observe(result)
        assert.deepEqual(observe(input), before)
        assert.ok(equivalent(input, result))
        for (let i = 0; i < input.length; i++)
          for (let j = 0; j < input.length; j++) {
            assert.equal(result[i] === result[j], expected[i]![j], `${i},${j}: exact quotient`)
          }
        for (const object of observe([result]).objects) assert.ok(!observe([input]).objects.includes(object))
        const outputRelation = relation(after.nodes)
        for (let i = 0; i < after.nodes.length; i++)
          for (let j = 0; j < i; j++) assert.equal(outputRelation[i]![j], false)
        const again = intern(result, options)
        assert.ok(equivalent(result, again))
        assert.equal(observe(again).nodes.length, after.nodes.length)
        assert.ok(equivalent(result, intern(materialize(graph, true), options)))
        // Replace occurrences with a disjoint but equivalent graph, including cycles.
        const replacement = materialize(graph, true)
        const doubled = intern([...input, ...replacement], options)
        input.forEach((_, i) => assert.equal(doubled[i], doubled[i + input.length]))
        if (!extensions) assert.ok(equivalent(result, structuredClone(input)))
      })
    })
  }
