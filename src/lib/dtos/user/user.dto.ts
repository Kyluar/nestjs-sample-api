import { z } from '@/lib/config/zod'
import { createZodDto } from 'nestjs-zod'
import { Prisma, User } from '@prisma/client'
import { timestampSchema } from '../common'
import { strictObject } from 'zod'

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
