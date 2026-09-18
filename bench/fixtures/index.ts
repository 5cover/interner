import type { BenchmarkFixture } from '../types.js'
import { applicationFixtures } from './application.js'
import { syntheticFixtures } from './synthetic.js'
import { testDerivedFixtures } from './test-derived.js'

export function fixturesForProfile(profile: 'quick' | 'full'): BenchmarkFixture[] {
  const fixtures = [...applicationFixtures(profile), ...syntheticFixtures(profile), ...testDerivedFixtures(profile)]
  if (profile === 'full') return fixtures
  const quickIds = new Set([
    'zod-json-schema',
    'openapi-document',
    'typescript-source-ast',
    'configuration-tree',
    'duplicate-small-subtrees',
    'already-shared',
    'self-cycles',
    'seed-highly-duplicated',
    'seed-cyclic',
    'scaling-duplicate-small-1000',
    'scaling-duplicate-small-2500',
  ])
  return fixtures.filter(fixture => quickIds.has(fixture.id))
}

export function findFixture(profile: 'quick' | 'full', id: string): BenchmarkFixture {
  const fixture = fixturesForProfile(profile).find(candidate => candidate.id === id)
  if (!fixture) throw new Error(`Unknown ${profile} benchmark fixture: ${id}`)
  return fixture
}
