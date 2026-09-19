import type { Adapter } from '../graph/model.js'

const kind = {}

export function properties(value: object, location: string, array = false): { keys: PropertyKey[]; values: unknown[] } {
  const keys: PropertyKey[] = []
  const values: unknown[] = []
  for (const key of Reflect.ownKeys(value)) {
    const desc = Object.getOwnPropertyDescriptor(value, key)!
    if (array && key === 'length') {
      if (!desc.writable || desc.enumerable || desc.configurable || !('value' in desc))
        throw new TypeError(`Unsupported Array length descriptor at ${location}`)
      continue
    }
    if (!('value' in desc) || !desc.enumerable || !desc.writable || !desc.configurable) {
      throw new TypeError(`Unsupported property descriptor ${JSON.stringify(key)} at ${location}`)
    }
    keys.push(key)
    values.push(desc.value)
  }
  return { keys, values }
}

export function hydrateProperties(target: object, keys: readonly PropertyKey[], edges: readonly unknown[]): void {
  keys.forEach((key, i) =>
    Object.defineProperty(target, key, {
      value: edges[i],
      enumerable: true,
      writable: true,
      configurable: true,
    })
  )
}

export function objectAdapter(value: object, location: string): Adapter {
  const { keys, values } = properties(value, location)
  return {
    kind,
    atoms: keys,
    edges: values,
    allocate: () => ({}),
    hydrate: (target, edges) => hydrateProperties(target, keys, edges),
  }
}
