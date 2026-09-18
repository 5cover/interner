import assert from 'node:assert/strict'
import { test } from 'node:test'
import fc from 'fast-check'
import { intern } from '../../src/index.js'
import { atom } from '../generators/graph.js'
import { equivalent } from '../reference/model.js'
import { check } from '../properties/check.js'

test('SameValue over every primitive kind is preserved at roots and edges', () => {
  const atoms = [
    undefined,
    null,
    false,
    true,
    '',
    'undefined:undefined',
    'null',
    'number:0',
    NaN,
    0,
    -0,
    Infinity,
    -Infinity,
    1,
    1n,
    '1',
  ]
  for (const x of atoms) {
    assert.ok(Object.is(intern(x), x))
    for (const y of atoms) {
      const output = intern([{ x }, { x: y }])
      assert.equal(output[0] === output[1], Object.is(x, y))
    }
  }
  check('samevalue', fc.tuple(atom, atom), ([a, b]) => {
    const out = intern([{ a }, { a: b }])
    assert.equal(out[0] === out[1], Object.is(a, b))
  })
})

test('each object and array observation distinguishes nodes', () => {
  const cases: [unknown, unknown][] = [
    [
      { a: 1, b: 2 },
      { b: 2, a: 1 },
    ],
    [{ a: 1 }, { b: 1 }],
    [{ a: undefined }, {}],
    [{ length: 0 }, {}],
    [[undefined], new Array(1)],
    [[], new Array(1)],
    [{ 0: 1 }, [1]],
    [Object.assign([], { extra: 1 }), []],
    [
      [1, , 2],
      [1, 2, ,],
    ],
    [Object.assign([], { x: 1, y: 2 }), Object.assign([], { y: 2, x: 1 })],
  ]
  for (const [a, b] of cases) {
    const out = intern([a, b])
    assert.notEqual(out[0], out[1])
    assert.ok(equivalent(a, out[0]))
    assert.ok(equivalent(b, out[1]))
  }
})

test('Date and RegExp observations match structured clone', () => {
  const values = [
    new Date(NaN),
    new Date(NaN),
    new Date(0),
    new Date(1),
    /a/g,
    /a/i,
    /b/g,
    /a/g,
    /a/d,
    /a/m,
    /a/s,
    /a/u,
    new RegExp('a', 'v'),
    /a/y,
  ]
  ;(values[4] as RegExp).lastIndex = 42
  const out = intern(values)
  assert.equal(out[0], out[1])
  assert.equal(out[4], out[7])
  assert.equal((out[4] as RegExp).lastIndex, 0)
  assert.equal((values[4] as RegExp).lastIndex, 42)
  for (let i = 0; i < values.length; i++)
    for (let j = 0; j < values.length; j++) {
      assert.equal(out[i] === out[j], equivalent(values[i], values[j]))
    }
  assert.ok(equivalent(out, structuredClone(values)))
})

test('prototype-like keys, extreme sparse length, normal descriptors and mutation', () => {
  const input = JSON.parse('{"__proto__":{"safe":true},"constructor":1,"toString":2}') as object
  const out = intern(input)
  assert.equal(Object.getPrototypeOf(out), Object.prototype)
  assert.deepEqual(Reflect.ownKeys(out), Reflect.ownKeys(input))
  assert.ok(equivalent(input, out))
  const sparse = new Array(4294967295)
  const copy = intern(sparse)
  assert.equal(copy.length, sparse.length)
  assert.equal(Object.keys(copy).length, 0)
  const mutable = { a: { n: 1 }, b: { n: 1 } }
  const shared = intern(mutable)
  shared.a.n = 2
  assert.equal(shared.b.n, 2)
  assert.notEqual(shared, intern(shared))
  assert.equal(Object.getOwnPropertyDescriptor(shared, 'a')?.writable, true)
  assert.equal(Object.isExtensible(intern(Object.preventExtensions({}))), true)
})
