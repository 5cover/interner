import type { Adapter } from '../graph/model.js'
import { hydrateProperties, properties } from './object.js'

const kind = {}
export function arrayAdapter(value: unknown[], location: string): Adapter {
  const { keys, values } = properties(value, location, true)
  const length = value.length
  return {
    kind,
    atoms: [length, ...keys],
    edges: values,
    allocate: () => new Array(length),
    hydrate: (target, edges) => hydrateProperties(target, keys, edges),
  }
}
