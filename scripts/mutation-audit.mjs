import { readFileSync } from 'node:fs'

// Review report locations without depending on Stryker's console formatting.
const report = JSON.parse(readFileSync('reports/mutation/mutation.json', 'utf8'))
const totals = {}
for (const [file, result] of Object.entries(report.files)) {
  for (const mutant of result.mutants) {
    totals[mutant.status] = (totals[mutant.status] ?? 0) + 1
    if (mutant.status === 'Survived' || mutant.status === 'NoCoverage') {
      console.log(
        JSON.stringify({
          file,
          id: mutant.id,
          line: mutant.location.start.line,
          mutator: mutant.mutatorName,
          replacement: mutant.replacement,
          status: mutant.status,
        })
      )
    }
  }
}
console.log(JSON.stringify({ totals }))
