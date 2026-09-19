import assert from 'node:assert/strict'
import { test } from 'node:test'
import { measureStructure } from '../../bench/structural/measure.js'

test('structural metrics count identities once and primitive occurrences by reachable edge', () => {
  const child = { text: 'é' }
  const list: unknown[] & { extra?: unknown } = [child, , undefined]
  list.extra = child
  const root = { first: child, second: child, list, date: new Date(0), regexp: /x/ }

  assert.deepEqual(measureStructure(root), {
    objectNodes: 2,
    arrayNodes: 1,
    dateNodes: 1,
    regexpNodes: 1,
    edges: 9,
    objectProperties: 7,
    arrayElements: 2,
    arrayHoles: 1,
    strings: 1,
    stringCodeUnits: 1,
    numbers: 0,
    bigints: 0,
    booleans: 0,
    nulls: 0,
    undefineds: 1,
    functions: 0,
    symbols: 0,
    totalReferenceNodes: 5,
  })
})

test('structural metrics terminate on cycles', () => {
  const root: { next?: unknown } = {}
  root.next = root
  const metrics = measureStructure(root)
  assert.equal(metrics.objectNodes, 1)
  assert.equal(metrics.edges, 1)
  assert.equal(metrics.totalReferenceNodes, 1)
})
