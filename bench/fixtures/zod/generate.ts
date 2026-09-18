import * as z from 'zod'
import { createZodBenchmarkSchema } from './source.js'

export function generateZodJsonSchema(fields = 48): unknown {
  const generated = z.toJSONSchema(createZodBenchmarkSchema(fields), { target: 'draft-2020-12' })
  const jsonSchema = { ...generated }
  if (Object.getPrototypeOf(jsonSchema) !== Object.prototype || jsonSchema.type !== 'object')
    throw new Error('Zod did not generate the expected ordinary JSON Schema object')
  return jsonSchema
}
