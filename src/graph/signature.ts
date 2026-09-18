import type { Atom } from '../types.js'
import type { Node } from './model.js'

// Type tags and JSON framing make this encoding unambiguous. Numbers do not
// pass through Map's SameValueZero semantics or JSON's NaN/-0 normalization.
function atomKey(value: Atom): string {
  if (typeof value === 'number') return Object.is(value, -0) ? 'number:-0' : `number:${String(value)}`
  return `${typeof value}:${String(value)}`
}

export function signature(node: Node, classes?: readonly number[]): string {
  return JSON.stringify([
    node.kind,
    node.atoms.map(atomKey),
    node.edges.map(edge => ('atom' in edge ? ['a', atomKey(edge.atom)] : ['n', classes ? classes[edge.node] : 0])),
  ])
}

export function hashSignature(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619)
  return hash >>> 0
}

export class SignatureTable {
  private readonly buckets = new Map<number, { key: string; id: number }[]>()
  size = 0
  constructor(private readonly hash: (key: string) => number = hashSignature) {}
  intern(key: string): number {
    const hash = this.hash(key)
    const bucket = this.buckets.get(hash) ?? []
    const existing = bucket.find(entry => entry.key === key)
    if (existing) return existing.id
    const id = this.size++
    bucket.push({ key, id })
    this.buckets.set(hash, bucket)
    return id
  }
}
