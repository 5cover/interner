import assert from 'node:assert/strict'
import { test } from 'node:test'
import { syntheticFixtures } from '../../bench/fixtures/synthetic.js'
import { testDerivedFixtures } from '../../bench/fixtures/test-derived.js'

test('thousand-depth fixtures do not request YAML serialization', () => {
  const fixtures = [...syntheticFixtures('full'), ...testDerivedFixtures('full')]
  for (const id of ['unique-deep', 'large-strongly-connected-component', 'seed-deep']) {
    const fixture = fixtures.find(candidate => candidate.id === id)
    assert.ok(fixture, `missing ${id}`)
    assert.equal(fixture.capabilities.yaml, false, id)
  }
})
