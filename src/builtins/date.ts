import type { Adapter } from '../graph/model.js'

const kind = {}
export function dateAdapter(value: object, location: string): Adapter {
  if (Reflect.ownKeys(value).length !== 0) throw new TypeError(`Unsupported Date own properties at ${location}`)
  const time = Date.prototype.getTime.call(value)
  return { kind, atoms: [time], edges: [], allocate: () => new Date(time), hydrate: () => {} }
}
