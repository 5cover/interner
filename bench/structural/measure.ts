import type { StructuralMetrics } from '../types.js'

const arrayIndex = /^(?:0|[1-9]\d*)$/

export function measureStructure(root: unknown): StructuralMetrics {
  const metrics = {
    objectNodes: 0,
    arrayNodes: 0,
    dateNodes: 0,
    regexpNodes: 0,
    edges: 0,
    objectProperties: 0,
    arrayElements: 0,
    arrayHoles: 0,
    strings: 0,
    stringCodeUnits: 0,
    numbers: 0,
    bigints: 0,
    booleans: 0,
    nulls: 0,
    undefineds: 0,
    functions: 0,
    symbols: 0,
    totalReferenceNodes: 0,
  }
  const seen = new Set<object>()
  const queue: unknown[] = [root]
  for (let index = 0; index < queue.length; index++) {
    const value = queue[index]
    if (value === null) {
      metrics.nulls++
      continue
    }
    switch (typeof value) {
      case 'undefined':
        metrics.undefineds++
        continue
      case 'string':
        metrics.strings++
        metrics.stringCodeUnits += value.length
        continue
      case 'number':
        metrics.numbers++
        continue
      case 'bigint':
        metrics.bigints++
        continue
      case 'boolean':
        metrics.booleans++
        continue
      case 'function':
        metrics.functions++
        continue
      case 'symbol':
        metrics.symbols++
        continue
      case 'object':
        break
    }
    if (seen.has(value)) continue
    seen.add(value)
    metrics.totalReferenceNodes++
    if (Array.isArray(value)) {
      metrics.arrayNodes++
      for (let element = 0; element < value.length; element++) {
        if (Object.hasOwn(value, element)) {
          metrics.arrayElements++
          metrics.edges++
          queue.push(value[element])
        } else metrics.arrayHoles++
      }
      for (const key of Object.keys(value)) {
        if (arrayIndex.test(key) && Number(key) < value.length) continue
        metrics.objectProperties++
        metrics.edges++
        queue.push(value[key as unknown as number])
      }
    } else if (value instanceof Date) metrics.dateNodes++
    else if (value instanceof RegExp) metrics.regexpNodes++
    else {
      metrics.objectNodes++
      for (const key of Object.keys(value)) {
        metrics.objectProperties++
        metrics.edges++
        queue.push((value as Record<string, unknown>)[key])
      }
    }
  }
  return metrics
}
