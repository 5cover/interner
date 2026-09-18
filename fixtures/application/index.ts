import { createZodJsonSchema } from './zod.js'
import { createTypeScriptSourceAst } from './typescript-ast.js'

export type ApplicationFixtureProfile = 'quick' | 'full'
export type ApplicationFixtureParameters = Readonly<Record<string, number>>

export interface ApplicationObjectSource {
  readonly id: string
  readonly description: string
  readonly parameters: (profile: ApplicationFixtureProfile) => ApplicationFixtureParameters
  readonly create: (profile: ApplicationFixtureProfile) => unknown
}

const textRule = () => ({ type: 'string', minLength: 1, maxLength: 160 })
const idRule = () => ({ type: 'string', pattern: '^[a-z][a-z0-9-]{2,31}$' })
const addressRule = () => ({
  type: 'object',
  properties: {
    street: textRule(),
    city: textRule(),
    postalCode: textRule(),
    countryCode: { type: 'string', minLength: 2, maxLength: 2 },
  },
  required: ['street', 'city', 'postalCode', 'countryCode'],
})

function size(profile: ApplicationFixtureProfile): number {
  return profile === 'quick' ? 24 : 250
}

function jsonSchemaBundle(definitions: number): unknown {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $defs: Object.fromEntries(
      Array.from({ length: definitions }, (_, index) => [
        `Record${index}`,
        {
          type: 'object',
          properties: { id: idRule(), label: textRule(), address: addressRule() },
          required: ['id', 'label'],
        },
      ])
    ),
  }
}

function openApiDocument(paths: number): unknown {
  return {
    openapi: '3.1.0',
    info: { title: 'Interner benchmark API', version: '1.0.0' },
    paths: Object.fromEntries(
      Array.from({ length: paths }, (_, index) => [
        `/records/${index}`,
        {
          get: {
            parameters: [{ name: 'tenant', in: 'header', required: true, schema: idRule() }],
            responses: {
              '200': { description: 'Record', content: { 'application/json': { schema: addressRule() } } },
              '404': {
                description: 'Not found',
                content: { 'application/json': { schema: { type: 'object', properties: { message: textRule() } } } },
              },
            },
          },
        },
      ])
    ),
  }
}

function astGraph(declarations: number): unknown {
  return {
    type: 'Program',
    body: Array.from({ length: declarations }, (_, index) => ({
      type: 'VariableDeclaration',
      kind: 'const',
      declarations: [
        {
          type: 'VariableDeclarator',
          id: { type: 'Identifier', name: `value${index}` },
          init: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'factory' },
            arguments: [{ type: 'Literal', value: index % 8 }],
          },
        },
      ],
    })),
  }
}

function configurationTree(services: number): unknown {
  return {
    services: Object.fromEntries(
      Array.from({ length: services }, (_, index) => [
        `service-${index}`,
        {
          runtime: { image: 'node:24-alpine', resources: { cpu: '500m', memory: '512Mi' } },
          health: { path: '/health', intervalSeconds: 10, timeoutSeconds: 2 },
          logging: { format: 'json', level: 'info', destinations: ['stdout'] },
        },
      ])
    ),
  }
}

function messageCatalog(messagesPerLocale: number): unknown {
  const locales = ['en', 'fr', 'de', 'es']
  return Object.fromEntries(
    locales.map(locale => [
      locale,
      Object.fromEntries(
        Array.from({ length: messagesPerLocale }, (_, index) => [
          `screen.${index}.action`,
          {
            message: index % 3 === 0 ? 'Continue' : 'Cancel',
            description: 'Primary action label',
            placeholders: { user: { type: 'string' } },
          },
        ])
      ),
    ])
  )
}

export const applicationObjectSources: readonly ApplicationObjectSource[] = [
  {
    id: 'zod-json-schema',
    description: "JSON Schema generated from a checked-in Zod source definition using Zod's supported conversion API.",
    parameters: profile => ({ fields: profile === 'quick' ? 16 : 96 }),
    create: profile => createZodJsonSchema(profile === 'quick' ? 16 : 96),
  },
  {
    id: 'json-schema-bundle',
    description: 'A deterministic bundle of related JSON Schema definitions.',
    parameters: profile => ({ definitions: size(profile) }),
    create: profile => jsonSchemaBundle(size(profile)),
  },
  {
    id: 'openapi-document',
    description: 'An OpenAPI-like document with repeated parameters, responses and schemas.',
    parameters: profile => ({ paths: size(profile) }),
    create: profile => openApiDocument(size(profile)),
  },
  {
    id: 'ast-graph',
    description: 'A generated ESTree-like syntax graph with repeated node shapes.',
    parameters: profile => ({ declarations: size(profile) * 4 }),
    create: profile => astGraph(size(profile) * 4),
  },
  {
    id: 'typescript-source-ast',
    description: 'A portable TypeScript AST parsed from the source of its own fixture module.',
    parameters: () => ({}),
    create: () => createTypeScriptSourceAst(),
  },
  {
    id: 'configuration-tree',
    description: 'A generated service configuration tree with repeated runtime policies.',
    parameters: profile => ({ services: size(profile) }),
    create: profile => configurationTree(size(profile)),
  },
  {
    id: 'message-catalog',
    description: 'A localization catalog with repeated messages, metadata and placeholder definitions.',
    parameters: profile => ({ messagesPerLocale: size(profile) }),
    create: profile => messageCatalog(size(profile)),
  },
]
