import type { Prisma, User } from '@prisma/client'
import { createZodDto } from 'nestjs-zod'
import { strictObject } from 'zod'
import { z } from '@/lib/config/zod'
import { timestampSchema } from '../common'

export const createUserSchema = z.strictObject({
  name: z.string().trim().nonempty(),
  email: z.email(),
  password: z.string().trim().nonempty(),
}) satisfies z.ZodType<Prisma.UserCreateInput>
export type CreateUserDtoType = z.infer<typeof createUserSchema>

export const updateUserSchema = strictObject(
  createUserSchema.omit({ password: true }).shape
).partial()
export type UpdateUserDtoType = z.infer<typeof updateUserSchema>

export const userSchema = z.strictObject({
  uuid: z.uuid(),
  ...createUserSchema.shape,
  ...timestampSchema.shape,
}) satisfies z.ZodType<User>

export const userResponseSchema = z.strictObject(
  userSchema.omit({ password: true }).shape
)
export type UserResponseDtoType = z.infer<typeof userResponseSchema>

export class CreateUserDto extends createZodDto(createUserSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
