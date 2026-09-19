import assert from 'node:assert/strict'
import { test } from 'node:test'
import { dump, load } from 'js-yaml'
import { syntheticFixtures } from '../../bench/fixtures/synthetic.js'
import { intern } from '../../src/index.js'

test('YAML can express newly shared schema nodes as aliases', () => {
  const input = { first: { type: 'string', minLength: 1 }, second: { type: 'string', minLength: 1 } }
  const output = load(dump(intern(input))) as typeof input
  assert.equal(output.first, output.second)
  assert.deepEqual(output, input)
})

test('YAML handles the full strongly connected benchmark depth', () => {
  const fixture = syntheticFixtures('full').find(value => value.id === 'large-strongly-connected-component')
  assert.ok(fixture)
  assert.match(dump(fixture.create()), /\*ref_0/)
})
