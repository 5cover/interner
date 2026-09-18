import type { BenchmarkFixture } from '../types.js'

const both = { yaml: true, json: true } as const
const yamlOnly = { yaml: true, json: false } as const

function chain(size: number, duplicate: boolean): unknown {
  let value: unknown = { kind: 'leaf', value: duplicate ? 1 : size }
  for (let index = 0; index < size; index++) value = { kind: 'node', index: duplicate ? index % 3 : index, next: value }
  return value
}

function cycle(size: number, labels: number): unknown {
  const nodes: Array<{ label: number; next?: unknown; branch?: unknown }> = Array.from(
    { length: size },
    (_, index) => ({ label: index % labels })
  )
  for (let index = 0; index < size; index++) nodes[index]!.next = nodes[(index + 1) % size]
  return nodes
}

export function syntheticFixtures(profile: 'quick' | 'full'): BenchmarkFixture[] {
  const size = profile === 'quick' ? 800 : 5_000
  const scalingSizes = profile === 'quick' ? [1_000, 2_500] : [1_000, 2_500, 5_000, 10_000, 25_000, 50_000, 100_000]
  const fixtures: BenchmarkFixture[] = [
    {
      id: 'unique-flat',
      family: 'synthetic',
      description: 'A flat array of unique records.',
      parameters: { nodes: size },
      capabilities: both,
      create: () => Array.from({ length: size }, (_, index) => ({ index, value: `value-${index}` })),
    },
    {
      id: 'unique-deep',
      family: 'synthetic',
      description: 'A unique linked object chain.',
      parameters: { nodes: Math.min(size, 2_500) },
      capabilities: { yaml: false, json: false },
      create: () => chain(Math.min(size, 2_500), false),
    },
    {
      id: 'unique-wide',
      family: 'synthetic',
      description: 'A wide object with unique child records.',
      parameters: { nodes: size },
      capabilities: both,
      create: () =>
        Object.fromEntries(
          Array.from({ length: size }, (_, index) => [`key${index}`, { index, value: `value-${index}` }])
        ),
    },
    {
      id: 'duplicate-leaves',
      family: 'synthetic',
      description: 'Many structurally equal leaf objects.',
      parameters: { nodes: size },
      capabilities: both,
      create: () => Array.from({ length: size }, () => ({ type: 'string', minLength: 1 })),
    },
    {
      id: 'duplicate-small-subtrees',
      family: 'synthetic',
      description: 'Many equal shallow schema fragments.',
      parameters: { nodes: size },
      capabilities: both,
      create: () =>
        Array.from({ length: size }, () => ({
          type: 'object',
          properties: { id: idFragment(), label: textFragment() },
          required: ['id', 'label'],
        })),
    },
    {
      id: 'duplicate-large-subtrees',
      family: 'synthetic',
      description: 'Many equal nested configuration subtrees.',
      parameters: { nodes: Math.ceil(size / 8) },
      capabilities: both,
      create: () => Array.from({ length: Math.ceil(size / 8) }, () => largeFragment()),
    },
    {
      id: 'low-redundancy',
      family: 'synthetic',
      description: 'A graph with approximately ten percent repeated records.',
      parameters: { nodes: size, redundancy: 0.1 },
      capabilities: both,
      create: () => redundancy(size, 10),
    },
    {
      id: 'medium-redundancy',
      family: 'synthetic',
      description: 'A graph with approximately half repeated records.',
      parameters: { nodes: size, redundancy: 0.5 },
      capabilities: both,
      create: () => redundancy(size, 2),
    },
    {
      id: 'high-redundancy',
      family: 'synthetic',
      description: 'A graph with approximately ninety percent repeated records.',
      parameters: { nodes: size, redundancy: 0.9 },
      capabilities: both,
      create: () => redundancy(size, 10, true),
    },
    {
      id: 'already-shared',
      family: 'synthetic',
      description: 'A source DAG whose repeated positions already share identities.',
      parameters: { edges: size },
      capabilities: both,
      create: () => {
        const shared = largeFragment()
        return Array.from({ length: size }, () => shared)
      },
    },
    {
      id: 'self-cycles',
      family: 'synthetic',
      description: 'Independent equivalent self-cycles.',
      parameters: { nodes: Math.min(size, 500) },
      capabilities: yamlOnly,
      create: () =>
        Array.from({ length: Math.min(size, 500) }, () => {
          const node: { label: string; next?: unknown } = { label: 'same' }
          node.next = node
          return node
        }),
    },
    {
      id: 'equivalent-cycles',
      family: 'synthetic',
      description: 'Many equivalent cyclic components.',
      parameters: { components: Math.min(size, 300) },
      capabilities: yamlOnly,
      create: () => Array.from({ length: Math.min(size, 300) }, () => cycle(3, 1)),
    },
    {
      id: 'large-strongly-connected-component',
      family: 'synthetic',
      description: 'One strongly connected component with repeating local observations.',
      parameters: { nodes: Math.min(size, 1_000) },
      capabilities: yamlOnly,
      create: () => cycle(Math.min(size, 1_000), 8),
    },
    {
      id: 'mixed-cyclic-and-acyclic',
      family: 'synthetic',
      description: 'Repeated trees connected to equivalent cycles.',
      parameters: { nodes: Math.min(size, 500) },
      capabilities: yamlOnly,
      create: () =>
        Array.from({ length: Math.min(size, 500) }, (_, index) => ({
          index: index % 4,
          tree: largeFragment(),
          ring: cycle(4, 2),
        })),
    },
  ]
  for (const nodes of scalingSizes)
    fixtures.push({
      id: `scaling-duplicate-small-${nodes}`,
      family: 'synthetic',
      description: 'Parameterized duplicate-small-subtrees scaling fixture.',
      parameters: { nodes, scalingFamily: 'duplicate-small-subtrees' },
      capabilities: both,
      create: () =>
        Array.from({ length: nodes }, () => ({
          type: 'object',
          properties: { id: idFragment(), label: textFragment() },
        })),
    })
  return fixtures
}

function idFragment() {
  return { type: 'string', pattern: '^[a-z0-9-]+$' }
}
function textFragment() {
  return { type: 'string', minLength: 1, maxLength: 160 }
}
function largeFragment() {
  return {
    runtime: { engine: 'node', versions: [22, 24, 26] },
    network: { retries: 3, timeout: 5_000 },
    schema: { id: idFragment(), label: textFragment(), tags: { type: 'array', items: textFragment() } },
  }
}
function redundancy(size: number, modulus: number, mostlyDuplicate = false): unknown {
  return Array.from({ length: size }, (_, index) => {
    const value = mostlyDuplicate ? index % modulus : index < size / modulus ? 0 : index
    return { value, child: { category: value % modulus, active: true } }
  })
}
