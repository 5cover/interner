import { mkdirSync, writeFileSync } from 'node:fs'
import { inspect } from 'node:util'
import fc from 'fast-check'

/** Persist fast-check's minimized counterexample and replay coordinates on failure. */
export function check<T>(name: string, arbitrary: fc.Arbitrary<T>, predicate: (value: T) => void): void {
  if (process.env.FC_PROPERTY !== undefined && process.env.FC_PROPERTY !== name) return
  const seed = Number(process.env.FC_SEED ?? 20260918)
  const path = process.env.FC_PATH
  const result = fc.check(fc.property(arbitrary, predicate), {
    seed,
    numRuns: Number(process.env.FC_RUNS ?? 300),
    ...(path === undefined ? {} : { path }),
  })
  if (result.failed) {
    mkdirSync('reports/counterexamples', { recursive: true })
    const report = inspect(result, { depth: null })
    writeFileSync(`reports/counterexamples/${name}.txt`, report)
    throw new Error(
      `Property ${name} failed. Replay FC_PROPERTY=${name} FC_SEED=${result.seed} FC_PATH=${result.counterexamplePath}\n${report}`,
      { cause: result.errorInstance }
    )
  }
}
