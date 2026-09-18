import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as ts from 'typescript'

interface PortableTypeScriptNode {
  readonly kind: string
  readonly children: readonly PortableTypeScriptNode[]
  readonly text?: string
}

/**
 * Parses this module's own TypeScript source and converts the compiler AST into
 * the ordinary-object graph supported by interner. Compiler nodes themselves
 * carry TypeScript-specific prototypes and internal state, so they are not
 * valid interner inputs.
 */
export function createTypeScriptSourceAst(): PortableTypeScriptNode {
  const filename = fileURLToPath(import.meta.url)
  const source = readFileSync(filename, 'utf8')
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
  return project(file)
}

function project(node: ts.Node): PortableTypeScriptNode {
  const children: PortableTypeScriptNode[] = []
  ts.forEachChild(node, child => {
    children.push(project(child))
  })

  const text = nodeText(node)
  if (text === undefined) return { kind: ts.SyntaxKind[node.kind], children }
  return { kind: ts.SyntaxKind[node.kind], text, children }
}

function nodeText(node: ts.Node): string | undefined {
  if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node) || ts.isStringLiteralLike(node)) return node.text
  if (ts.isNumericLiteral(node) || ts.isBigIntLiteral(node)) return node.text
  return undefined
}
