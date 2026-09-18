import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

// Exercise the published layout in an isolated consumer, not a source import.
const directory = mkdtempSync(join(tmpdir(), 'interner-smoke-'))
try {
  const packageDirectory = join(directory, 'node_modules/interner')
  mkdirSync(packageDirectory, { recursive: true })
  const manifest = JSON.parse(readFileSync('package.json', 'utf8'))
  cpSync('package.json', join(packageDirectory, 'package.json'))
  for (const file of manifest.files) cpSync(file, join(packageDirectory, file), { recursive: true })
  const consumer = join(directory, 'consumer.mjs')
  writeFileSync(
    consumer,
    `
    import assert from 'node:assert/strict'
    import * as api from 'interner'
    assert.deepEqual(Object.keys(api).sort(), ['defineExtension', 'intern'])
    const source = [{ n: 1 }, { n: 1 }]
    const out = api.intern(source)
    assert.equal(out[0], out[1])
    assert.notEqual(out[0], source[0])
    await assert.rejects(import('interner/graph/refine.js'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' })
  `
  )
  const result = spawnSync(process.execPath, [consumer], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const typeConsumer = join(directory, 'consumer.mts')
  writeFileSync(
    typeConsumer,
    `
    import { intern, defineExtension, type Extension } from 'interner'
    const literal: 'ok' = intern({ status: 'ok' }).status
    class Box { constructor(public name: string) {} }
    const extension: Extension = defineExtension({
      name: 'Box', match: (value): value is Box => value instanceof Box,
      describe: value => ({ atoms: [value.name] as const, edges: [] as const }),
      allocate: ([name]) => new Box(name), hydrate: () => {},
    })
    const box: Box = intern(new Box(literal), { extensions: [extension] })
    // @ts-expect-error Extensions are opaque handles.
    const fake: Extension = {}
    void [box, fake]
  `
  )
  const typecheck = spawnSync(
    process.execPath,
    [
      join(process.cwd(), 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--module',
      'NodeNext',
      '--target',
      'ES2022',
      '--strict',
      '--skipLibCheck',
      typeConsumer,
    ],
    { encoding: 'utf8', cwd: directory }
  )
  assert.equal(typecheck.status, 0, typecheck.stdout + typecheck.stderr)
  console.log('Package export smoke test passed')
} finally {
  rmSync(directory, { recursive: true, force: true })
}
