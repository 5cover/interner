import type { BenchmarkFixture } from '../types.js'
import { applicationObjectSources } from '../../fixtures/application/index.js'

const capabilities = { yaml: true, json: true } as const

export function applicationFixtures(profile: 'quick' | 'full'): BenchmarkFixture[] {
  return applicationObjectSources.map(source => ({
    id: source.id,
    family: 'application',
    description: source.description,
    parameters: source.parameters(profile),
    capabilities,
    create: () => source.create(profile),
  }))
}
