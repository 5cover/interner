import type { Atom } from '../types.js'
import type { Adapter } from '../graph/model.js'

const kind = {}
const data = 'data'
const accessor = 'accessor'

interface DataProperty {
  readonly kind: typeof data
  readonly key: PropertyKey
  readonly enumerable: boolean
  readonly configurable: boolean
  readonly writable: boolean
}

interface AccessorProperty {
  readonly kind: typeof accessor
  readonly key: PropertyKey
  readonly enumerable: boolean
  readonly configurable: boolean
}

export type PropertyLayout = DataProperty | AccessorProperty

export interface CapturedProperties {
  readonly atoms: Atom[]
  readonly edges: unknown[]
  readonly layout: PropertyLayout[]
  readonly lengthWritable?: boolean
}

export function properties(value: object, location: string, array = false): CapturedProperties {
  const atoms: Atom[] = []
  const edges: unknown[] = []
  const layout: PropertyLayout[] = []
  let lengthWritable: boolean | undefined

  for (const key of Reflect.ownKeys(value)) {
    const desc = Object.getOwnPropertyDescriptor(value, key)!
    if (array && key === 'length') {
      if (
        !('value' in desc) ||
        desc.value !== (value as unknown[]).length ||
        desc.enumerable !== false ||
        desc.configurable !== false ||
        typeof desc.writable !== 'boolean'
      )
        throw new TypeError(`Unsupported Array length descriptor at ${location}: ${JSON.stringify(desc)}`)
      lengthWritable = desc.writable
      continue
    }
    if ('value' in desc) {
      if (
        typeof desc.enumerable !== 'boolean' ||
        typeof desc.configurable !== 'boolean' ||
        typeof desc.writable !== 'boolean'
      )
        throw new TypeError(`Malformed data descriptor ${String(key)} at ${location}`)
      atoms.push(key, data, desc.enumerable, desc.configurable, desc.writable)
      edges.push(desc.value)
      layout.push({
        kind: data,
        key,
        enumerable: desc.enumerable,
        configurable: desc.configurable,
        writable: desc.writable,
      })
    } else {
      if (
        typeof desc.enumerable !== 'boolean' ||
        typeof desc.configurable !== 'boolean' ||
        (desc.get !== undefined && typeof desc.get !== 'function') ||
        (desc.set !== undefined && typeof desc.set !== 'function')
      )
        throw new TypeError(`Malformed accessor descriptor ${String(key)} at ${location}`)
      atoms.push(key, accessor, desc.enumerable, desc.configurable)
      edges.push(desc.get, desc.set)
      layout.push({ kind: accessor, key, enumerable: desc.enumerable, configurable: desc.configurable })
    }
  }

  if (array) {
    if (lengthWritable === undefined) throw new TypeError(`Missing Array length descriptor at ${location}`)
    return { atoms, edges, layout, lengthWritable }
  }
  return { atoms, edges, layout }
}

export function hydrateProperties(target: object, layout: readonly PropertyLayout[], edges: readonly unknown[]): void {
  let edge = 0
  for (const property of layout) {
    if (property.kind === data) {
      Object.defineProperty(target, property.key, {
        value: edges[edge++],
        enumerable: property.enumerable,
        writable: property.writable,
        configurable: property.configurable,
      })
    } else {
      const get = edges[edge++] as (() => unknown) | undefined
      const set = edges[edge++] as ((value: unknown) => void) | undefined
      const descriptor: PropertyDescriptor = { enumerable: property.enumerable, configurable: property.configurable }
      if (get !== undefined) descriptor.get = get
      if (set !== undefined) descriptor.set = set
      Object.defineProperty(target, property.key, descriptor)
    }
  }
}

export function objectAdapter(value: object, location: string): Adapter {
  const captured = properties(value, location)
  return {
    kind,
    atoms: captured.atoms,
    edges: captured.edges,
    allocate: () => ({}),
    hydrate: (target, edges) => hydrateProperties(target as object, captured.layout, edges),
  }
}
