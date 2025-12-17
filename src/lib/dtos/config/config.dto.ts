import { z } from '@/lib/config/zod'
import { Environment } from '@/lib/types/common.types'
import {
  saltRoundsSchema,
  databaseConfigSchema,
  testConfigSchema,
  authConfigSchema,
} from '@/lib/dtos/config/vars.dto'

const configBaseSchema = z.strictObject({
  port: z.coerce.number().nonnegative().default(3000),
  auth: authConfigSchema,
  saltRounds: saltRoundsSchema,
  database: databaseConfigSchema,
  corsOrigin: z.url({
    protocol: /^https?$/,
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
