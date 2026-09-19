import assert from 'node:assert/strict'
import { test } from 'node:test'
import { defineExtension, intern, type Atom, type Extension, type ExtensionDefinition } from '../../src/index.js'

class Node {
  constructor(
    public name: string,
    public edges: unknown[] = []
  ) {}
}
const base: ExtensionDefinition<Node, readonly [string], readonly unknown[]> = {
  name: 'Node',
  match: (value): value is Node => value instanceof Node,
  describe: value => ({ atoms: [value.name], edges: value.edges }),
  allocate: ([name]) => new Node(name),
  hydrate: (target, edges) => {
    target.edges = [...edges]
  },
}

test('dispatch precedence, registry order and distinct extension kinds', () => {
  const events: string[] = []
  const first = defineExtension({
    ...base,
    match: (v): v is Node => {
      events.push('first')
      return v instanceof Node
    },
  })
  const second = defineExtension({
    ...base,
    match: (v): v is Node => {
      events.push('second')
      return v instanceof Node
    },
  })
  const out = intern([{ plain: 1 }, new Node('x')], { extensions: [first, second] })
  assert.ok(out[1] instanceof Node)
  assert.ok(!events.includes('second'))
  assert.equal(events.length, 2) // capture and allocated-instance validation only
  const other = defineExtension({
    ...base,
    match: (v): v is Node => v instanceof Node && v.name === 'y',
    describe: () => ({ atoms: ['x'] as const, edges: [] }),
    allocate: () => new Node('y'),
  })
  const distinct = intern([new Node('x'), new Node('y')], { extensions: [other, first] })
  assert.notEqual(distinct[0], distinct[1])
  const catchAll = defineExtension<object, readonly [], readonly []>({
    name: 'all',
    match: (v): v is object => !!v,
    describe: () => {
      throw new Error('Built-in should win')
    },
    allocate: () => ({}),
    hydrate: () => {},
  })
  intern([{}, [], new Date(), /a/], { extensions: [catchAll] })
  const frozen = intern(Object.freeze({ x: 1 }), { extensions: [catchAll] })
  assert.deepEqual(Object.getOwnPropertyDescriptor(frozen, 'x'), {
    value: 1,
    enumerable: true,
    writable: false,
    configurable: false,
  })
})

test('all allocation precedes hydration; cycles and per-class callback counts', () => {
  const events: string[] = []
  const ext = defineExtension({
    ...base,
    describe: value => {
      events.push('describe')
      return base.describe(value)
    },
    allocate: atoms => {
      events.push('allocate')
      return base.allocate(atoms)
    },
    hydrate: (target, edges) => {
      events.push('hydrate')
      base.hydrate(target, edges)
    },
  })
  const a = new Node('a')
  const b = new Node('b')
  a.edges = [b]
  b.edges = [a]
  const out = intern([a, b, new Node('a', [b])], { extensions: [ext] })
  assert.equal(out[0], out[2])
  assert.equal(out[0]!.edges[0], out[1])
  assert.equal(out[1]!.edges[0], out[0])
  assert.deepEqual(events, ['describe', 'describe', 'describe', 'allocate', 'allocate', 'hydrate', 'hydrate'])
})

