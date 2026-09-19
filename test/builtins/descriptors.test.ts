import assert from 'node:assert/strict'
import { test } from 'node:test'
import { intern } from '../../src/index.js'

test('plain-object data descriptors are preserved and participate in equivalence', () => {
  const symbol = Symbol('symbol property')
  const make = () => {
    const value: Record<PropertyKey, unknown> = {}
    Object.defineProperties(value, {
      hidden: { value: { nested: true }, enumerable: false, writable: false, configurable: false },
      visible: { value: 1, enumerable: true, writable: true, configurable: false },
      mutable: { value: 2, enumerable: false, writable: true, configurable: true },
    })
    Object.defineProperty(value, symbol, { value: 3, enumerable: true, writable: false, configurable: true })
    return value
  }

  const input = [make(), make()]
  const output = intern(input)
  const first = output[0]!
  const second = output[1]!
  assert.equal(first, second)
  assert.deepEqual(Reflect.ownKeys(first), ['hidden', 'visible', 'mutable', symbol])
  assert.deepEqual(Object.getOwnPropertyDescriptor(first, 'visible'), {
    value: 1,
    enumerable: true,
    writable: true,
    configurable: false,
  })
  assert.deepEqual(Object.getOwnPropertyDescriptor(first, 'mutable'), {
    value: 2,
    enumerable: false,
    writable: true,
    configurable: true,
  })
  const hidden = Object.getOwnPropertyDescriptor(first, 'hidden')!
  assert.equal(hidden.enumerable, false)
  assert.equal(hidden.writable, false)
  assert.equal(hidden.configurable, false)
  assert.deepEqual(hidden.value, { nested: true })
  assert.deepEqual(Object.getOwnPropertyDescriptor(first, symbol), {
    value: 3,
    enumerable: true,
    writable: false,
    configurable: true,
  })

  const sealed = Object.defineProperty({}, 'value', { value: 1, configurable: false })
  const configurable = Object.defineProperty({}, 'value', { value: 1, configurable: true })
  const different = intern([sealed, configurable])
  assert.notEqual(different[0], different[1])
})

test('accessors are preserved without invocation and participate in equivalence', () => {
  let calls = 0
  const getter = function (this: object) {
    calls++
    return this
  }
  const setter = function (value: unknown) {
    void value
    calls++
  }
  const symbol = Symbol('accessor')
  const make = () => {
    const value = {}
    Object.defineProperty(value, 'value', { get: getter, set: setter, enumerable: false, configurable: false })
    Object.defineProperty(value, symbol, { get: getter, enumerable: true, configurable: true })
    return value
  }

  const input = [make(), make()]
  const output = intern(input)
  const first = output[0]!
  const second = output[1]!
  assert.equal(calls, 0)
  assert.equal(first, second)
  assert.deepEqual(Object.getOwnPropertyDescriptor(first, 'value'), {
    get: getter,
    set: setter,
    enumerable: false,
    configurable: false,
  })
  assert.deepEqual(Object.getOwnPropertyDescriptor(first, symbol), {
    get: getter,
    set: undefined,
    enumerable: true,
    configurable: true,
  })

  const otherGetter = function () {
    return null
  }
  const left = Object.defineProperty({}, 'value', { get: getter })
  const right = Object.defineProperty({}, 'value', { get: otherGetter })
  const different = intern([left, right])
  assert.notEqual(different[0], different[1])
})

test('array descriptors, including non-writable length, are preserved', () => {
  let calls = 0
  const getter = function () {
    calls++
    return null
  }
  const symbol = Symbol('array accessor')
  const make = () => {
    const value = [{ nested: true }]
    Object.defineProperty(value, '0', { value: value[0], enumerable: true, writable: false, configurable: false })
    Object.defineProperty(value, 'hidden', { value: 1, enumerable: false, writable: false, configurable: false })
    Object.defineProperty(value, symbol, { get: getter, enumerable: true, configurable: true })
    Object.defineProperty(value, 'length', { writable: false })
    return value
  }

  const input = [make(), make()]
  const output = intern(input)
  const first = output[0]!
  const second = output[1]!
  assert.equal(calls, 0)
  assert.equal(first, second)
  assert.deepEqual(Reflect.ownKeys(first), ['0', 'length', 'hidden', symbol])
  assert.deepEqual(Object.getOwnPropertyDescriptor(first, '0'), {
    value: first[0],
    enumerable: true,
    writable: false,
    configurable: false,
  })
  assert.notEqual(first[0], input[0]![0])
  assert.deepEqual(Object.getOwnPropertyDescriptor(first, 'hidden'), {
    value: 1,
    enumerable: false,
    writable: false,
    configurable: false,
  })
  assert.deepEqual(Object.getOwnPropertyDescriptor(first, symbol), {
    get: getter,
    set: undefined,
    enumerable: true,
    configurable: true,
  })
  assert.deepEqual(Object.getOwnPropertyDescriptor(first, 'length'), {
    value: 1,
    enumerable: false,
    writable: false,
    configurable: false,
  })
})
