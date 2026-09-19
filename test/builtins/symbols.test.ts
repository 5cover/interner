import assert from 'node:assert/strict'
import { test } from 'node:test'
import { defineExtension, intern, type Atom } from '../../src/index.js'

test('symbols are forwarded at the root and through value edges', () => {
  const local = Symbol('local')
  const registered = Symbol.for('interner.test.registered')
  const wellKnown = Symbol.iterator

  for (const symbol of [local, registered, wellKnown]) {
    assert.equal(intern(symbol), symbol)
    const input = { symbol }
    const output = intern(input)
    assert.notEqual(output, input)
    assert.equal(output.symbol, symbol)
  }
})

test('symbol identity participates in containing-node equivalence', () => {
  const shared = Symbol('same description')
  const distinct = Symbol('same description')
  const output = intern([{ symbol: shared }, { symbol: shared }, { symbol: distinct }, { symbol: distinct }])

  assert.equal(output[0], output[1])
  assert.equal(output[2], output[3])
  assert.notEqual(output[0], output[2])
  assert.equal(output[0]!.symbol, shared)
  assert.equal(output[2]!.symbol, distinct)
})

test('symbol keys retain identity, order, values, and normal descriptors', () => {
  const first = Symbol('first')
  const second = Symbol('second')
  const value = { nested: true }
  const input = { stringKey: value, [first]: value, [second]: 2 }
  const output = intern(input)

  assert.deepEqual(Reflect.ownKeys(output), ['stringKey', first, second])
  assert.equal(output.stringKey, output[first])
  assert.notEqual(output.stringKey, value)
  assert.equal(output[second], 2)
  for (const key of Reflect.ownKeys(input)) {
    assert.deepEqual(Object.getOwnPropertyDescriptor(output, key), Object.getOwnPropertyDescriptor(input, key))
  }
})

test('symbol-key identity participates in object and array equivalence', () => {
  const shared = Symbol('key')
  const distinct = Symbol('key')
  const objectOutput = intern([{ [shared]: 1 }, { [shared]: 1 }, { [distinct]: 1 }])
  assert.equal(objectOutput[0], objectOutput[1])
  assert.notEqual(objectOutput[0], objectOutput[2])

  const first = Object.assign([], { [shared]: 'value' })
  const second = Object.assign([], { [shared]: 'value' })
  const third = Object.assign([], { [distinct]: 'value' })
  const arrayOutput = intern([first, second, third])
  assert.equal(arrayOutput[0], arrayOutput[1])
  assert.notEqual(arrayOutput[0], arrayOutput[2])
  assert.equal(arrayOutput[0]![shared], 'value')
})

test('symbol atoms and edges are available to extensions', () => {
  class Holder {
    constructor(
      public tag: symbol,
      public edge: unknown = null
    ) {}
  }
  const extension = defineExtension<Holder, readonly [symbol], readonly [unknown]>({
    name: 'SymbolHolder',
    match: (value): value is Holder => value instanceof Holder,
    describe: value => ({ atoms: [value.tag], edges: [value.edge] }),
    allocate: ([tag]) => new Holder(tag),
    hydrate: (target, [edge]) => {
      target.edge = edge
    },
  })
  const tag = Symbol('tag')
  const edge = Symbol('edge')
  const output = intern([new Holder(tag, edge), new Holder(tag, edge)], { extensions: [extension] })

  assert.equal(output[0], output[1])
  assert.equal(output[0]!.tag, tag)
  assert.equal(output[0]!.edge, edge)
  const atom: Atom = tag
  assert.equal(atom, tag)
})
