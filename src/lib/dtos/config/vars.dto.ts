import { z } from '@/lib/config/zod'
import { dbUrlValidation } from '@/lib/dtos/common'
import { createUserSchema } from '../user'

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
  ...createUserSchema.pick({ name: true, email: true, password: true }).shape,
})

export const authConfigSchema = z.strictObject({
  secret: z.string().trim().nonempty(),
})
