import type { Atom, ExtensionDefinition } from '../types.js'

declare const brand: unique symbol
/** Opaque semantic adapter handle. Create with defineExtension(). */
export interface Extension {
  readonly [brand]: true
}

export interface RuntimeExtension {
  readonly name: string
  readonly match: (value: object) => boolean
  readonly describe: (value: object) => unknown
  readonly allocate: (atoms: readonly Atom[]) => object
  readonly hydrate: (target: object, edges: readonly unknown[]) => void
}
const definitions = new WeakMap<Extension, RuntimeExtension>()

/**
 * Defines structure, not equality or hashing. Atoms are intrinsic SameValue
 * observations; ordered edges describe recursive values. Built-ins take precedence,
 * then the first matching extension wins. This does not register a global adapter.
 *
 * Capture calls match/describe before reconstruction. All classes are allocated
 * before any hydrate callback. Definitions must be deterministic, input-preserving,
 * complete, traversal-independent and use stable tuple positions. Allocate fresh
 * matching instances without retaining input references; hydrate only its target.
 * Reconstructed descriptions must agree with the original semantics. Do not mutate
 * the registry. Malformed or inconsistent extensions invalidate their guarantees;
 * detectable violations throw TypeError and callback exceptions propagate unchanged.
 */
export function defineExtension<T extends object, const A extends readonly Atom[], const E extends readonly unknown[]>(
  extension: ExtensionDefinition<T, A, E>
): Extension {
  if (
    !extension ||
    typeof extension.name !== 'string' ||
    extension.name.length === 0 ||
    ['match', 'describe', 'allocate', 'hydrate'].some(key => typeof Reflect.get(extension, key) !== 'function')
  ) {
    throw new TypeError('Malformed extension definition')
  }
  const { name, match, describe, allocate, hydrate } = extension
  const handle = Object.freeze({}) as Extension
  // The only erasure boundary. Runtime descriptor validation protects these casts.
  definitions.set(handle, {
    name,
    match,
    describe: value => describe(value as T),
    allocate: atoms => allocate(atoms as A),
    hydrate: (target, edges) => hydrate(target as T, edges as E),
  })
  return handle
}

export function definition(extension: Extension): RuntimeExtension {
  const result = definitions.get(extension)
  if (!result) throw new TypeError('Invalid extension handle; use defineExtension()')
  return result
}
