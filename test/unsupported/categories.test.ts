import assert from 'node:assert/strict'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import { intern } from '../../src/index.js'

test('unsupported semantic categories reject predictably', () => {
  class Custom {}
  class ArraySubclass extends Array {}
  class DateSubclass extends Date {}
  class RegExpSubclass extends RegExp {}
  const unsupported: unknown[] = [
    new Custom(),
    Object.create(null),
    new ArraySubclass(),
    new DateSubclass(),
    new RegExpSubclass('a'),
    Promise.resolve(),
    new WeakMap(),
    new WeakSet(),
    new Map(),
    new Set(),
    new Number(1),
    new String('a'),
    new Boolean(true),
    Object(1n),
    Object(Symbol()),
    new Error(),
    new ArrayBuffer(4),
    new Uint8Array(4),
    new DataView(new ArrayBuffer(4)),
    new SharedArrayBuffer(4),
    new URL('https://example.org'),
    runInNewContext('({})'),
    Object.create(Date.prototype),
    Object.create(RegExp.prototype),
    Object.create(Array.prototype),
  ]
  for (const value of unsupported) assert.throws(() => intern({ nested: value }), TypeError)
})

test('descriptor rejection does not invoke structural accessors', () => {
  let calls = 0
  for (const base of [{}, [], new Date(), /a/]) {
    Object.defineProperty(base, 'bad', {
      enumerable: true,
      get() {
        calls++
        throw new Error('getter invoked')
      },
    })
    assert.throws(() => intern(base), TypeError)
  }
  assert.equal(calls, 0)
  for (const value of [{}, [], new Date(), /a/]) {
    Object.defineProperty(value, Symbol('x'), { value: 1 })
    assert.throws(() => intern(value), TypeError)
  }
  for (const flag of ['writable', 'enumerable', 'configurable'])
    for (const value of [{}, []]) {
      Object.defineProperty(value, 'x', {
        value: 1,
        writable: true,
        enumerable: true,
        configurable: true,
        [flag]: false,
      })
      assert.throws(() => intern(value), TypeError)
    }
  for (const value of [[], /a/]) {
    Object.defineProperty(value, Array.isArray(value) ? 'length' : 'lastIndex', { writable: false })
    assert.throws(() => intern(value), TypeError)
  }
  assert.throws(() => intern(Object.assign(new Date(), { x: 1 })), TypeError)
  assert.throws(() => intern(Object.assign(/a/, { x: 1 })), TypeError)
})

test('abnormal symbol descriptors reject without invoking accessors', () => {
  let calls = 0
  for (const value of [{}, []]) {
    Object.defineProperty(value, Symbol('accessor'), {
      enumerable: true,
      configurable: true,
      get() {
        calls++
        throw new Error('symbol getter invoked')
      },
    })
    assert.throws(() => intern(value), TypeError)
  }
  assert.equal(calls, 0)
  for (const flag of ['writable', 'enumerable', 'configurable']) {
    const value = {}
    Object.defineProperty(value, Symbol(flag), {
      value: 1,
      writable: true,
      enumerable: true,
      configurable: true,
      [flag]: false,
    })
    assert.throws(() => intern(value), TypeError)
  }
})

test('unsupported failures carry useful locations', () => {
  for (const value of [new Date(), /a/, {}, []]) {
    Object.defineProperty(value, 'hidden', { value: 1 })
    assert.throws(
      () => intern(value),
      error => error instanceof TypeError && /node/.test(error.message)
    )
  }
  const frozenLength = Object.defineProperty([], 'length', { writable: false })
  assert.throws(
    () => intern(frozenLength),
    error => error instanceof TypeError && /node/.test(error.message)
  )
  assert.throws(
    () => intern(new Map()),
    error => error instanceof TypeError && /node/.test(error.message)
  )
})
