import type { Adapter } from '../graph/model.js'
import { types } from 'node:util'
import { URL, URLSearchParams } from 'node:url'
import { arrayAdapter } from './array.js'
import { dateAdapter } from './date.js'
import { objectAdapter } from './object.js'
import { regexpAdapter } from './regexp.js'

const unsupportedBrands = [
  types.isArgumentsObject,
  types.isAnyArrayBuffer,
  types.isArrayBufferView,
  types.isBoxedPrimitive,
  types.isCryptoKey,
  types.isExternal,
  types.isKeyObject,
  types.isMap,
  types.isMapIterator,
  types.isModuleNamespaceObject,
  types.isNativeError,
  types.isPromise,
  types.isSet,
  types.isSetIterator,
  types.isSharedArrayBuffer,
  types.isWeakMap,
  types.isWeakSet,
] as const
const urlToString = URL.prototype.toString
const urlSearchParamsToString = URLSearchParams.prototype.toString

function hasUnsupportedBrand(value: object): boolean {
  if (unsupportedBrands.some(check => check(value))) return true
  try {
    urlToString.call(value)
    return true
  } catch {
    // Not a URL.
  }
  try {
    urlSearchParamsToString.call(value)
    return true
  } catch {
    // Not a URLSearchParams.
  }
  return false
}

/**
 * Claims standard built-ins before extensions and rejects detectable branded values
 * whose changed prototype must not make them ordinary structural objects.
 */
export function builtin(value: object, location: string): Adapter | undefined {
  const proto: unknown = Object.getPrototypeOf(value)
  if (Array.isArray(value)) {
    if (proto === Array.prototype) return arrayAdapter(value, location)
    throw new TypeError(`Unsupported Array prototype at ${location}`)
  }
  if (types.isDate(value)) {
    if (proto === Date.prototype) return dateAdapter(value, location)
    throw new TypeError(`Unsupported Date prototype at ${location}`)
  }
  if (types.isRegExp(value)) {
    if (proto === RegExp.prototype) return regexpAdapter(value, location)
    throw new TypeError(`Unsupported RegExp prototype at ${location}`)
  }
  if (hasUnsupportedBrand(value)) throw new TypeError(`Unsupported branded object at ${location}`)
  if (proto === Array.prototype || proto === Date.prototype || proto === RegExp.prototype)
    throw new TypeError(`Unsupported malformed built-in candidate at ${location}`)
  if (proto === Object.prototype) return objectAdapter(value, location)
  return undefined
}
