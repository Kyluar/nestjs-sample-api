import { z } from '@/lib/config/zod'

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

const dbConfigValidation = {
  regex: /^mysql:\/\/([^:]+):(.+)@([^@:]+):(\d+)\/(\w+)$/,
  message: 'O format do DATABASE_URL é inválido',
}

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
})

export type ConfigSchemaInput = z.input<typeof configSchema>
export type ConfigSchemaOutput = z.output<typeof configSchema>
