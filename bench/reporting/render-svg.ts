import { writeFile } from 'node:fs/promises'
import { parse, View } from 'vega'
import { compile, type TopLevelSpec } from 'vega-lite'

export async function renderSvg(spec: TopLevelSpec, outputPath: string): Promise<void> {
  const runtime = parse(compile(spec).spec)
  const svg = await new View(runtime, { renderer: 'none' }).runAsync().then(view => view.toSVG())
  await writeFile(outputPath, `${svg.trim()}\n`)
}
