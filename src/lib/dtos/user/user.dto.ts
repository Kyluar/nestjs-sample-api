import { z } from '@/lib/config/zod'
import { createZodDto } from 'nestjs-zod'
import { Prisma, User } from '@prisma/client'
import { timestampSchema } from '../common'

export const createUserSchema = z.strictObject({
  name: z.string().trim().nonempty(),
  email: z.email(),
  password: z.string(),
}) satisfies z.ZodType<Prisma.UserCreateInput>

export const updateUserSchema = createUserSchema.partial()

export const userSchema = z.strictObject({
  uuid: z.uuid(),
  ...createUserSchema.shape,
  ...timestampSchema.shape,
}) satisfies z.ZodType<User>

export class CreateUserDto extends createZodDto(createUserSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
