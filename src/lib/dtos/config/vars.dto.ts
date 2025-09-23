import { z } from '@/lib/config/zod'
import { dbUrlValidation, processToString } from '@/lib/dtos/common'

const envVarSchema = z.preprocess(processToString, z.string().trim().nonempty())

export const saltRoundsSchema = z.coerce
  .number()
  .nonnegative()
  .lte(99)
  .default(10)

export const databaseConfigSchema = z.strictObject({
  url: z.coerce
    .string()
    .trim()
    .nonempty()
    .regex(dbUrlValidation.regex, dbUrlValidation.message),
})

export const testConfigSchema = z.strictObject({
  email: z.preprocess(processToString, z.email()),
  password: envVarSchema,
})

export const authConfigSchema = z.strictObject({ secret: envVarSchema })
