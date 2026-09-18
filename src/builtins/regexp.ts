import type { Adapter } from '../graph/model.js'

const kind = {}
const sourceGetter = Object.getOwnPropertyDescriptor(RegExp.prototype, 'source')!.get!
const flagNames = [
  'hasIndices',
  'global',
  'ignoreCase',
  'multiline',
  'dotAll',
  'unicode',
  'unicodeSets',
  'sticky',
] as const
const flags = ['d', 'g', 'i', 'm', 's', 'u', 'v', 'y']
const flagGetters = flagNames.map(name => Object.getOwnPropertyDescriptor(RegExp.prototype, name)!.get!)

export function regexpAdapter(value: object, location: string): Adapter {
  const keys = Reflect.ownKeys(value)
  const lastIndex = Object.getOwnPropertyDescriptor(value, 'lastIndex')
  if (
    keys.length !== 1 ||
    keys[0] !== 'lastIndex' ||
    !lastIndex ||
    !('value' in lastIndex) ||
    !lastIndex.writable ||
    lastIndex.enumerable ||
    lastIndex.configurable
  ) {
    throw new TypeError(`Unsupported RegExp properties at ${location}`)
  }
  const source = sourceGetter.call(value) as string
  const options = flagGetters.map((get, i) => (get.call(value) ? flags[i] : '')).join('')
  return { kind, atoms: [source, options], edges: [], allocate: () => new RegExp(source, options), hydrate: () => {} }
}
