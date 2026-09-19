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

test('unmatched functions are forwarded through extension edges after extension dispatch', () => {
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
  assert.equal(matches, 3)
  assert.equal(intern(callable, { extensions: [extension] }), callable)
  assert.equal(matches, 4)
})

test('extensions can assign domain semantics to functions', () => {
  type TaggedFunction = (() => string) & { tag: string; next: TaggedFunction | null }
  const create = (tag: string): TaggedFunction => {
    const callable = (() => tag) as TaggedFunction
    callable.tag = tag
    callable.next = null
    return callable
  }
  const extension = defineExtension<TaggedFunction, readonly [string], readonly [TaggedFunction | null]>({
    name: 'TaggedFunction',
    match: (value): value is TaggedFunction => typeof value === 'function' && 'tag' in value,
    describe: value => ({ atoms: [value.tag], edges: [value.next] }),
    allocate: ([tag]) => create(tag),
    hydrate: (target, [next]) => {
      target.next = next
    },
  })
  const first = create('same')
  const second = create('same')
  first.next = first
  second.next = second
  const output = intern([first, second], { extensions: [extension] })

  assert.equal(output[0], output[1])
  assert.notEqual(output[0], first)
  assert.notEqual(output[0], second)
  assert.equal(output[0]!(), 'same')
  assert.equal(output[0]!.next, output[0])
})

test('functions can be extension atoms compared by identity', () => {
  class FunctionAtom {
    constructor(public callable: () => number) {}
  }
  const extension = defineExtension<FunctionAtom, readonly [() => number], readonly []>({
    name: 'FunctionAtom',
    match: (value): value is FunctionAtom => value instanceof FunctionAtom,
    describe: value => ({ atoms: [value.callable], edges: [] }),
    allocate: ([callable]) => new FunctionAtom(callable),
    hydrate: () => {},
  })
  const shared = () => 1
  const distinct = () => 1
  const output = intern([new FunctionAtom(shared), new FunctionAtom(shared), new FunctionAtom(distinct)], {
    extensions: [extension],
  })
  assert.equal(output[0], output[1])
  assert.notEqual(output[0], output[2])
  assert.equal(output[0]!.callable, shared)
})
