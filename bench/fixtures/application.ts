import type { BenchmarkFixture } from '../types.js'
import { generateZodJsonSchema } from './zod/generate.js'

const capabilities = { yaml: true, json: true } as const
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

function jsonSchemaBundle(size: number): unknown {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $defs: Object.fromEntries(
      Array.from({ length: size }, (_, index) => [
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

function openApiDocument(size: number): unknown {
  return {
    openapi: '3.1.0',
    info: { title: 'Interner benchmark API', version: '1.0.0' },
    paths: Object.fromEntries(
      Array.from({ length: size }, (_, index) => [
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

function astGraph(size: number): unknown {
  return {
    type: 'Program',
    body: Array.from({ length: size }, (_, index) => ({
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

function configurationTree(size: number): unknown {
  return {
    services: Object.fromEntries(
      Array.from({ length: size }, (_, index) => [
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

function messageCatalog(size: number): unknown {
  const locales = ['en', 'fr', 'de', 'es']
  return Object.fromEntries(
    locales.map(locale => [
      locale,
      Object.fromEntries(
        Array.from({ length: size }, (_, index) => [
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

export function applicationFixtures(profile: 'quick' | 'full'): BenchmarkFixture[] {
  const size = profile === 'quick' ? 24 : 250
  const zodFields = profile === 'quick' ? 16 : 96
  return [
    {
      id: 'zod-json-schema',
      family: 'application',
      description:
        "JSON Schema generated from a checked-in Zod source definition using Zod's supported conversion API.",
      parameters: { fields: zodFields },
      capabilities,
      create: () => generateZodJsonSchema(zodFields),
    },
    {
      id: 'json-schema-bundle',
      family: 'application',
      description: 'A deterministic bundle of related JSON Schema definitions.',
      parameters: { definitions: size },
      capabilities,
      create: () => jsonSchemaBundle(size),
    },
    {
      id: 'openapi-document',
      family: 'application',
      description: 'An OpenAPI-like document with repeated parameters, responses and schemas.',
      parameters: { paths: size },
      capabilities,
      create: () => openApiDocument(size),
    },
    {
      id: 'ast-graph',
      family: 'application',
      description: 'A generated ESTree-like syntax graph with repeated node shapes.',
      parameters: { declarations: size * 4 },
      capabilities,
      create: () => astGraph(size * 4),
    },
    {
      id: 'configuration-tree',
      family: 'application',
      description: 'A generated service configuration tree with repeated runtime policies.',
      parameters: { services: size },
      capabilities,
      create: () => configurationTree(size),
    },
    {
      id: 'message-catalog',
      family: 'application',
      description: 'A localization catalog with repeated messages, metadata and placeholder definitions.',
      parameters: { messagesPerLocale: size },
      capabilities,
      create: () => messageCatalog(size),
    },
  ]
}
