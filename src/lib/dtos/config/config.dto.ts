import { z } from '@/lib/config/zod'
import { processToString } from '../common/preprocess'
import { Environment } from '@/lib/types/common.types'
import { dbConfigValidation, envVarValidation } from '@/lib/dtos/common'

const testConfigSchema = z.strictObject({
  email: z.preprocess(processToString, z.email()),
  password: envVarValidation,
})

const configBaseSchema = z.strictObject({
  port: z.coerce.number().nonnegative().default(3000),
  auth: z.strictObject({ secret: envVarValidation }),
  saltRounds: z.coerce.number().nonnegative().lte(99).default(10),
  database: z.strictObject({
    url: z.coerce
      .string()
      .trim()
      .nonempty()
      .regex(dbConfigValidation.regex, dbConfigValidation.message),
  }),
})

export const configSchema = z.discriminatedUnion('nodeEnv', [
  configBaseSchema.extend({
    nodeEnv: z.union([
      z.literal(Environment.Development),
      z.literal(Environment.Production),
      z.literal(Environment.Provision),
    ]),
  }),

  configBaseSchema.extend({
    nodeEnv: z.literal(Environment.Test),
    test: testConfigSchema,
  }),
])

export type ConfigSchemaInput = z.input<typeof configSchema>
export type ConfigSchemaOutput = z.output<typeof configSchema>
export type TestConfigSchemaInput = z.input<typeof testConfigSchema>
export type TestConfigSchemaOutput = z.output<typeof testConfigSchema>
