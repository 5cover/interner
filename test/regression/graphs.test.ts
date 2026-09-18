import assert from 'node:assert/strict'
import { test } from 'node:test'
import { intern } from '../../src/index.js'
import { SignatureTable, hashSignature } from '../../src/graph/signature.js'

test('homogeneous cycles of different topology collapse', () => {
  const a: { next?: unknown } = {}
  a.next = a
  const b: { next?: unknown } = {}
  const c = { next: b }
  b.next = c
  const result = intern([a, b, c])
  assert.equal(result[0], result[1])
  assert.equal(result[1], result[2])
  assert.equal(result[0]!.next, result[0])
})

test('iterative traversal handles deep DAGs and late cyclic distinctions', () => {
  let value: { next?: unknown } = {}
  for (let i = 0; i < 20000; i++) value = { next: value }
  const result = intern([value, value])
  assert.equal(result[0], result[1])
  assert.notEqual(result[0], value)
  const cycle: { next?: unknown; mark?: number }[] = Array.from({ length: 50 }, () => ({}))
  cycle.forEach((node, i) => {
    node.next = cycle[(i + 1) % cycle.length]
  })
  cycle[0]!.mark = 1
  assert.equal(new Set(intern(cycle)).size, cycle.length)
})

test('collision resolution compares full signatures, not hashes', () => {
  const table = new SignatureTable(() => 0)
  assert.equal(table.intern('a'), 0)
  assert.equal(table.intern('b'), 1)
  assert.equal(table.intern('a'), 0)
  assert.equal(table.intern(''), 2)
  assert.equal(table.size, 3)
  assert.equal(hashSignature('stable'), hashSignature('stable'))
})
