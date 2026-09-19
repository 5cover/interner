import type { Adapter } from '../graph/model.js'
import { hydrateProperties, properties } from './object.js'

const kind = {}
export function arrayAdapter(value: unknown[], location: string): Adapter {
  const captured = properties(value, location, true)
  const length = value.length
  const lengthWritable = captured.lengthWritable!
  return {
    kind,
    atoms: [length, lengthWritable, ...captured.atoms],
    edges: captured.edges,
    allocate: () => new Array(length),
    hydrate: (target, edges) => {
      hydrateProperties(target as object, captured.layout, edges)
      Object.defineProperty(target, 'length', { writable: lengthWritable })
    },
  }
}
