// Compile-only checks for the public type surface and tuple inference.
import { defineExtension, intern, type Atom, type Extension } from '../../src/index.js'

const literal = intern({ type: 'string', minimum: 1 })
const name: 'string' = literal.type
const minimum: 1 = literal.minimum
void [name, minimum]

class Box {
  constructor(
    public name: string,
    public next: Box | null = null
  ) {}
}

const inferred: Extension = defineExtension({
  name: 'Box',
  match: (value): value is Box => value instanceof Box,
  describe: value => ({ atoms: [value.name] as const, edges: [value.next] as const }),
  allocate: ([label]) => new Box(label),
  hydrate: (target, [next]) => {
    target.next = next
  },
})
const box: Box = intern(new Box('example'), { extensions: [inferred] })
void box

// @ts-expect-error Handles cannot be manufactured structurally.
const fake: Extension = {}
// @ts-expect-error Symbols are not intrinsic atoms.
const badAtom: Atom = Symbol('x')
void [fake, badAtom]
