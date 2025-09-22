import { z } from '@/lib/config/zod'
import { stringOrUndefined } from './preprocess'
import { Environment } from '@/lib/types/common.types'

const dbConfigValidation = {
  regex: /^mysql:\/\/([^:]+):(.+)@([^@:]+):(\d+)\/(\w+)$/,
  message: 'O format do DATABASE_URL é inválido',
}

const testConfigValidation = z.strictObject({
  email: z.preprocess(stringOrUndefined, z.email().or(z.undefined())),
  password: z.preprocess(
    stringOrUndefined,
    z.string().trim().nonempty().or(z.undefined())
  ),
})

export const configSchema = z.strictObject({
  nodeEnv: z.enum(Environment).default(Environment.Development),
  port: z.coerce.number().nonnegative().default(3000),
  auth: z.strictObject({ secret: z.coerce.string().trim().nonempty() }),
  saltRounds: z.coerce.number().nonnegative().lte(99).default(10),
  database: z.strictObject({
    url: z.coerce
      .string()
      .trim()
      .nonempty()
      .regex(dbConfigValidation.regex, dbConfigValidation.message),
  }),
  test: testConfigValidation,
})

export type ConfigSchemaInput = z.input<typeof configSchema>
export type ConfigSchemaOutput = z.output<typeof configSchema>
