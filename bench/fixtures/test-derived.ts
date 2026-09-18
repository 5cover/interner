import type { BenchmarkFixture } from '../types.js'

interface SeedConfiguration {
  readonly id: string
  readonly seed: number
  readonly shape: 'deep' | 'wide' | 'mixed'
  readonly duplication: number
  readonly primitive: 'balanced' | 'heavy' | 'strings'
  readonly cyclic: boolean
}
const configurations: readonly SeedConfiguration[] = [
  { id: 'mostly-unique', seed: 192837, shape: 'mixed', duplication: 0.05, primitive: 'balanced', cyclic: false },
  { id: 'highly-duplicated', seed: 918273, shape: 'mixed', duplication: 0.85, primitive: 'balanced', cyclic: false },
  { id: 'deep', seed: 41041, shape: 'deep', duplication: 0.2, primitive: 'balanced', cyclic: false },
  { id: 'wide', seed: 88231, shape: 'wide', duplication: 0.25, primitive: 'balanced', cyclic: false },
  { id: 'cyclic', seed: 77191, shape: 'mixed', duplication: 0.4, primitive: 'balanced', cyclic: true },
  { id: 'mixed-arrays-objects', seed: 55661, shape: 'mixed', duplication: 0.35, primitive: 'balanced', cyclic: false },
  { id: 'primitive-heavy', seed: 60293, shape: 'wide', duplication: 0.2, primitive: 'heavy', cyclic: false },
  { id: 'string-heavy', seed: 34039, shape: 'wide', duplication: 0.45, primitive: 'strings', cyclic: false },
]

export function testDerivedFixtures(profile: 'quick' | 'full'): BenchmarkFixture[] {
  const selected =
    profile === 'quick'
      ? configurations.filter(config => ['highly-duplicated', 'cyclic', 'string-heavy'].includes(config.id))
      : configurations
  const nodes = profile === 'quick' ? 240 : 2_000
  return selected.map(config => ({
    id: `seed-${config.id}`,
    family: 'test-derived',
    description: `Deterministic property-style graph seed representing ${config.id.replaceAll('-', ' ')} data.`,
    parameters: { ...config, nodes },
    capabilities: { yaml: true, json: !config.cyclic },
    create: () => generate(config, nodes),
  }))
}

function generate(config: SeedConfiguration, count: number): unknown {
  const random = xorshift(config.seed)
  const nodes: Array<Record<string, unknown> | unknown[]> = []
  for (let index = 0; index < count; index++) {
    const duplicated = random() < config.duplication
    const duplicateBucket = duplicated ? Math.floor(random() * 8) : index
    const primitive =
      config.primitive === 'strings'
        ? `message-${duplicateBucket % 12}`
        : config.primitive === 'heavy'
          ? [duplicateBucket, true, null, `v${duplicateBucket % 5}`]
          : duplicateBucket
    const node: Record<string, unknown> | unknown[] =
      index % 2 === 0
        ? { kind: `kind-${duplicateBucket % 6}`, value: primitive }
        : [`kind-${duplicateBucket % 6}`, primitive]
    nodes.push(node)
    if (index > 0) {
      const target =
        config.shape === 'deep' ? index - 1 : duplicated ? duplicateBucket % index : Math.floor(random() * index)
      if (Array.isArray(node)) node.push(nodes[target])
      else node.child = nodes[target]
    }
  }
  if (config.cyclic && nodes.length > 1) {
    const first = nodes[0]!
    if (Array.isArray(first)) first.push(nodes.at(-1))
    else first.back = nodes.at(-1)
    const last = nodes.at(-1)!
    if (Array.isArray(last)) last.push(first)
    else last.back = first
  }
  return { root: nodes.at(-1), nodes }
}

function xorshift(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    return (state >>> 0) / 0x1_0000_0000
  }
}
