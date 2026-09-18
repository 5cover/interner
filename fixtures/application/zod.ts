import * as z from 'zod'

const identifier = () =>
  z
    .string()
    .regex(/^[a-z][a-z0-9-]{2,31}$/)
    .min(3)
    .max(32)
const requiredText = () => z.string().trim().min(1).max(160)
const address = () =>
  z.object({
    street: requiredText(),
    city: requiredText(),
    postalCode: z.string().regex(/^[0-9A-Z -]{3,12}$/),
    countryCode: z.string().length(2),
  })
const contact = () =>
  z.object({
    id: identifier(),
    name: requiredText(),
    email: z.email(),
    phone: z.string().regex(/^\+[1-9][0-9]{7,14}$/),
    billingAddress: address(),
    shippingAddress: address(),
    tags: z.array(identifier()).max(20),
  })

export function createZodApplicationSchema(fields = 48) {
  const records = Object.fromEntries(Array.from({ length: fields }, (_, index) => [`contact${index + 1}`, contact()]))
  return z.object({
    accountId: identifier(),
    primary: contact(),
    contacts: z.array(contact()).min(1),
    records: z.object(records),
    destination: z.union([address(), z.object({ pickupId: identifier(), instructions: requiredText() })]),
  })
}

export function createZodJsonSchema(fields = 48): unknown {
  const generated = z.toJSONSchema(createZodApplicationSchema(fields), { target: 'draft-2020-12' })
  // Zod 4 attaches non-enumerable protocol metadata that lies outside interner's supported domain.
  const jsonSchema = { ...generated }
  if (Object.getPrototypeOf(jsonSchema) !== Object.prototype || jsonSchema.type !== 'object')
    throw new Error('Zod did not generate the expected ordinary JSON Schema object')
  return jsonSchema
}
