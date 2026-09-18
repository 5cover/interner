import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseDocument, stringify, isAlias, visit } from 'yaml'
import { intern } from '../../src/index.js'

test('YAML can express newly shared schema nodes as aliases', () => {
  const input = { first: { type: 'string', minLength: 1 }, second: { type: 'string', minLength: 1 } }
  const document = parseDocument(stringify(intern(input)))
  let aliases = 0
  visit(document, (_, node) => {
    if (isAlias(node)) aliases++
  })
  assert.equal(aliases, 1)
  assert.deepEqual(document.toJS(), input)
})
