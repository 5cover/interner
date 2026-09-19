import type { ApplicationFixtureProfile } from './index.js'

function count(profile: ApplicationFixtureProfile): number {
  return profile === 'quick' ? 12 : 96
}

export function createDescriptorFeatureGraph(profile: ApplicationFixtureProfile): unknown {
  const symbolKey = Symbol('descriptor key')
  const prototype = {
    describe(this: { name: string }) {
      return this.name
    },
  }
  const getter = function (this: { name: string }) {
    return this.name
  }
  const setter = function (value: unknown) {
    void value
  }
  const record = () => {
    const value = Object.create(prototype) as Record<PropertyKey, unknown>
    Object.defineProperty(value, 'name', { value: 'descriptor', enumerable: true, writable: true, configurable: true })
    Object.defineProperty(value, 'hidden', {
      value: { type: 'hidden', enabled: true },
      enumerable: false,
      writable: false,
      configurable: false,
    })
    Object.defineProperty(value, 'computed', { get: getter, set: setter, enumerable: false, configurable: false })
    Object.defineProperty(value, symbolKey, {
      value: { type: 'symbol-key' },
      enumerable: true,
      writable: false,
      configurable: true,
    })
    return value
  }
  return { records: Array.from({ length: count(profile) }, record), symbolKey }
}

export function createOpaqueAtomFeatureGraph(profile: ApplicationFixtureProfile): unknown {
  const symbolKey = Symbol('key')
  const sharedSymbol = Symbol('shared')
  const sharedFunction = function sharedFunction() {
    return 'shared'
  }
  const record = (symbol: symbol, callable: () => string) => ({ symbol, callable, [symbolKey]: callable })
  const duplicates = Array.from({ length: count(profile) }, () => record(sharedSymbol, sharedFunction))
  const distinct = Array.from({ length: count(profile) }, () => record(Symbol('distinct'), () => 'distinct'))
  return { duplicates, distinct, symbolKey, sharedSymbol, sharedFunction }
}

export function createPrototypeFeatureGraph(profile: ApplicationFixtureProfile): unknown {
  let inheritedAccessorCalls = 0
  const prototype = {
    describe(this: { name: string }) {
      return `prototype:${this.name}`
    },
    get label() {
      inheritedAccessorCalls++
      return (this as unknown as { name: string }).name
    },
  }
  const record = () => {
    const value = Object.create(prototype) as { name: string; self?: unknown }
    value.name = 'custom-prototype'
    value.self = value
    return value
  }
  const nullRecord = () => Object.assign(Object.create(null) as Record<string, unknown>, { name: 'null-prototype' })
  return {
    prototype,
    records: Array.from({ length: count(profile) }, record),
    nullRecords: Array.from({ length: count(profile) }, nullRecord),
    inheritedAccessorCalls: () => inheritedAccessorCalls,
  }
}