test('malformed definitions, descriptors and allocations fail; errors propagate', () => {
  assert.throws(() => defineExtension({ ...base, name: '' }), TypeError)
  assert.throws(() => defineExtension({ ...base, match: 1 } as unknown as typeof base), TypeError)
  assert.throws(() => intern({}, { extensions: [{} as Extension] }), TypeError)
  for (const descriptor of [
    null,
    1,
    {},
    { atoms: {}, edges: [] },
    { atoms: [], edges: {} },
    { atoms: [{}], edges: [] },
    { atoms: new Array(1), edges: [] },
    { atoms: [], edges: new Array(1) },
    { atoms: Object.defineProperty([], '0', { get: () => 1 }), edges: [] },
  ]) {
    const ext = defineExtension({ ...base, describe: () => descriptor as unknown as ReturnType<typeof base.describe> })
    assert.throws(() => intern(new Node('x'), { extensions: [ext] }), TypeError)
  }
  const source = new Node('source')
  for (const allocation of [null, 1, {}, source]) {
    const ext = defineExtension({ ...base, allocate: () => allocation as Node })
    assert.throws(() => intern(source, { extensions: [ext] }), TypeError)
  }
  const reused = new Node('reused')
  assert.throws(
    () =>
      intern([new Node('a'), new Node('b')], { extensions: [defineExtension({ ...base, allocate: () => reused })] }),
    TypeError
  )
  for (const callback of ['match', 'describe', 'allocate', 'hydrate'] as const) {
    const error = new Error(callback)
    const ext = defineExtension({
      ...base,
      [callback]: () => {
        throw error
      },
    })
    assert.throws(
      () => intern(new Node('x'), { extensions: [ext] }),
      e => e === error
    )
  }
})

test('captured descriptors and definitions are snapshots, not retained mutable tuples', () => {
  const atoms: Atom[] = []
  const edges: unknown[] = []
  const ext = defineExtension<Node, readonly Atom[], readonly unknown[]>({
    ...base,
    describe: node => {
      atoms[0] = node.name
      edges[0] = node.name
      return { atoms, edges }
    },
    allocate: values => {
      const node = new Node(String(values[0]))
      ;(values as Atom[])[0] = 'changed'
      return node
    },
  })
  const out = intern([new Node('a'), new Node('b')], { extensions: [ext] })
  assert.equal(out[0]!.name, 'a')
  assert.equal(out[1]!.name, 'b')
  assert.deepEqual(out[0]!.edges, ['a'])
  assert.deepEqual(out[1]!.edges, ['b'])
  const definition = { ...base }
  const handle = defineExtension(definition)
  definition.describe = () => {
    throw new Error('changed')
  }
  assert.equal(intern(new Node('safe'), { extensions: [handle] }).name, 'safe')
})

test('input-mutating callbacks are outside the extension laws, not silently repaired', () => {
  const source = new Node('before')
  const ext = defineExtension({
    ...base,
    describe: value => {
      value.name = 'after'
      return base.describe(value)
    },
  })
  assert.equal(intern(source, { extensions: [ext] }).name, 'after')
  assert.equal(source.name, 'after')
})

test('malformed boundaries diagnose their extension and validate allocation categories', () => {
  for (const name of [1, {}, null, false]) {
    assert.throws(() => defineExtension({ ...base, name } as unknown as typeof base), TypeError)
  }
  assert.throws(
    () => defineExtension(null as unknown as typeof base),
    e => e instanceof TypeError && /extension/i.test(e.message)
  )
  assert.throws(
    () => intern({}, { extensions: [{} as Extension] }),
    e => e instanceof TypeError && /extension/i.test(e.message)
  )
  for (const descriptor of [
    null,
    1,
    { atoms: {}, edges: [] },
    { atoms: [], edges: {} },
    { atoms: new Array(1), edges: [] },
  ]) {
    const ext = defineExtension({ ...base, describe: () => descriptor as unknown as ReturnType<typeof base.describe> })
    assert.throws(
      () => intern(new Node('x'), { extensions: [ext] }),
      e => e instanceof TypeError && /Node/.test(e.message) && /(root|node)/.test(e.message)
    )
  }
  for (const allocation of [null, 1, () => 1]) {
    const ext = defineExtension({
      ...base,
      match: (value): value is Node => {
        assert.ok(typeof value === 'object' && value !== null, 'match must receive only objects')
        return true
      },
      allocate: () => allocation as unknown as Node,
    })
    assert.throws(
      () => intern(new Node('x'), { extensions: [ext] }),
      e => e instanceof TypeError && /Node.*(root|node)/.test(e.message)
    )
  }
  const source = new Node('source')
  const ext = defineExtension({ ...base, allocate: () => source })
  assert.throws(
    () => intern(source, { extensions: [ext] }),
    e => e instanceof TypeError && /class/.test(e.message)
  )
})
