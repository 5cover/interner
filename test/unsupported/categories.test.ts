import assert from 'node:assert/strict'
import { test } from 'node:test'
import { intern } from '../../src/index.js'

test('unsupported semantic categories reject predictably', () => {
  class ArraySubclass extends Array {}
  class DateSubclass extends Date {}
  class RegExpSubclass extends RegExp {}
  const unsupported: unknown[] = [
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
    Object.create(Date.prototype),
    Object.create(RegExp.prototype),
    Object.create(Array.prototype),
  ]
  for (const value of unsupported) assert.throws(() => intern({ nested: value }), TypeError)
})

test('Date and RegExp descriptor rejection does not invoke structural accessors', () => {
  let calls = 0
  for (const base of [new Date(), /a/]) {
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
  for (const value of [new Date(), /a/]) {
    Object.defineProperty(value, Symbol('x'), { value: 1 })
    assert.throws(() => intern(value), TypeError)
  }
  assert.throws(() => intern(Object.defineProperty(/a/, 'lastIndex', { writable: false })), TypeError)
  assert.throws(() => intern(Object.assign(new Date(), { x: 1 })), TypeError)
  assert.throws(() => intern(Object.assign(/a/, { x: 1 })), TypeError)
})

test('unsupported failures carry useful locations', () => {
  for (const value of [new Date(), /a/]) {
    Object.defineProperty(value, 'hidden', { value: 1 })
    assert.throws(
      () => intern(value),
      error => error instanceof TypeError && /(root|node)/.test(error.message)
    )
  }
  assert.throws(
    () => intern(new Map()),
    error => error instanceof TypeError && /(root|node)/.test(error.message)
  )
})
