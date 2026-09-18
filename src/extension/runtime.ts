import { isAtom, type Adapter } from '../graph/model.js'
import type { Atom } from '../types.js'
import type { Extension, RuntimeExtension } from './define.js'

function denseArray(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) throw new TypeError(`Extension ${label} must be an array`)
  const copy: unknown[] = []
  for (let i = 0; i < value.length; i++) {
    const desc = Object.getOwnPropertyDescriptor(value, String(i))
    if (!desc || !('value' in desc)) throw new TypeError(`Extension ${label} must be a dense data array`)
    copy.push(desc.value)
  }
  return copy
}

export function extensionAdapter(
  value: object,
  handle: Extension,
  extension: RuntimeExtension,
  location: string
): Adapter {
  const result = extension.describe(value)
  if (typeof result !== 'object' || result === null)
    throw new TypeError(`Malformed ${extension.name} descriptor at ${location}`)
  const rawAtoms = denseArray(Reflect.get(result, 'atoms'), `${extension.name} atoms at ${location}`)
  const edges = denseArray(Reflect.get(result, 'edges'), `${extension.name} edges at ${location}`)
  const atoms: Atom[] = []
  for (const atom of rawAtoms) {
    if (!isAtom(atom)) throw new TypeError(`Invalid ${extension.name} atom at ${location}`)
    atoms.push(atom)
  }
  return {
    kind: handle,
    atoms,
    edges,
    allocate: () => {
      const target = extension.allocate([...atoms])
      if (typeof target !== 'object' || target === null || !extension.match(target)) {
        throw new TypeError(`Invalid ${extension.name} allocation at ${location}`)
      }
      return target
    },
    hydrate: (target, outputEdges) => extension.hydrate(target, outputEdges),
  }
}
