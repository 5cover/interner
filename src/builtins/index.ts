import type { Adapter } from '../graph/model.js'
import { arrayAdapter } from './array.js'
import { dateAdapter } from './date.js'
import { objectAdapter } from './object.js'
import { regexpAdapter } from './regexp.js'

export function builtin(value: object, location: string): Adapter | undefined {
  const proto: unknown = Object.getPrototypeOf(value)
  if (proto === Object.prototype) return objectAdapter(value, location)
  if (proto === Array.prototype && Array.isArray(value)) return arrayAdapter(value, location)
  if (proto === Date.prototype) return dateAdapter(value, location)
  if (proto === RegExp.prototype) return regexpAdapter(value, location)
  return undefined
}
