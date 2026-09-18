import assert from 'node:assert/strict'
import { test } from 'node:test'
import { applicationObjectSources } from '../../fixtures/application/index.js'
import { intern } from '../../src/index.js'
import { equivalent, observe } from '../reference/model.js'

for (const source of applicationObjectSources) {
  test(`application fixture ${source.id}: preserves values and produces fresh graph identities`, () => {
    const input = source.create('quick')
    const before = observe([input])
    const result = intern(input)
    const inputObjects = new Set(observe([input]).objects)

    if (source.id === 'typescript-source-ast') assert.equal((input as { readonly kind?: unknown }).kind, 'SourceFile')
    assert.deepEqual(observe([input]), before)
    assert.ok(equivalent(input, result))
    for (const object of observe([result]).objects) assert.ok(!inputObjects.has(object))
  })
}
