import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  createDescriptorFeatureGraph,
  createOpaqueAtomFeatureGraph,
  createPrototypeFeatureGraph,
} from '../../fixtures/application/language-features.js'
import { intern } from '../../src/index.js'

test('descriptor fixture retains descriptors, accessors and symbol keys', () => {
  const input = createDescriptorFeatureGraph('quick') as {
    records: Record<PropertyKey, unknown>[]
    symbolKey: symbol
  }
  const output = intern(input)
  assert.equal(output.records[0], output.records[1])
  const record = output.records[0]!
  const hidden = Object.getOwnPropertyDescriptor(record, 'hidden')!
  assert.equal(hidden.enumerable, false)
  assert.equal(hidden.writable, false)
  assert.equal(hidden.configurable, false)
  assert.notEqual(hidden.value, Object.getOwnPropertyDescriptor(input.records[0]!, 'hidden')!.value)
  assert.deepEqual(Object.getOwnPropertyDescriptor(record, 'computed'), {
    get: Object.getOwnPropertyDescriptor(input.records[0]!, 'computed')!.get,
    set: Object.getOwnPropertyDescriptor(input.records[0]!, 'computed')!.set,
    enumerable: false,
    configurable: false,
  })
  assert.deepEqual(Object.getOwnPropertyDescriptor(record, input.symbolKey), {
    value: Object.getOwnPropertyDescriptor(record, input.symbolKey)!.value,
    enumerable: true,
    writable: false,
    configurable: true,
  })
})

test('opaque-atom fixture merges shared identities but not distinct ones', () => {
  const input = createOpaqueAtomFeatureGraph('quick') as {
    duplicates: Record<PropertyKey, unknown>[]
    distinct: Record<PropertyKey, unknown>[]
    sharedSymbol: symbol
    sharedFunction: () => string
  }
  const output = intern(input)
  assert.equal(output.duplicates[0], output.duplicates[1])
  assert.notEqual(output.distinct[0], output.distinct[1])
  assert.equal(output.duplicates[0]!.symbol, input.sharedSymbol)
  assert.equal(output.duplicates[0]!.callable, input.sharedFunction)
})

test('prototype fixture retains opaque prototypes without invoking inherited accessors', () => {
  const input = createPrototypeFeatureGraph('quick') as {
    prototype: object
    records: Array<{ name: string; self: unknown }>
    nullRecords: Array<Record<string, unknown>>
    inheritedAccessorCalls: () => number
  }
  const output = intern(input)
  assert.equal(input.inheritedAccessorCalls(), 0)
  assert.equal(output.records[0], output.records[1])
  assert.equal(Object.getPrototypeOf(output.records[0]!), input.prototype)
  assert.equal(output.records[0]!.self, output.records[0])
  assert.equal(Object.getPrototypeOf(output.nullRecords[0]!), null)
  assert.equal(Object.getPrototypeOf(output.prototype), Object.prototype)
})
