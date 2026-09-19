import assert from 'node:assert/strict'
import { test } from 'node:test'
import { defineExtension, intern } from '../../src/index.js'

test('functions are forwarded at the root and through built-in edges', () => {
  const regular = function (value: number) {
    return value + 1
  }
  const arrow = () => 'arrow'
  async function asynchronous() {
    return 'async'
  }
  function* generator() {
    yield 'generator'
  }
  class Constructor {}

  for (const callable of [regular, arrow, asynchronous, generator, Constructor]) {
    assert.equal(intern(callable), callable)
    const input = { callable }
    const output = intern(input)
    assert.notEqual(output, input)
    assert.equal(output.callable, callable)
  }
})

test('functions are opaque: own properties are neither inspected nor cloned', () => {
  let reads = 0
  const callable = () => 'result'
  const hidden = { not: 'captured' }
  Object.defineProperty(callable, 'dangerous', {
    enumerable: true,
    get() {
      reads++
      throw new Error('function property was inspected')
    },
  })
  Object.defineProperty(callable, 'hidden', { value: hidden, writable: true })

  const output = intern({ callable })
  assert.equal(reads, 0)
  assert.equal(output.callable, callable)
  assert.equal(Reflect.get(callable, 'hidden'), hidden)
})

test('function identity participates in containing-node equivalence', () => {
  const shared = () => 1
  const distinct = () => 1
  const output = intern([{ callable: shared }, { callable: shared }, { callable: distinct }, { callable: distinct }])

  assert.equal(output[0], output[1])
  assert.equal(output[2], output[3])
  assert.notEqual(output[0], output[2])
  assert.equal(output[0]!.callable, shared)
  assert.equal(output[2]!.callable, distinct)
})

test('functions are forwarded through extension edges without extension dispatch', () => {
  class Holder {
    constructor(public edge: unknown = null) {}
  }
  let matches = 0
  const extension = defineExtension({
    name: 'Holder',
    match: (value): value is Holder => {
      matches++
      return value instanceof Holder
    },
    describe: value => ({ atoms: [] as const, edges: [value.edge] as const }),
    allocate: () => new Holder(),
    hydrate: (target, [edge]) => {
      target.edge = edge
    },
  })
  const callable = () => 1
  const output = intern(new Holder(callable), { extensions: [extension] })

  assert.notEqual(output.edge, null)
  assert.equal(output.edge, callable)
  assert.equal(matches, 2)
  assert.equal(intern(callable, { extensions: [extension] }), callable)
  assert.equal(matches, 2)
})
