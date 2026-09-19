import assert from 'node:assert/strict'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import { intern } from '../../src/index.js'

test('ordinary objects preserve a shared custom prototype without traversing inherited behavior', () => {
  let accessorCalls = 0
  const prototype = {
    describe(this: { name: string }) {
      return this.name
    },
    get derived() {
      accessorCalls++
      return `derived:${(this as unknown as { name: string }).name}`
    },
  }
  const make = () => Object.assign(Object.create(prototype), { name: 'example' })

  const input = [make(), make()]
  const output = intern(input)

  assert.equal(accessorCalls, 0)
  assert.equal(output[0], output[1])
  assert.notEqual(output[0], input[0])
  assert.equal(Object.getPrototypeOf(output[0]!), prototype)
  assert.equal(output[0]!.describe(), 'example')
  assert.equal(output[0]!.derived, 'derived:example')
  assert.equal(accessorCalls, 1)
})

test('null and foreign-realm ordinary prototypes are preserved by identity', () => {
  const makeNull = () => Object.assign(Object.create(null) as Record<string, unknown>, { name: 'null' })
  const nullOutput = intern([makeNull(), makeNull()])
  assert.equal(nullOutput[0], nullOutput[1])
  assert.equal(Object.getPrototypeOf(nullOutput[0]!), null)

  const foreign = runInNewContext('(() => { const a = { name: "foreign" }; return [a, { name: "foreign" }]; })()') as [
    Record<string, unknown>,
    Record<string, unknown>,
  ]
  const foreignPrototype = Object.getPrototypeOf(foreign[0])
  const foreignOutput = intern([foreign[0], foreign[1]])
  assert.equal(foreignOutput[0], foreignOutput[1])
  assert.equal(Object.getPrototypeOf(foreignOutput[0]!), foreignPrototype)
})

test('prototype identity is an ordinary-object observation', () => {
  const firstPrototype = { label: 'same' }
  const secondPrototype = { label: 'same' }
  const first = Object.assign(Object.create(firstPrototype), { name: 'example' })
  const second = Object.assign(Object.create(secondPrototype), { name: 'example' })
  const output = intern([first, second])

  assert.notEqual(output[0], output[1])
  assert.equal(Object.getPrototypeOf(output[0]!), firstPrototype)
  assert.equal(Object.getPrototypeOf(output[1]!), secondPrototype)
})

test('an opaque prototype may point into the input graph', () => {
  const prototype = { name: 'prototype' }
  const value = Object.assign(Object.create(prototype), { name: 'child' })
  const output = intern([prototype, value])

  assert.notEqual(output[0], prototype)
  assert.notEqual(output[1], value)
  assert.equal(Object.getPrototypeOf(output[1]!), prototype)
  assert.notEqual(Object.getPrototypeOf(output[1]!), output[0])
})

test('ordinary cycles retain their custom prototype', () => {
  const prototype = { kind: 'cyclic' }
  const make = () => {
    const value = Object.create(prototype) as { self: unknown }
    value.self = value
    return value
  }
  const input = [make(), make()]
  const output = intern(input)

  assert.equal(output[0], output[1])
  assert.notEqual(output[0], input[0])
  assert.equal(Object.getPrototypeOf(output[0]!), prototype)
  assert.equal(output[0]!.self, output[0])
})

test('changed prototypes do not make branded values ordinary objects', () => {
  const branded = [new Date(), /value/, new Map(), [], new URL('https://example.org')]
  for (const value of branded) {
    Object.setPrototypeOf(value, Object.prototype)
    assert.throws(() => intern(value), TypeError)
  }
})
