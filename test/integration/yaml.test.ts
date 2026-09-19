import assert from 'node:assert/strict'
import { test } from 'node:test'
import { dump, load } from 'js-yaml'
import { intern } from '../../src/index.js'

test('YAML can express newly shared schema nodes as aliases', () => {
  const input = { first: { type: 'string', minLength: 1 }, second: { type: 'string', minLength: 1 } }
  const output = load(dump(intern(input))) as typeof input
  assert.equal(output.first, output.second)
  assert.deepEqual(output, input)
})
